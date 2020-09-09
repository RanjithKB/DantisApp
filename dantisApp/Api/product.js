var express = require('express');
var Product = require('../DB/product');

const route = express.Router();


//add admin product
route.post('/',async(req,res) => {
    const{productName,quantity,reorderQuantity,price} = req.body;

    let product = {};
    product.productName = productName;
    product.quantity = quantity;
    product.reorderQuantity = reorderQuantity;
    product.price = price;
    
    let productModel = new Product(product);
    await productModel.save();
    let resModel ={
        id: productModel._id,
        success: true
    }
    res.json(resModel);
});

route.get('/getProducts',(req, res) =>{
    Product.find((err,lists) => {
        res.json(lists);
    });
});


module.exports = route;