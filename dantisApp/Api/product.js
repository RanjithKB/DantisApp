var express = require('express');
var Product = require('../DB/product');
var Tax = require('../DB/tax');
var PayModes = require('../DB/paymode');
var Invoice = require('../DB/invoice');

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

route.get('/getPaymentModes', (req, res) => {
    PayModes.find((err, lists) => {
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


//generate Invoice
route.post('/generateInvoice', async (req, res) => {

    let invoiceInput = req.body;
    let invoiceInfo;
    let invoiceInfoList = [];
    invoiceInput.forEach(element => {
        invoiceInfo = {};
        invoiceInfo.productName = element.productName;
        invoiceInfo.quantity = element.quantity;
        invoiceInfo.price = element.price;
        invoiceInfo.taxId = element.taxId;
        invoiceInfo.billingNumber = element.billingNumber;
        invoiceInfo.datetime = new Date();
        invoiceInfo.firstname = element.firstname;
        invoiceInfo.lastname = element.lastname;
        invoiceInfo.address = element.address;
        invoiceInfo.email = element.email;
        invoiceInfo.phonenumber = element.phonenumber;
        invoiceInfo.payModeId = element.payModeId;
        invoiceInfo.paidamount = element.paidamount;

        invoiceInfoList.push(invoiceInfo);

    });

    let resModel = {
        id: 0,
        success: false
    }

    Invoice.collection.insertMany(invoiceInfoList, (err, doc) => {
        if (err) {
            resModel.success = false;
        }
        else {
            resModel.success = true;
            //resModel.id = invoiceModel._id
            invoiceInput.forEach(element => {
                // let product = {};
                // product.quantity = element.quantity;
                // let productModel = new Product(product);
                Product.findOneAndUpdate({ _id: element.productId }, { $inc: { quantity: -element.quantity } }, (err, product) => {
                    if (err) {
                        resModel.success = false;
                    } else {
                        resModel.success = true;
                        //resModel.id = productModel._id
                    }
                    //res.json(resModel);
                });
            });
        }
        res.json(resModel);
    });


});

module.exports = route;