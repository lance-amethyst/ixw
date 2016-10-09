require("./_tasks/_lib/ix.js");
require("./bin/_prompt/index.js");

var path =  require('path');
var gruntConfig = require("./grunt-config.js");

module.exports = function (grunt) {
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

	grunt.initConfig(IX.inherit(gruntConfig, {config : prjCfg}));
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.loadNpmTasks("grunt-contrib-clean");

	prjCfg.dir = path.normalize(prjCfg.path);

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