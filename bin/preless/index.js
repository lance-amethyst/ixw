var util = require('util');
var fs = require('fs');
var path = require('path');

var nf = require('./lib/node-file.js');
var demo = require("./demo.js");

global.appCfg = require('./config.js');
global._writeFile = function(filename, data){
	nf.mkdirsSync(path.dirname(filename));
	nf.writeFileSync(filename, data, true);
};

console.log("Usage : node index [--preview/--disable-preview] [source-path [output-path]]");

var ifPreview = appCfg.ifPreview;
var _args = [];
process.argv.forEach(function(arg){
	if (arg.charAt(0) == '-'){
		if (arg == "--preview")
			ifPreview = true;
		else if (arg == "--disable-preview")
			ifPreview = false;
	} else
		_args.push(arg);
});

var srcPath = _args.length>2?_args[2]: appCfg.srcRoot;
var destPath = _args.length>3?_args[3]: appCfg.deployTo;

var allTasks = appCfg.allTasks || [];
var taskStatus = {};

function checkReady(){
	for (var i=0;i<allTasks.length; i++ ){
		if (!(allTasks[i] in taskStatus))
			return setTimeout(checkReady, 500);
	}
	demo.check(destPath);
	console.log("convert all done!");
	process.exit();
}
var configs = appCfg.taskDefs;

allTasks.forEach(function(task){
	if (ifPreview)
		demo.register(task);
	var _cfg = configs[task];
	var convertor = require('./' + (_cfg.classPath || task) + '/convertor.js');
	_cfg.src = srcPath + "/" +  (_cfg.path || task);
	_cfg.dest = destPath;
	_cfg.ifPreview = ifPreview;
	_cfg.filename =  _cfg.name || task;
 	convertor.merge(_cfg, function(previewInfo){
 		taskStatus[task] = true;
 		demo.set(task,  previewInfo);
 	});
 });

checkReady();