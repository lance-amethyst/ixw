var jshintOptions = require("./jshintOptions.js");

module.exports = function(grunt, gruntCfg, prjCfg){
	var prjNS = prjCfg.rootNS || "IXW";
	jshintOptions.globals[prjNS] = true;
	console.log("run deploy");
};