require("./_tasks/_lib/ix.js");

var fs = require("fs");
var util = require("util");
var path = require("path");
var childProcess = require('child_process');

var ixwPrjName = "sample", ixwPrjNS = "", ixwPrjDir = "";

var prjRegex =new RegExp('{PRJ}', "gm");
var nsRegex =new RegExp('{NS}', "gm");

function dupFile(srcFile, destFile){
	var fileData = fs.readFileSync("_misc/"  + srcFile, {encoding : "utf8"});
	fileData = fileData.replace(prjRegex, ixwPrjName).replace(nsRegex, ixwPrjNS);
	var dstFName =ixwPrjDir + "/" + destFile;
	var dir = path.dirname(dstFName);
	IX.safeMkdirSync(dir);
	
//	IX.saveFileIfNotExist(path.dirname(dstFName), path.basename(dstFName), fileData, IX.emptyFn);
//	if (!fs.existsSync(dstFName))
		fs.writeFileSync(dstFName, fileData, {encoding : "utf8"});
//	else
//		console.log(dstFName + "existed!");
}

function dupETSFiles(){
	var destFile = ixwPrjDir + "/src/lib/ets.js";
	IX.safeMkdirSync(path.dirname(destFile));
	if(fs.existsSync(destFile))
		fs.unlinkSync(destFile);
	fs.appendFileSync(destFile, "(function () {\n");
	fs.appendFileSync(destFile, fs.readFileSync("./_bin/tpl/lib/parser.js"));
	fs.appendFileSync(destFile, "\n");
	fs.appendFileSync(destFile, fs.readFileSync("./_bin/tpl/lib/translator.js"));
	fs.appendFileSync(destFile, '\nvar ETS_NS = "' + ixwPrjNS + '.Tpl";\n');
	fs.appendFileSync(destFile, fs.readFileSync("./_bin/tpl/browser/ets.js"));
	fs.appendFileSync(destFile, "\n})();");
	
	childProcess.exec("cp -r _bin/tpl/lib " + ixwPrjDir + "/_tasks/deploy/_lib");
}
function copyFiles(){
	IX.safeMkdirSync(ixwPrjDir + "/dist");
	IX.safeMkdirSync(ixwPrjDir + "/proto/dist");
	childProcess.exec("cp -r _asserts " + ixwPrjDir);
	childProcess.exec("cp -r _tasks " + ixwPrjDir);
	childProcess.exec("cp -r src " + ixwPrjDir);
	
	dupFile("Gruntfile.js", "Gruntfile.js");
	dupFile('_ixw_config.js', "ixw_config.js");
	dupFile('_package.json', "package.json");
	dupFile('_proto.index.htm', "proto/index.htm");
	dupFile('_proto.dist.index.htm', "proto/dist/index.htm");
	dupFile('_src.ixw.index.js.html', "src/ixw/index.js.html");
	
	dupETSFiles();
}

function print(s){
	process.stdout.write(s);
}
var currentStep = "initial";
function inputHandler(cmdData){
	switch(currentStep){
	case "initial" :
		print("Please input project name(default is sample):");
		currentStep = "PRJ_NAME";
		return;
	case "PRJ_NAME":
		cmdData = cmdData.replace(/\s|\"|\'/g, "");
		if (!IX.isEmpty(cmdData) || cmdData === "\n")
			ixwPrjName = cmdData;
		ixwPrjNS = ixwPrjName.replace(/\s|\"|\'/g, "").substring(0,4).toUpperCase() || "Sample";
		print("\tproject name will be " + ixwPrjName + ".\n");
		print("Project namespace(default is " + ixwPrjNS + "):");
		currentStep = "PRJ_NS";
		return;
	case "PRJ_NS":
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData))
			ixwPrjNS = cmdData;
		ixwPrjDir = path.normalize(process.cwd() + "/../" + ixwPrjName.toLowerCase());
		print("\tproject namespace will be " + ixwPrjNS + ".\n");
		print("Project root directory (default is " + ixwPrjDir + "):");
		currentStep = "PRJ_DIR";
		return;
	case "PRJ_DIR":
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData))
			ixwPrjDir = path.normalize(cmdData);
		print("\tproject root directory will be " + ixwPrjDir + ".\n");
		print("Please confirm above settings. If yes, please press [ENTER] to continue, otherwise press [CTRL-C] to quit.");
		currentStep = "PRJ_FILES";
		return;
	default :
		copyFiles();
		console.log("\n\nAbove settings will be writen into " + ixwPrjDir + "/ixw_config.js; you can change it manually." );
		console.log("\tIn ixw_config.js, the prject name can be changed simply, but namespace should be carefule except you know what will happen." );
		console.log("The new project has three grunt tasks, please check Gruntfile.js to get more information.");
		console.log("Before you start up project, please run 'npm install' to load node modules under directory " + ixwPrjDir );
		
		process.exit(0);
	}
}

process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
	var chunk = process.stdin.read();
	if (chunk !== null)
		inputHandler(chunk);
});

process.stdin.on('end', function() {
	process.stdout.write('Configuration done');
});
inputHandler();


