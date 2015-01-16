#! /usr/bin/env node

var fs = require("fs");
var path = require("path");

console.log("Usage : node deploy [--NS=IX.Tpl] [-f] [--line-delimiter=window|unix] [destFile]");

var destFile = process.cwd() + "/dist/etscompiler.js";
var newline = "\n", nsName = "IX.Tpl";
var forceRecover = false;

function parseArg(arg){
	var ci = arg.toLowerCase();
    if(ci[0] != "-"){
    	destFile = arg;
        return;
    }
    if (ci == "-f") forceRecover = true;
    else if (ci.substring(0,5) == "--ns=") nsName = arg.substring(5);
    else if (ci == "--line-delimiter=window") newline = "\r\n";
}
var args = process.argv;
for(var i = 2, ci, j = args.length; i < j; i ++)
	parseArg(args[i]);

var destPath = path.dirname(destFile);
if(!fs.existsSync(destPath)){
	console.error("deploy failed! no such directory:" + destPath);
	process.exit();
}
console.log("deploy ets compiler for browser to: " + destFile);
if(fs.existsSync(destFile)){
	if (!forceRecover){
		console.error("File existed, will not recover it:" + destFile);
		console.log("If you insist to recover it, please delete such file or use -f option!");
		process.exit();
	}
	console.log("Warning: file will be recover immediately:" + destFile);
	fs.unlinkSync(destFile);
}

fs.appendFileSync(destFile, "(function () {\n");
fs.appendFileSync(destFile, fs.readFileSync("./lib/parser.js"));
fs.appendFileSync(destFile, "\n");
fs.appendFileSync(destFile, fs.readFileSync("./lib/translator.js"));
fs.appendFileSync(destFile, '\nvar ETS_NS = "' + nsName + '";\n');
fs.appendFileSync(destFile, fs.readFileSync("./browser/ets.js"));
fs.appendFileSync(destFile, "\n})();");

console.log("----------------deploy ets.js compile -----------------");
