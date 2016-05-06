var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.sendFile("index.htm", {'root': __dirname + '/../public'});
});

module.exports = router;