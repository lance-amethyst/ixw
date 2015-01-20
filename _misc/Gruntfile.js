require("./_tasks/_lib/ix.js");

module.exports = function (grunt) {
	var prjCfg = require('./ixw_config.js');
	
	var gruntCfg = {
		pkg : IX.inherit(grunt.file.readJSON("./package.json"), {
			distribNo :  IX.getTimeStrInMS().substring(2, 13)
		})
	};
	
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-compress");
	
	["preless", "deploy", "release"].forEach(function(taskName){
		grunt.task.registerTask(taskName, 'Initialize project base on ixw_config.json.', function() {
			var taskEntry = require("./_tasks/" + taskName + "/index.js");
			taskEntry(grunt, gruntCfg, prjCfg, this.async());
		});
	});
	grunt.task.registerTask("publish", ["deploy", "release"]);
	grunt.initConfig(gruntCfg);

	grunt.registerTask('default', prjCfg.defaultTasks || ["deploy"]);
};