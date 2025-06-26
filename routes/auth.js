var express = require('express');
var router = express.Router();

//contains register, login & logout

router.get('/register', function(req, res, next) {
    res.render('register');
});
router.get('/login', function(req, res) {
    res.render('login');
});

module.exports = router;