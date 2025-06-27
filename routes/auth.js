var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db');

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.query('SELECT * FROM user WHERE username = ?', [ username ], function(err, results) {
        if (err) return cb(err);
        if (!results) return cb(null, false, { message: 'User does not exist.' });

        const row = results[0]; // This query returns an array

        console.log(row, row.password_hash, row.password_salt);
        
        crypto.pbkdf2(password, row.password_salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) return cb(err);
            if (!crypto.timingSafeEqual(row.password_hash, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}));

//register
router.get('/register', function(req, res, next) {
    res.render('register');
});

//login
router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage: true
    }, (err, user, info) => {

        // handle succes or failure

    })(req, res, next); 
});

module.exports = router;