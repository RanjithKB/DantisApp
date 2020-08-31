var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var connectDB = require('./DB/connection');
const route = require('./Api/User');
const routeProduct = require('./Api/product')


const port = 3000;
var app = express();
connectDB();

//adding middleware -cors

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
//     next();
//   });

app.use(cors());


//body parser
app.use(bodyparser.json());

//routes
app.use('/api/userModel',route);
app.use('/api/product',routeProduct);

app.listen(port,() =>{
    console.log('Server started at port:',+port);
});