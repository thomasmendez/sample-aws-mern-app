var express = require('express');
var router = express.Router();

let user = require('../controllers/users');

router.get('/', user.getUsers)
router.post('/deleteUser', user.deleteUser)

module.exports = router;