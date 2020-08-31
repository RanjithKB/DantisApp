var express = require('express');
var User = require('../DB/user');


const route = express.Router();

//add contact
route.post('/',async(req,res) => {
    const{userName,password,phoneNumber,superAdmin} = req.body;

    let user = {};
    user.userName = userName;
    user.password = password;
    user.phoneNumber = phoneNumber;
    user.superAdmin = superAdmin;
    
    let userModel = new User(user);
    await userModel.save();
    let resModel ={
        id: userModel._id,
        success: true
    }
    res.json(resModel);
});


//add admin Product
// route.post('/addProduct',async(req,res) => {
//     const{productName,quantity,reorderQuantity,price} = req.body;

//     let product = {};
//     product.productName = productName;
//     product.quantity = quantity;
//     product.reorderQuantity = reorderQuantity;
//     product.price = price;
    
//     let productModel = new User(product);
//     await productModel.save();
//     let resModel ={
//         id: productModel._id,
//         success: true
//     }
//     res.json(resModel);
// });

//delete contacts
route.delete('/:id',(req, res) =>{
    User.deleteOne({_id : req.params.id}, (err,result) => {
        if(err){
            res.json(err);
        } else {
            res.json(result);
        }
    });
 });

 //retriving contacts
route.get('/getUser',(req, res) =>{
    User.find((err,lists) => {
        res.json(lists);
    });
});

route.get('/auth',(req, res) =>{
   
   let result = {
        success: true,
        message: ''
   };
   let userName = req.query.uName;
   let password = req.query.pwd;
   if( userName != null || password != null){
   var query = User.where({userName: userName , password: password});
   query.findOne((err, user) => {
       if (err) {
           result.success = false;
           result.message = err;
           res.json(result);
       }
       if(user) {
           result.success = true;
           result.message = user.userName;
           res.json(result);
       } else {
            result.success = false;
            result.message = 'User not Registered';
            res.json(result);
       }
   });
}
else {
    result.success = false;
    result.message = 'Cannot be Null';
    res.json(result);
}
});

route.get('/exists',(req,res) =>{
    let result = {
        success: true,
        message: ''
   };
   let userName = req.query.uName;
   var query = User.where({userName: userName });
   query.findOne((err, user) => {
    if (err) {
        result.success = false;
        result.message = err;
        res.json(result);
    }
    if(user) {
        result.success = false;
        result.message = user.userName;
        res.json(result);
    } else {
        result.success = true;
        result.message = '';
        res.json(result);
    }
   })
});

module.exports = route;