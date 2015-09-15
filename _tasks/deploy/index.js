var util = require('util');

var etsc = require('./_lib/etsc.js');
var etsRoot = process.cwd() + "/src";

function _etsc(tplNS, ifClean){
	return etsc(etsRoot, {
		nsName : tplNS,
		clean : !!ifClean
	});
}

module.exports = function(grunt, prjCfg, done){
	var tplNS = prjCfg.namespace + ".Tpl";

	grunt.registerTask("compileETS", "compile all ets files(*.js.html)", function(){
		if (!_etsc(tplNS, false))
			console.err("Compile ETS failed");
	});
	grunt.registerTask("cleanCompiledETS", "clean genereated files in compiling", function(){
		if (!_etsc(tplNS, true))
			console.error("clean compile ETS failed");
	});
	grunt.task.run(["clean:deploy", "less:deploy", "compileETS", "jshint:files",
		"concat", "jshint:afterconcat", "copy:deploy", 
		"cleanCompiledETS"]);
	done();
};