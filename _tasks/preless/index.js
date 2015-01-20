var util = require('util');
var fs = require('fs');
var path = require('path');

var tplDir = process.cwd() + "/_tasks/preless/tpl/";
function loadTplFromFile(filename){
	var tpl = fs.readFileSync(tplDir + filename);
	//console.log("TPL: \n" + tpl);
	return new IX.ITemplate({tpl :tpl});
}
IX.ns("Preless");
Preless.loadTplFromFile = loadTplFromFile;
Preless.lessTpl = loadTplFromFile("tpl.less");

var demo = require("./demo.js");
var bgConvertor = require("./bgConvertor.js");
var picConvertor = require("./picConvertor.js");

var allTasks = [];
var taskStatus = {};

module.exports = function(grunt, gruntCfg, prjCfg, done){
	var taskCfg = prjCfg.preless || {};
	var srcPath = process.cwd() + "/" + taskCfg.src;
	var destPath = process.cwd() + "/" + taskCfg.dest;
	var demoDest = !taskCfg.demoDest ? null : (process.cwd() + "/" + taskCfg.demoDest);
	
	function checkReady(){
		console.log("preless check ready?!");
		for (var i=0; i<allTasks.length; i++ ){
			if (!(allTasks[i] in taskStatus))
				return setTimeout(checkReady, 500);
		}
		if (demoDest)
			demo.check(demoDest);
		console.log("preless convert all done!");
		done();
	}
	function _convert(task, convertor) {
		var taskName = "cvt-" + task.path;
		var taskPrefix = $XP(task, "classPrefix", "");
		if (demoDest)
			demo.register(taskName);
		allTasks.push(taskName);
		convertor.merge(task, function(previewInfo){
			console.log("after merge!" + taskName);
			taskStatus[taskName] = true;
			demo.set(taskName, previewInfo);
		});
	}
	//console.log("start preless convert all!");
	$XP(taskCfg, "background", []).forEach(function(task){
		var taskPath = $XP(task, "path", "background");
		_convert(IX.inherit({
			path : taskPath,
			classPrefix : "bg",

			src : srcPath + "/" + taskPath,
			dest : destPath,
			demoDest : demoDest
		}, task),  bgConvertor);
	});

	$XP(taskCfg, "picmap", []).forEach(function(task){
		var taskPath = $XP(task, "path", "pic");
		console.log("start convert picmap : " + taskPath);
	 	_convert(IX.inherit({
	 		margin : 8,
	 		path : taskPath,
	 		classPrefix : "pic",
	 		src : srcPath + "/" + taskPath,
	 		dest : destPath,
	 		demoDest : demoDest
	 	}, task),  picConvertor);
	});

	checkReady();
};