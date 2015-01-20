
module.exports = function(grunt, prjCfg){
	var prjNS = prjCfg.rootNS || "IXW";
	jshintOptions.globals[prjNS] = true;
	console.log("run deploy");
};