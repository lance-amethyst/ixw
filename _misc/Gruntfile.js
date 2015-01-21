require("./_tasks/_lib/ix.js");

module.exports = function (grunt) {
	var prjCfg = require('./ixw_config.js');
	prjCfg.relNo =  IX.getTimeStrInMS().substring(2, 13).replace("T", "");
	
	grunt.initConfig(IX.inherit({
		pkg : grunt.file.readJSON("./package.json"),
	}, prjCfg.grunt));
	
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	
	["preless", "deploy", "release"].forEach(function(taskName){
		grunt.registerTask(taskName, 'Initialize project base on ixw_config.json.', function() {
			var taskEntry = require("./_tasks/" + taskName + "/index.js");
			taskEntry(grunt, prjCfg, this.async());
		});
	});
	grunt.registerTask("publish", ["deploy", "release"]);

	grunt.registerTask('default', prjCfg.defaultTasks || ["deploy"]);
};