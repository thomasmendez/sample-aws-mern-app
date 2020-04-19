var mongoose = require('mongoose');
// let config = require('../../config/config');
// mongoose.connect(config.development.url + config.development.database, {useNewUrlParser: true});

let Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

exports.model = mongoose.model('user', userSchema);

exports.schema = userSchema;