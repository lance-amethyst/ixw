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
	
	//IX.saveFileIfNotExist(path.dirname(dstFName), path.basename(dstFName), fileData, IX.emptyFn);
//	if (!fs.existsSync(dstFName))
		fs.writeFileSync(dstFName, fileData, {encoding : "utf8"});
//	else
//		console.log(dstFName + "existed!");
		
}
function copyFiles(){
	IX.safeMkdirSync(ixwPrjDir + "/dist");
	childProcess.exec("cp -r _asserts " + ixwPrjDir);
	childProcess.exec("cp -r _tasks " + ixwPrjDir);
	childProcess.exec("cp -r proto " + ixwPrjDir);
	IX.safeMkdirSync(ixwPrjDir + "/proto/dist");
	childProcess.exec("cp -r src " + ixwPrjDir);
	
	dupFile("Gruntfile.js", "Gruntfile.js");
	dupFile('_ixw.json', "ixw.json");
	dupFile('_package.json', "package.json");
	dupFile('_proto.dist.index.htm', "proto/dist/index.htm");
	dupFile('_src.ixw.index.js.html', "src/ixw/index.js.html");
	dupFile('_tasks.deploy.jshintOptions.js', "_tasks/deploy/jshintOptions.js");
	dupFile('_tasks.deploy.less.js', "_tasks/deploy/less.js");
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
		console.log("\n\nAbove settings will be writen into " + ixwPrjDir + "/ixw.json; you can change it manually." );
		console.log("\tIn ixw.json, the prject name can be changed simply, but namespace should be carefule except you know what will happen." );
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


