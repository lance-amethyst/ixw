module.exports = function (grunt) {
	var prjCfg = require('./ixw.json');
	
	var gruntCfg = {
		pkg : grunt.file.readJSON("package.json")
	};
	
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-compress");
	
	["initial", "preless", "deploy"].forEach(function(taskName){
		grunt.task.registerTask(taskName, 'Initialize project base on ixw.json.', function() {
			 var taskEntry = require("./gruntTasks/" + taskName + "/index.js");
			 taskEntry(grunt, gruntCfg, prjCfg);
		});
	});
	
	grunt.initConfig(gruntCfg);

	grunt.registerTask('default', ["deploy"]);
};