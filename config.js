require("./_tasks/_lib/ix.js");
require("./bin/_prompt/index.js");

var getPromption = IXW.Tools.getPromption;

var fs = require("fs");
var path =  require('path');

var config = {
	type : "pure",
	name : "sample", 
	ns : "", 
	path : ""
};
function print(actType, type){
	var str = getPromption((actType ==="Q" ? "Question-" : "Confirm-") + type);
	process.stdout.write(str.loopReplace([
		["{TYPE}", config.type],
		["{NAME}", config.name],
		["{DIR}", config.path],
		["{NS}", config.ns]
	]));
}
function writeConfigFile(){
	var str = "module.exports =" + JSON.stringify(config) + ";";
	fs.writeFileSync("./ixw-config.js", str);
}
var currentStep = "initial";
function inputHandler(cmdData){
	var value = null;
	switch(currentStep){
	case "initial" :

		print("Q", "type");
		currentStep = "PRJ_TYPE";
		return;
	case "PRJ_TYPE" :
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData))
			value = cmdData - 0 ;
		value = value != 1 ? "pure" : "mixed";
		config.type = value;

		print("C", "type");
		currentStep = "PRJ_NAME";
		print("Q", "name");
		return;
	case "PRJ_NAME":
		cmdData = cmdData.replace(/\s|\"|\'/g, "");
		if (!IX.isEmpty(cmdData) && cmdData !== "\n")
			value = cmdData;
		else
			value = config.name;

		config.name = value;
		config.ns = value.replace(/\s|\"|\'/g, "").substring(0,4).toUpperCase();
		config.path = path.normalize(process.cwd() + "/../" + value);

		print("C", "name");
		currentStep = "PRJ_NS";
		print("Q", "namespace");
		return;
	case "PRJ_NS":
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData) && cmdData !== "\n")
			config.ns = cmdData;

		print("C", "namespace");
		currentStep = "PRJ_DIR";
		print("Q", "path");
		return;
	case "PRJ_DIR":
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData) && cmdData !== "\n")
			config.path = path.normalize(cmdData);

		print("C", "path");
		currentStep = "PRJ_FILES";
		print("Q", "files");
		return;
			
	default :
		writeConfigFile();
		print("C", "files");
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
	print('Configuration done');
});
inputHandler();


