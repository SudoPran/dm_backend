const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

async function generateEmbeddings(sentences) {
  const model = await use.load();
  const embeddings = await model.embed(sentences);
  return embeddings;
}

module.exports = generateEmbeddings;