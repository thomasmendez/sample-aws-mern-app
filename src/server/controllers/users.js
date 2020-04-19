const mongodb = require('../db/mongodb')
const mongoose = require('mongoose')

exports.getUsers = function(req, res, next) {

    let user = req.user
    let username = user.username
    mongodb.getAllUsers().then(function(users) {
        res.status(200).send({
            username: username,
            users: users
        })
    }).catch(function(error) {
        console.log("error: " + error)
        let message = "Internal Server Error"
        res.status(500).send({
            message: message
        })
    })

}

exports.deleteUser = function(req, res, next) {

    let deleteUser = new mongoose.Types.ObjectId(req.body.userID)

    mongodb.deleteUser(deleteUser).then(function(user) {

        mongodb.getAllUsers().then(function(users) {

            let message = "User successfully deleted"

            res.status(200).send({
                users: users,
                message: message
            })

        }).catch(function(error) {

            console.log("error: " + error)
            let message = "Internal Server Error"
            res.status(500).send({
                message: message
            })

        })
        
    }).catch(function(error){
        console.log("error: " + error)
        let message = "Internal Server Error"
        res.status(500).send({
            message: message
        })
    })

}