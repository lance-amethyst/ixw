var fs = require('fs');
var util = require('util');

module.exports = function(grunt, prjCfg, done){
	grunt.registerTask("mark_relno", "mark  release no.", function(){
		require('./maps.js').mark(prjCfg, prjCfg.release, prjCfg.relNo);
	});
	grunt.task.run(["clean:release", "copy:beforeRel", "mark_relno",
			"copy:release", "uglify:release", "cssmin:release",
			"clean:afterRel"]);
	done();
};