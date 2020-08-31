const mongoose = require('mongoose');

const product =  new mongoose.Schema({
    productName: {
        type: String
    },
    quantity: {
        type: Number
    },
    reorderQuantity: {
        type: Number
    },
    price: {
        type: Number
    }
});

module.exports = Product = mongoose.model('product',product);