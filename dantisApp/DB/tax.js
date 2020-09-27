const mongoose = require('mongoose');

const tax = new mongoose.Schema({
    Name: {
        type: String
    },
    Value: {
        type: Number
    }
});

module.exports = Tax = mongoose.model('taxlist', tax);