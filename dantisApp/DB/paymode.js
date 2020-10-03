const mongoose = require('mongoose');

const paymode = new mongoose.Schema({

    payModeId: {
        type: Number
    },
    payModeName: {
        type: String
    }
});

module.exports = Paymode = mongoose.model('paymentmode', paymode);