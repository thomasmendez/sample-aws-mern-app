const mongodb = require('../db/mongodb')
const passport = require('passport')
let myBycrypt = require('../config/bycrypt')
const User = require('../db/models/user')

exports.getUsers = function(req, res, next) {

    mongodb.getAllUsers().then(function(users) {
        res.status(200).send({
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


exports.signup = function(req, res, next) {

	// validate incomming form data

	let username = req.body.username.trim();

	let password = req.body.password;

	let confirmedPassword = req.body.confirmedPassword;
	
	let firstName = req.body.firstName.trim();

    let lastName = req.body.lastName.trim();

	validateSignup(username, password, confirmedPassword, 
		firstName, lastName).then((validUser) => {

		// validation successfull 
        // check for username in database
        
		// check against the database to see if it exist already 
		mongodb.findUserByUsername(username).then(function (user) {

            // returns null if User does not exist

			if (user === null) {

				// create email token before saving
				let newUser = new User.model({
					username: validUser.username,
					password: validUser.password,
					firstName: validUser.firstName,
					lastName: validUser.lastName
				});
								
				newUser.save().then(function (user) {

					let message = "Sign up success"

					req.logIn(user, function(err) {
						res.status(200).send({
							username: user.username,
							message: message
						})
					})

				}).catch(function (err) {

					// there is a error with database
					console.log("database saving error: " + err)

					errorMessage = "Internal Server Error";

					let errors = {
						errorMessage: errorMessage
					}
				
					let formData = {
						username: username,
						password: password,
						confirmedPassword: confirmedPassword,
						firstName: firstName,
						lastName: lastName
					}
				
					res.status(500).send({
						formData: formData,
						errors: errors
					})
				});

			} else {

				// username exist already 
				// send username taken error
				// and form data back

				errorMessage = "Username is already taken. Please use a different username";

				let errors = {
					errorMessage: errorMessage
				}

				let formData = {
					username: username,
					password: password,
					confirmedPassword: confirmedPassword,
					firstName: firstName,
					lastName: lastName
				}

				// can't create new user
				res.status(409).send({
					formData: formData,
					errors: errors
				})
				
			}

		}).catch(function (err) {
			// there is a error with database
			console.log("database error: " + err)

			errorMessage = "Internal server error";

			let errors = {
				errorMessage: errorMessage
			}

			let formData = {
				username: username,
				password: password,
				confirmedPassword: confirmedPassword,
				firstName: firstName,
				lastName: lastName
			}

			res.status(500).send({
				formData: formData,
				errors: errors
			})

		});

	}).catch((formErrors) => {

		// validation falied
		// redirect back 

        // send any submited form data back
        
        console.log("form errs: " + formErrors)

		errorMessage = "Please make sure all fields are filled out properly";

		let errors = {
			errorMessage: errorMessage
		}

		let formData = {
			username: username,
			password: password,
			confirmedPassword: confirmedPassword,
			firstName: firstName,
			lastName: lastName
		}

		res.status(422).send({
			formData: formData,
			formErrors: formErrors,
			errors: errors 
		})

	});
}

function validateSignup(username, password, confirmedPassword, firstName, lastName) {

	return new Promise((resolve, reject) => {

		let usernameStartWith = /[a-zA-Z\d]/;
		let usernameRegex = /[a-zA-Z\d][a-zA-Z0-9_]{3,10}$/;
		let passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,50})/;

		let firstNameRegex = /^[a-z | A-Z | \. | -]+$/;
    	let last_regex = /^[a-z | A-Z | \. | -]+$/;

		var errorUsername = "";
		var errorPassword = "";
		var errorConfirmedPassword = "";
		var errorFirstName = "";
		var errorLastName = "";

		if (!(usernameStartWith.test(username))) {
    	    errorUsername = "Username does not start with letter or digit";
    	} else if (!(usernameRegex.test(username))) {
    	    errorUsername = "Username needs to only include letters, digit, or underscore";
		}

    	if (!(passwordRegex.test(password))) {
    	    errorPassword = "Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long";
        }

    	if (password !== confirmedPassword) {
    	    errorConfirmedPassword = "Password and confirmed password does not match";
		} else if (confirmedPassword === "") {
			errorConfirmedPassword = "Please confirm a valid password"
		}

    	if (!(firstNameRegex.test(firstName))) {
			errorFirstName = "Please only use letters and dashes for first name";
		}

    	if (!(last_regex.test(lastName))) {
			errorLastName = "Please only use letters and dashes for last name";
        }

		if (errorUsername === "" && 
			errorPassword === "" &&
			errorConfirmedPassword === "" &&
			errorFirstName === "" &&
			errorLastName === "") {

			// no errors
			// create a hashed password
			// create a User object
			// to add to the database
			let hashedPassword = myBycrypt.generateHash(password);

			let user = new User.model({
				username: username,
				password: hashedPassword,
				firstName: firstName,
				lastName: lastName
			});

			// if form is okay
			resolve(user);

		} else {

			// we have an error 
			// redirect back to submit form

			let err = {
				username: errorUsername,
				password: errorPassword,
				confirmedPassword: errorConfirmedPassword,
				firstName: errorFirstName,
				lastName: errorLastName,
			};

			// if form not okay
			reject(err);

		}

	});
}

exports.login = function(req, res, next) {

	// custom callback
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err); 
		} else {
            // user not authenticated 
			if (!user) {
				// return form 
                // data used 
				if (info != null) {
                    let formData = info.formData;
                    let errors = info.errors;

                    // send back the form data with the errors

                   res.status(401).send({
                       formData: formData,
                       errors: errors
                   });

				} else {
                    console.log("We don't have data to return")
                    // there is an error on our end
                    // we don't have info to return 
                    // from passport_setup.js
                    // send this just in case 
                    res.status(401).send({
                        formData: {
                            username: "",
                            password: ""
                        },
                        errors: {
                            message: "Internal server error"
                        }
                    })
				}
			} else {

                // we have a valid authenticated user
                
				req.logIn(user, function(err) {

                    console.log("login success")
					
					res.status(200).send({
						validUsername: user.username,
						message: "Login success"
					});
				});
			}
		}
	})(req, res, next);

}

exports.logout = function(req, res, next) {
	req.logout();
    req.session.destroy();
    // google chrome does not like status code 205
	res.status(200).send({
		message: "Logout successful"
	});
}