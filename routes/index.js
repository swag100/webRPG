var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { user: 'USER_ID--will probably be req.user' });
});

module.exports = router;