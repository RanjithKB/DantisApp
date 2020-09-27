var express = require('express');
var Product = require('../DB/product');
var Tax = require('../DB/tax');

const route = express.Router();


//add admin product
route.post('/', async (req, res) => {
    const { productName, quantity, reOrderQuantity, price, category, brandName, dealer, taxId } = req.body;

    let product = {};
    product.productName = productName;
    product.quantity = quantity;
    product.reOrderQuantity = reOrderQuantity;
    product.price = price;
    product.category = category;
    product.brandName = brandName;
    product.dealer = dealer;
    product.taxId = taxId;

    let resModel = {
        id: 0,
        success: false
    }

    let productModel = new Product(product);
    await productModel.save(function (err) {
        if (err) {
            resModel.success = false;
        }
        else {
            resModel.success = true;
            resModel.id = productModel._id
        }
        res.json(resModel);
    });
});

//update product
route.post('/updateProduct', async (req, res) => {
    const { id, productName, quantity, reOrderQuantity, price, category, brandName, dealer, taxId } = req.body;

    let product = {};
    product._id = id;
    product.productName = productName;
    product.quantity = quantity;
    product.reOrderQuantity = reOrderQuantity;
    product.price = price;
    product.category = category;
    product.brandName = brandName;
    product.dealer = dealer;
    product.taxId = taxId;

    let resModel = {
        id: 0,
        success: false
    }

    let productModel = new Product(product);
    Product.findOneAndUpdate({ _id: product._id }, productModel, (err, product) => {
        if (err) {
            resModel.success = false;
        } else {
            resModel.success = true;
            resModel.id = productModel._id
        }
        res.json(resModel);
    });
});

route.get('/getProducts', (req, res) => {
    Product.find((err, lists) => {
        res.json(lists);
    });
});

route.get('/getTaxList', (req, res) => {
    Tax.find((err, lists) => {
        if (err) {
            res.json(err);
        } else {
            res.json(lists);
        }
    });
});

route.get('/getProductDetails', (req, res) => {
    let id = req.query.productId;
    var query = Product.where({ _id: id });
    query.findOne((err, details) => {
        if (err) {
            res.json(null);
        } else {
            res.json(details);
        }
    })
});


route.delete('/deleteProduct', (req, res) => {
    let id = req.query.productId;
    let resModel = {
        success: true
    };
    var query = Product.where({ _id: id });
    query.deleteOne({ _id: id }, (err, result) => {
        if (err) {
            res.json(err);
            // resModel.success = false;
        } else {
            if (result.deletedCount == 1) {
                resModel.success = true;
                res.json(resModel);
            } else {
                resModel.success = false;
                res.json(resModel);
            }
        }
    });
});


module.exports = route;