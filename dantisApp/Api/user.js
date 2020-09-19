var express = require('express');
var User = require('../DB/user');


const route = express.Router();

//add contact
route.post('/', async (req, res) => {
    const { userName, password, phoneNumber, superAdmin } = req.body;

    let user = {};
    user.userName = userName;
    user.password = password;
    user.phoneNumber = phoneNumber;
    user.superAdmin = superAdmin;

    let userModel = new User(user);
    await userModel.save();
    let resModel = {
        id: userModel._id,
        success: true
    }
    res.json(resModel);
});


//Update contact
route.post('/updateUser', async (req, res) => {
    const { id, userName, password, phoneNumber, superAdmin } = req.body;

    let user = {};
    user._id = id;
    user.userName = userName;
    user.password = password;
    user.phoneNumber = phoneNumber;
    user.superAdmin = superAdmin;

    let resModel = {
        id: 0,
        success: false
    }

    let userModel = new User(user);
    User.findOneAndUpdate({ _id: user._id }, userModel, (err, user) => {
        if (err) {
            resModel.success = false;
        } else {
            resModel.success = true;
            resModel.id = userModel._id
        }
        res.json(resModel);
    });
});

//delete contacts
route.delete('/deleteUser', (req, res) => {
    let id = req.query.userId;
    let resModel = {
        success: true
    };
    var query = User.where({ _id: id });
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

route.get('/getUserDetails', (req, res) => {
    let id = req.query.userId;
    var query = User.where({ _id: id });
    query.findOne((err, details) => {
        if (err) {
            res.json(null);
        } else {
            res.json(details);
        }
    })
});


//retriving contacts
route.get('/getUser', (req, res) => {
    User.find((err, lists) => {
        res.json(lists);
    });
});

route.get('/auth', (req, res) => {

    let result = {
        success: true,
        message: ''
    };
    let userName = req.query.uName;
    let password = req.query.pwd;
    if (userName != null || password != null) {
        var query = User.where({ userName: userName, password: password });
        query.findOne((err, user) => {
            if (err) {
                result.success = false;
                result.message = err;
                res.json(result);
            }
            if (user) {
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

route.get('/exists', (req, res) => {
    let result = {
        success: true,
        message: ''
    };
    let userName = req.query.uName;
    var query = User.where({ userName: userName });
    query.findOne((err, user) => {
        if (err) {
            result.success = false;
            result.message = err;
            res.json(result);
        }
        if (user) {
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