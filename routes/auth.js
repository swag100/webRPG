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

        const user = results[0]; // This query returns an array
        const unpacked_hash = Buffer.from(JSON.parse(zlib.unzipSync(Buffer.from(user.password_hash, 'base64'))));
        const unpacked_salt = Buffer.from(JSON.parse(zlib.unzipSync(Buffer.from(user.password_salt, 'base64'))));
        
        crypto.pbkdf2(password, unpacked_salt, 310000, 32, 'sha256', function(err, password_hash) {
            if (err) return cb(err);

            if (!crypto.timingSafeEqual(unpacked_hash, password_hash)) {
                return cb(null, false, { message: 'Incorrect Password' });
            }

            return cb(null, user);
        });
    });
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

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