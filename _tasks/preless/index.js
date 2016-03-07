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
	var _tpl = fs.readFileSync(tplDir + tplfile, {encoding : "utf8"}).toString();
	var tpl = new IX.ITemplate({tpl : _tpl});
	var renderStr = tpl.renderData("", lessData);
	IX.safeWriteFileSync(destPath, renderStr);
	return renderStr;
}

function writeLessFile(lessData, destPath, demoDest){
	var suffix = lessData.suffix;
	console.log("write less file to : ixwpre"+suffix+".less");
	var lessStr = renderTplToFile("tpl.less", lessData, destPath + "/less/ixwpre"+suffix+".less");
	if (!demoDest) 
		return;
	IX.safeWriteFileSync(demoDest + "/less/ixwpre"+suffix+".less", lessStr);
	renderTplToFile("preview.htm", lessData, demoDest + "/preview"+suffix+".htm");
	renderTplToFile("demo.less", lessData, demoDest + "/less/demo"+suffix+".less");
}

var allLessData = {};
function processFn(prjCfg, finishFn, suffix){
	var taskCfg = prjCfg.preless || {};
	var srcPath = _cwd + taskCfg.src;
	var destPath = _cwd + taskCfg.dest;
	var demoDest = !taskCfg.demoDest ? null : (_cwd + taskCfg.demoDest);

	var lessData ={
		bg :[],
		pic :[],
		suffix : suffix
	};

	function execTask(name, taskType, taskDef, fn){
		var settings = DefSetttings[taskType];
		var defClz = settings.clz;
		if (name in allLessData){
			console.log("reuse: "+ name + " for " + suffix);
			lessData[defClz].push(allLessData[name]);
			return fn();
		}

		console.log("exec: "+ name + " for " + suffix);
		settings.merge(IX.inherit({
			classPrefix : defClz,
		}, taskDef), function(lessInfo){
			console.log("after exec! " + name);
			allLessData[name] = lessInfo;
			lessData[defClz].push(lessInfo);
			fn();
		});
	}
	function createTask(taskType, defCfg, task){
		var taskPath = $XP(task, "path", taskType);
		if (fs.existsSync(srcPath + "/" + taskPath + suffix))
			taskPath = taskPath + suffix;
		return [taskType+ ":" + taskPath, function(name, fn){
			execTask(name, taskType, IX.inherit({
				src : srcPath + "/" + taskPath,
				dest : destPath
			}, defCfg, task, {path : taskPath}), fn);
		}];
	}
	function createTasks(taskType, defCfg){
		return IX.map($XP(taskCfg, taskType, []), function(task){
			return createTask(taskType, defCfg, task);
		});
	}

	var steps = [].concat(createTasks("background", {
	}), createTasks("picmap",{
		margin : 8,
		demoDest : demoDest
	}));

	IX.sequentialSteps(steps).exec(function(){
		writeLessFile(lessData, destPath, demoDest);
		finishFn();
	});
}

module.exports = function(grunt, prjCfg, done){
	var oemList = prjCfg.oem;
	oemList.unshift("");

	function oemHandler(oemName, fn){
		console.log("process " + oemName);
		processFn(prjCfg, fn, oemName ? ("-"+oemName) : "");
	}

	IX.sequentialSteps(IX.map(oemList, function(oemName){
		return [oemName, oemHandler];
	})).exec(done);
};