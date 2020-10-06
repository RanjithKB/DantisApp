const mongoose = require('mongoose');

const product = new mongoose.Schema({
    productName: {
        type: String
    },
    productCode: {
        type: String
    },
    quantity: {
        type: Number
    },
    reOrderQuantity: {
        type: Number
    },
    price: {
        type: Number
    },
    category: {
        type: String
    },
    brandName: {
        type: String
    },
    dealer: {
        type: String
    },
    taxId: {
        type: String
    }
});

module.exports = Product = mongoose.model('product', product);