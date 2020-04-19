var mongoose = require('mongoose');
mongoose.connect(process.env.NODE_MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// import models that will be used
// all models will need their schema to make a query search
const User = require('./models/user');

exports.getAllUsers = function() {

    return mongoose.model('user', User.schema).find().then(function(users) {

        var usersInfo = [];
    
        // users is a javascript Object
        Object.entries(users).forEach(entry => {
          //let key = entry[0];
          let value = entry[1];
          //use key and value here
          //console.log("key: " + key);
          //console.log("value: " + value);
    
          userInfo = {
            _id: value._id,
            username: value.username,
            firstName: value.firstName,
            lastName: value.lastName
          };
    
          usersInfo.push(userInfo);

        });
        return usersInfo
    }).catch(function(error) {
        console.log("error: " + error)
        return error
    })
}

// returns all user info
exports.findUserById = function(_id) {
    return mongoose.model('user', User.schema).findById(_id).then(function(items) {
        return items;
    }).catch(function (error) {
        return error
    });
}

exports.findUserByUsername = function(username) {
    return mongoose.model('user', User.schema).findOne({username: username}).then(function(items) {
        return items;
    }).catch(function (error) {
        console.log("error: " + error)
        return error;
    });
}

exports.deleteUser = function(_id) {
    let query = {_id: _id};
    return mongoose.model('user', User.schema).findOneAndDelete(
        query
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}