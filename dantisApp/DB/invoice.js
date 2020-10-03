const mongoose = require('mongoose');

const invoice = new mongoose.Schema({

    productName: {
        type: String
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    taxId: {
        type: String
    },
    billingNumber: {
        type: Number
    },
    datetime: {
        type: Date
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    phonenumber: {
        type: Number
    },
    payModeId: {
        type: Number
    },
    paidamount: {
        type: Number
    }

});

module.exports = Invoice = mongoose.model('invoiceinformation', invoice);