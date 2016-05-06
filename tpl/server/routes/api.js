var express = require('express');
var router = express.Router();

var fs = require("fs");
var path = require('path');

var moduleModel = require("../service/models/module.js");

router.get('/module/:module', function(req, res, next) {
	var moduleName = req.params.module;
	//console.log("list:", comCode);
	moduleModel.getByName(moduleName, function(moduleItem){
		IXS.sendResult(res, moduleItem);
	});
});

router.get('/download/:filename', function(req, res, next) {
	var filename = req.params.filename;

	res.sendFile(filename, {
		'root' : path.join(__dirname, "../files/tmp")
	});
});

module.exports = router;
