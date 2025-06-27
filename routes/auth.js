const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const zlib = require('node:zlib');
const db = require('../db');

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.query('SELECT * FROM user WHERE username = ?', [ username ], function(err, results) {
        if (err) return cb(err);
        if (!results) return cb(null, false, { message: 'User does not exist.' });

        const row = results[0]; // This query returns an array

        console.log(row, row.password_hash, row.password_salt);
        const unpacked_hash = JSON.parse(zlib.unzipSync(Buffer.from(row.password_hash, 'base64')));
        const unpacked_salt = JSON.parse(zlib.unzipSync(Buffer.from(row.password_salt, 'base64')));
        console.log(unpacked_hash, unpacked_salt);
        
        crypto.pbkdf2(password, unpacked_salt, 310000, 32, 'sha256', function(err, password_hash) {
            if (err) return cb(err);
            if (!crypto.timingSafeEqual(unpacked_hash, password_hash)) {
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