var express = require('express');
var router = express.Router();

const index = require('../controllers/index')

router.get('/', index.getUsers)

// login / signup
router.post('/login', index.login);
router.post('/signup', index.signup);
router.get('/logout', index.logout);

module.exports = router;
