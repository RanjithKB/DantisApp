const mongoose = require('mongoose');

const user =  new mongoose.Schema({
    userName: {
        type: String
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    superAdmin: {
        type: Boolean
    }
});

module.exports = User = mongoose.model('userDetail',user);