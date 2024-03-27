function dotProduct(vecA, vecB) {
    return vecA.reduce((acc, current, index) => acc + (current * vecB[index]), 0);
}

function magnitude(vec) {
    return Math.sqrt(vec.reduce((acc, current) => acc + (current ** 2), 0));
}

function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw "Vectors are not of the same dimension.";
    }
    
    const dotProd = dotProduct(vecA, vecB);
    const magnitudeA = magnitude(vecA);
    const magnitudeB = magnitude(vecB);
    
    return dotProd / (magnitudeA * magnitudeB);
}

module.exports = cosineSimilarity;