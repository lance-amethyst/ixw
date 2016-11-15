var util = require('util');
var fs = require('fs');

var autoConcat = require('./files.js');
var etsc = require('./_lib/etsc.js');
var etsRoot = process.cwd() + "/src";
var lessPath = etsRoot + "/less/";

function _etsc(tplNS, ifClean){
	return etsc(etsRoot, {
		nsName : tplNS,
		clean : !!ifClean
	});
}

function getPkgLess4OEM(suffix, pkgname){
	return lessPath + pkgname + suffix +".less";
}
function applyLess4OEM(coreLessFileName, oemList, pkgname){
	var fileData = fs.readFileSync(lessPath + coreLessFileName, {encoding : "utf8"}).toString();
	var tplStr = IX.map(fileData.split("ixwpre"), function(item, idx){
		if (idx % 2 === 0) return item;
		var n = Math.min(item.indexOf("."), item.indexOf("\""));
		return item.substring(n);
	}).join("ixwpre{suffix}");


	IX.iterate(oemList, function(oemName){
		var suffix = oemName ? ("-"+oemName) : "";
		console.log("output " + oemName + " ::" + getPkgLess4OEM(suffix, pkgname));
		IX.safeWriteFileSync(getPkgLess4OEM(suffix, pkgname), tplStr.replace("{suffix}", suffix));
	});
}
function cleanLess4OEM(coreLessFileName, oemList, pkgname){
	IX.iterate(oemList, function(oemName){
		fs.unlink(getPkgLess4OEM(oemName ? ("-"+oemName) : "", pkgname));
	});
}

module.exports = function(grunt, prjCfg, done){
	var oemList = prjCfg.oem;
	var pkgName = prjCfg.name;
	oemList.unshift("");
	grunt.registerTask("compileOEMLess", "create oem core less files", function(){
		applyLess4OEM("core.less", oemList, pkgName);
	});
	grunt.registerTask("cleanOEMLess", "clean generated oem core less files", function(){
		cleanLess4OEM("core.less", oemList, pkgName);
	});

	var tplNS = prjCfg.namespace + ".Tpl";
	grunt.registerTask("compileETS", "compile all ets files(*.js.html)", function(){
		if (!_etsc(tplNS, false))
			console.err("Compile ETS failed");
	});
	grunt.registerTask("cleanCompiledETS", "clean genereated files in compiling", function(){
		if (!_etsc(tplNS, true))
			console.error("clean compile ETS failed");
	});

	grunt.registerTask("autoConcat", "auto concating", function(){
		autoConcat(prjCfg, this.async());
	});
	grunt.registerTask("deploy done", "auto done", function(){
		console.log("Deploy done");
	});

	grunt.task.run(["clean:deploy", "compileOEMLess", "less:deploy", "cleanOEMLess",
		"compileETS", "jshint:files", "cleanCompiledETS",
		"autoConcat", //"concat", 
		"jshint:afterconcat", "copy:deploy", "deploy done"]);
	done();
};