var util = require('util');
var fs = require('fs');

var etsc = require('../../_bin/tpl/lib/etsc.js');
var etsRoot = process.cwd() + "/_lib/ixwui";

function _etsc(tplNS, ifClean){
	return etsc(etsRoot, {
		nsName : tplNS,
		clean : !!ifClean
	});
}

function getPrompt(type, cfg){
	return IXW.Tools.getPromption("Promption-" + type).loopReplace([
		["{NAME}", cfg.name],
		["{DIR}", cfg.dir],
		["{NS}", cfg.ns]
	]);
}

module.exports = function(grunt, prjCfg, done){
	var pkgName = prjCfg.name;
	var tplNS = prjCfg.ns + ".Tpl";
	grunt.registerTask("compileETS", "compile all ets files(*.js.html)", function(){
		if (!_etsc(tplNS, false))
			console.err("Compile ETS failed");
	});
	grunt.registerTask("cleanCompiledETS", "clean genereated files in compiling", function(){
		if (!_etsc(tplNS, true))
			console.error("clean compile ETS failed");
	});

	grunt.registerTask("prompt:pure","prompt after publish project", function(){
		console.log(getPrompt("pure", prjCfg));
	});
	grunt.registerTask("prompt:mixed","prompt after publish project", function(){
		console.log(getPrompt("mixed", prjCfg));
	});	
	done();
};