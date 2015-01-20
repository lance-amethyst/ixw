var util = require('util');

var etsc = require('./_lib/etsc.js');
var srcRoot = process.cwd() + "/src/";

module.exports = function(grunt, prjCfg, done){
	grunt.registerTask("compileETS", "compile all ets files(*.js.html)", function(){
		if (!etsc(srcRoot + "ixw", {nsName : prjCfg.namespace + ".Tpl"}))
			console.err("Compile ETS failed");
	});
	grunt.registerTask("cleanCompiledETS", "clean genereated files in compiling", function(){
		if (!etsc(srcRoot + "ixw", {
			nsName : prjCfg.namespace + ".Tpl",
			clean :true
		}))
			console.error("clean compile ETS failed");
	});
	grunt.task.run(["less:files", "compileETS", "jshint:files", 
		"concat", "jshint:afterconcat", "copy:deploy", 
		"cleanCompiledETS"]);
	done();
};