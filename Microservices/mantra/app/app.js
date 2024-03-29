const express = require('express');
const fs = require('fs').promises;

const seedProductData = require('./data-generator/seed-product-data.json');
const seedOrderData = require('./data-generator/seed-order-data.json');

const mongoose = require('mongoose');
const Products = require('./schemas/product');
const Orders = require('./schemas/order');

const generateEmbeddings = require('./embedding-generator');
const cosineSimilarity = require('./cosine-similarity')
const { substringChecker, findIndicesOfExactMatchesSorted } = require('./exact-matcher')

const app = express();
const port = 3002;

var productTitleEmbeddings;

function saveEmbeddingsAsJSON(array, filename) {
    const data = JSON.stringify(array, null, 2);

    fs.writeFile(filename, data, (err) => {
        if (err) throw err;
        console.log('Embeddings saved...');
    });
}

async function readEmbeddingsFromJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading or parsing the file:", error);
        return [];
    }
}

async function seedData() {
    await Products.insertMany(seedProductData).catch(err => console.error('Error seeding products...', err));
    await Orders.insertMany(seedOrderData).catch(err => console.error('Error seeding orders...', err));
}

async function initEmbeddings() {
    let sentences = seedProductData.map(x => x.title);
    let embeddings = await generateEmbeddings(sentences);
    return await embeddings.array();
}

mongoose.connect('mongodb://mongo:27017/mantra-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB Connected...');

        // Seed Data...
        seedData();

        // Generate embeddings of products based on product titles...
        // Embeddings have been generated for now, calling from the file...
        // productTitleEmbeddings = await initEmbeddings();
        // saveEmbeddingsAsJSON(productTitleEmbeddings, 'embeddings.json');

        productTitleEmbeddings = await readEmbeddingsFromJSON('embeddings.json');
    })
    .catch(err => console.log(err));

async function getItemById(id) {
    return await Products.findOne({ _id: id }).exec();
}

async function getEntryByIndex(index) {
    try {
        const entry = await Products.find().skip(index).limit(1);
        return entry[0];
    } catch (error) {
        console.error('Error retrieving entry at index ${index}:', error);
    }
}

async function compareCosineSimilarity(searchQueryVector, countProducts) {
    let cosineSimilarityList = [];
    for (let i = 0; i < countProducts; i++) {
        cosineSimilarityList.push(cosineSimilarity(searchQueryVector, productTitleEmbeddings[i]));
    }

    const indexedValues = cosineSimilarityList.map((value, index) => ({ value, index }));
    indexedValues.sort((a, b) => b.value - a.value);
    return indexedValues.map(obj => obj.index);
}

app.get('/getItems/', async (req, res) => {
    let matches = {
        exactPhraseMatches: [],
        exactWordMatches: [],
        semanticMatches: []
    };
    if (req.query && req.query.query) {
        let titles = await Products.find({}, 'title');
        titles = titles.map(doc => doc.title);
        // Exact Phrase Matching...
        let exactPhraseSortedIndices = substringChecker(titles, req.query.query);
        if (exactPhraseSortedIndices && exactPhraseSortedIndices.length > 0) {
            for (let i = 0; i < exactPhraseSortedIndices.length; i++) {
                if (i == 10) { break; }
                matches.exactPhraseMatches.push(await getEntryByIndex(exactPhraseSortedIndices[i]));
            }
        }

        // Exact Word Searching...
        let exactSortedIndices = findIndicesOfExactMatchesSorted(titles, req.query.query);

        if (exactSortedIndices && exactSortedIndices.length > 0) {
            for (let i = 0; i < exactSortedIndices.length; i++) {
                if (i == 10) { break; }
                matches.exactWordMatches.push(await getEntryByIndex(exactSortedIndices[i]));
            }
        }

        // Semantic Searching...
        searchQueryVector = await generateEmbeddings(req.query.query);
        searchQueryVector = await searchQueryVector.array();
        searchQueryVector = searchQueryVector[0];

        const countProducts = await Products.countDocuments();
        const semanticSortedIndices = await compareCosineSimilarity(searchQueryVector, countProducts);
        output = await getEntryByIndex(semanticSortedIndices[0]);

        if (semanticSortedIndices && semanticSortedIndices.length > 0) {
            for (let i = 0; i < semanticSortedIndices.length; i++) {
                if (i == 10) { break; }
                matches.semanticMatches.push(await getEntryByIndex(semanticSortedIndices[i]));
            }
        }
    }
    res.send(JSON.stringify(matches));
});

app.listen(port, () => {
    console.log('Mantra API is listening on Port: 3002');
});
