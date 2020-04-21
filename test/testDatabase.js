"use strict";
// NPM install mongoose and chai. Make sure mocha is globally
// installed
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true); 
mongoose.set('useUnifiedTopology', true);
const Schema = mongoose.Schema;
const chai = require('chai');
const expect = chai.expect;
const UsersModule = require('../src/server/db/models/user');
const mongodb = require('../src/server/db/mongodb');

// import the user module with schema
const testSchema = UsersModule.schema;

//Create a new collection called 'User'
const User = mongoose.model('user', testSchema);

describe('Database Tests', function() {

  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  before(function (done) {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      done();
    });
  });

  // Test insertion of document to database 
  describe('Test Database', function() {

    //Save user object object to database
    it('New user saved to test database', function(done) {
      var testUser = User({
        username: 'Mike',
        password: 'jfsdjfsdkfsjfs#@423fsdfjs',
        firstName: 'Mike',
        lastName: 'Rogers'
      });
      testUser.save(done);
    });

    it('Only save if it is in the correct format', function(done) {
      //Attempt to save with wrong info. An error should trigger
      var wrongSave = User({
        wrongUsername: 'Mike',
        password: 'jfsdjfsdkfsjfs#@423fsdfjs',
        firstName: 'Mike',
        lastName: 'Rogers'
      });
      wrongSave.save(err => {
        if(err) { return done(); }
        throw new Error('Document does not match user schema!');
      });
    });

    it('Should retrieve data from test database', function(done) {
      //Look up the user with username 'Mike' object previously saved.
      User.find({username: 'Mike'}, (err, user) => {
        if(err) {throw err;}
        if(user.length === 0) {throw new Error('No data!');}
        done();
      });
    });

  });

  // Test custom functions from db folder
  describe('Test Custom Mongodb.js Functions', function() {

    let username = 'Smith';
    let password = 'fjas%$#%$fjdsa#@423fsdfjs';
    let firstName = 'Smith';
    let lastName = 'Jones';
    var _id;

    it('2nd user saved to test database', function(done) {
      var testUser = User({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName
      });
      testUser.save(function(error, user) {
        if (error) {
            throw new Error("MongoDB error: " + error);
        }
        _id = user._id
        done();
      });
    });

    it('Should get user from database', function(done) {
        mongodb.findUserByUsername(username).then(function(user) {
            if(user.length === 0) {
                throw new Error('No data!');
            } else {
                done();
            }
        }).catch(function(error) {
            throw new Error("MongoDB error: " + error);
        });
    });

    it('Should get user from database by id', function(done) {
        mongodb.findUserById(_id).then(function(user) {
            if (user.length === 0) {
                throw new Error('No data!')
            } else {
                done();
            }
        })
    })

    it('Should get two users from the database', function(done) {
        mongodb.getAllUsers().then(function(users) {
            if (users.length === 2) {
                done();
            } else {
                throw new Error('Two users should be able to be retrieved')
            }
        })
    })

    it('Should delete user from database', function(done) {
        mongodb.deleteUser(_id).then(function(user) {
            done();
        }).catch(function(error) {
            throw new Error("MongoDB error: " + error)
        })
    })
    
  });

  //After all tests are finished drop database and close connection
  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });

});