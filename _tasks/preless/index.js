var util = require('util');
var fs = require('fs');
var path = require('path');

var bgConvertor = require("./bgConvertor.js");
var picConvertor = require("./picConvertor.js");

var allTasks = [];
var taskStatus = {};
var lessData ={
	bg :[],
	pic :[]
};

var tplDir = process.cwd() + "/_tasks/preless/tpl/";
function renderTplToFile(tplfile, destPath){
	var tpl = fs.readFileSync(tplDir + tplfile);
	//console.log("TPL: \n" + tpl);
	var tpl = new IX.ITemplate({tpl :tpl});
	var renderStr = tpl.renderData("", lessData);
	IX.safeWriteFileSync(destPath, renderStr);	
	return renderStr;
}

function writeLessFile(destPath, demoDest){
	var lessStr = renderTplToFile("tpl.less", destPath + "/less/ixwpre.less");
	if (demoDest) {
		IX.safeWriteFileSync(demoDest + "/less/ixwpre.less", lessStr);
		renderTplToFile("preview.htm",  demoDest + "/preview.htm");
		renderTplToFile("demo.less", demoDest + "/less/demo.less");
	}
}

module.exports = function(grunt, prjCfg, done){
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
		writeLessFile(destPath, demoDest);
		console.log("preless convert all done!");
		done();
	}
	function _convert(task, convertor) {
		var taskName = "cvt-" + task.path;
		var taskPrefix = $XP(task, "classPrefix", "");
		allTasks.push(taskName);
		convertor.merge(task, function(lessInfo){
			console.log("after merge!" + taskName);
			taskStatus[taskName] = true;
			if (!lessInfo)
				return;
			lessData[lessInfo.type].push(lessInfo);
		});
	}
	//console.log("start preless convert all!");
	$XP(taskCfg, "background", []).forEach(function(task){
		var taskPath = $XP(task, "path", "background");
		_convert(IX.inherit({
			path : taskPath,
			classPrefix : "bg",

			src : srcPath + "/" + taskPath,
			dest : destPath
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