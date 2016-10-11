var util = require("util");
var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');

var service = require('../../service.js');

var quickZip = require("../util/quickZip.js");

quickZip.zip(path.join(__dirname, "test1.zip"), {
	root : path.join(__dirname, "../.."), 
	files : [
		"public/js/ixw.js",
		"public/bootstrap",
		"public/css",
		"service/util",
		"~service/util/model.js"
	]
}, function(){
	console.log("test1.zip written.");
	process.exit();
});