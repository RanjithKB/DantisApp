const mongoose = require('mongoose');

const URI = "mongodb+srv://admin:1234@firstcluster.aav0c.mongodb.net/dantis?retryWrites=true&w=majority";

const connectDB = async () => {
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    });
    console.log('Connected to DB');
};

module.exports = connectDB;