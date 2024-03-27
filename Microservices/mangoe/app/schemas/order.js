const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    _id: String,
    product_ids: [],
    quantities: [],
    date_created: Date,
    date_modified: Date,
    status: String,
    total_cost: Number
});

const Order = model('Order', orderSchema, 'orders');

module.exports = Order;