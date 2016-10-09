var path = require('path');

require("./_tasks/_lib/ix.js");
require("./bin/_prompt/index.js");

module.exports = function (grunt) {
	var gruntCfg = null;
	
	try {
		gruntCfg = require('./ixw-config.js');
	}catch(){}
	if (!gruntCfg){
		console.log("Missing file: ixw-config.js!");
		console.log("You can run node config to create it automatically.");
		console.log("Also you can create it manually with template file: config.js.");
		return;
	}

	grunt.initConfig(gruntCfg);
	
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.loadNpmTasks("grunt-contrib-clean");


	var prjCfg = gruntCfg.config;
	prjCfg.dir = path.normalize(prjCfg.path);

	var taskEntry = require("./bin/project/index.js");
	// register task : "compileETS" and "cleanCompiledETS",
	//		 "prompt:pure", "prompt:mixed"
	taskEntry(grunt, prjCfg, this.async()); 
	
	["pure", "mixed"].forEach(function(taskName){
		var subname = ":" + taskName;
		grunt.registerTask(taskName, [
			"clean" + subname, "copy"+ subname, "string-replace"+ subname, 
			"compileETS", "concat", "jshint:files", "cleanCompiledETS", 
			"post-" + taskName, "clean" + subname, "prompt" + subname
		]);
	});
	grunt.registerTask('default', ["chkconfig", prgCfg.type]);
};