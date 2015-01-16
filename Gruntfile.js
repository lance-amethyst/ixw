module.exports = function (grunt) {
	var prjCfg = require('./ixw.json');
	
	var gruntCfg = {
		pkg : grunt.file.readJSON("package.json")
	};
	grunt.initConfig(gruntCfg);
	
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	
	grunt.task.registerTask("initial", function(){
		
		
		
		
	});


	grunt.registerTask('default', prjCfg.defaultTasks || ["deploy"]);
};