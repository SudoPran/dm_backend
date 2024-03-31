const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
    _id: String,
    title: String,
    category: String,
    price: String,
    rating: String,
    ratingCount: String,
    description: String,
    review: String,
    reviewContent: String,
    img_link: String,
    seller_id: String
});

const Product = model('Product', productSchema, 'products');

module.exports = Product;