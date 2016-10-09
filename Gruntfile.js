require("./_tasks/_lib/ix.js");
require("./bin/_prompt/index.js");

var path =  require('path');
var gruntConfig = require("./grunt-config.js");

function chkconfig(){
	var prjCfg = null;
	try {
		prjCfg = require('./ixw-config.js');
	}catch(e){}
	if (!prjCfg){
		console.log("Missing file: ixw-config.js!");
		console.log("You can run `node config` to create it automatically.");
		console.log("Also you can create it manually with template file: config-template.js.");
		process.exit();
	}
	if (!prjCfg.name){
		console.log("Wrong in file ixw-config.js : name is undefined!");
		console.log("You can run `node config` to create it automatically.");
		console.log("Also you can create it manually with template file: config-template.js.");
		process.exit();
	}
	var prjType = $XP(prjCfg, "type");
	if (prjType!="pure" && prjType != "mixed")
		prjCfg.type = "pure";
	var prjNS = $XP(prjCfg, "ns");
	if (IX.isEmpty(prjNS))
		prjNS.ns = prjCfg.name.toUpperCase();
	var prjPath = $XP(prjCfg, "path");
	if (IX.isEmpty(prjPath))
		prjNS.path = "../" + prjCfg.name;

	prjCfg.dir = path.normalize(prjCfg.path);

	return IX.inherit(gruntConfig, {config : prjCfg});
}

module.exports = function (grunt) {
	var gruntCfg = chkconfig();

	grunt.initConfig(gruntCfg);
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.loadNpmTasks("grunt-contrib-clean");

	var taskEntry = require("./bin/project/index.js");
	// register task : "compileETS" and "cleanCompiledETS",
	//		 "prompt:pure", "prompt:mixed"
	taskEntry(grunt, prjCfg, IX.emptyFn); 
	
	["pure", "mixed"].forEach(function(taskName){
		var subname = ":" + taskName;
		grunt.registerTask(taskName, [
			"clean" + subname, "copy"+ subname, "string-replace"+ subname, 
			"compileETS", "concat", "jshint:files", "cleanCompiledETS", 
			"post-" + taskName, "clean" + subname, "prompt" + subname
		]);
	});
	grunt.registerTask('default', ["chkconfig", prjCfg.type]);
};