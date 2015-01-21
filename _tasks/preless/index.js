var util = require('util');
var fs = require('fs');
var path = require('path');

var DefSetttings = {
	"background" : {clz :"bg", merge : require("./bgConvertor.js")},
	"picmap" : {clz :"pic", merge : require("./picConvertor.js")}	
};

var _cwd = process.cwd() + "/" ;
var tplDir = _cwd + "_tasks/preless/tpl/";
function renderTplToFile(tplfile, lessData, destPath){
	var tpl = fs.readFileSync(tplDir + tplfile);
	//console.log("TPL: \n" + tpl);
	var tpl = new IX.ITemplate({tpl :tpl});
	var renderStr = tpl.renderData("", lessData);
	IX.safeWriteFileSync(destPath, renderStr);	
	return renderStr;
}

function writeLessFile(lessData, destPath, demoDest){
	var lessStr = renderTplToFile("tpl.less", lessData, destPath + "/less/ixwpre.less");
	if (!demoDest) 
		return;
	IX.safeWriteFileSync(demoDest + "/less/ixwpre.less", lessStr);
	renderTplToFile("preview.htm", lessData, demoDest + "/preview.htm");
	renderTplToFile("demo.less", lessData, demoDest + "/less/demo.less");
}

module.exports = function(grunt, prjCfg, done){
	var taskCfg = prjCfg.preless || {};
	var srcPath = _cwd + taskCfg.src;
	var destPath = _cwd + taskCfg.dest;
	var demoDest = !taskCfg.demoDest ? null : (_cwd + taskCfg.demoDest);
	
	var allTasks = [], taskStatus = {};
	var lessData ={
		bg :[],
		pic :[]
	};
	
	function convertTask(task, taskType, defCfg){
		var settings = DefSetttings[taskType];
		var defClz = settings.clz;
		var taskPath = $XP(task, "path", taskType);
		console.log("start convert : " + taskPath);
		allTasks.push(taskPath);
		settings.merge(IX.inherit({
			path : taskPath,
			classPrefix : defClz,
			src : srcPath + "/" + taskPath,
			dest : destPath
		}, defCfg, task), function(lessInfo){
			console.log("after convert!" + taskPath);
			taskStatus[taskPath] = true;
			if (lessInfo)
				lessData[defClz].push(lessInfo);
		});
	}
	
	function checkReady(){
		console.log("preless check ready?!");
		for (var i=0; i<allTasks.length; i++ ){
			if (!(allTasks[i] in taskStatus))
				return setTimeout(checkReady, 500);
		}
		writeLessFile(lessData, destPath, demoDest);
		console.log("preless convert all done!");
		done();
	}
	
	function convert(taskType, defCfg){
		$XP(taskCfg, taskType, []).forEach(function(task){
			convertTask(task, taskType, defCfg);
		});
	}
	//console.log("start preless convert all!");
	convert("background", {});
	convert("picmap",{
		margin : 8,
		demoDest : demoDest
	});

	checkReady();
};