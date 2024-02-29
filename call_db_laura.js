const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function searchById(id) {
    try {
        const database = client.db('dm_laura');
        const inventory = database.collection('inventory');
        const query = { _id: id };
        return await inventory.findOne(query);
    }
    finally {
        await client.close();
    }
};

async function loadAllProducts() {
    try {
        const database = client.db('dm_laura');
        const inventory = database.collection('inventory');
        return await inventory.find({}).toArray(function (result) {
            return result;
        });
    }
    finally {
        await client.close();
    }
}

module.exports = {
    searchById,
    loadAllProducts
}