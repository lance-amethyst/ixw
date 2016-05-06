require("./_tasks/_lib/ix.js");

var fs = require("fs");
var util = require("util");
var path = require("path");
var childProcess = require('child_process');
var exec = childProcess.exec;

var etsc = require('./_bin/tpl/lib/etsc.js');
var etsRoot = process.cwd() + "/_lib/_ixwui";

function _etsc(ifClean){
	return etsc(etsRoot, {
		nsName : "IXW.Tpl",
		clean : !!ifClean
	});
}

var ixwPrjName = "sample", ixwPrjNS = "", ixwPrjDir = "", ixwPrjType = 0;

function dupFile(srcFile, destFile){
	var fileData = fs.readFileSync("_tpl/"  + srcFile, {encoding : "utf8"});
	fileData = fileData.replaceAll('{PRJ}', ixwPrjName).replaceAll('{NS}', ixwPrjNS);
	var dstFName =ixwPrjDir + destFile;
	var dir = path.dirname(dstFName);
	IX.safeMkdirSync(dir);
	fs.writeFileSync(dstFName, fileData, {encoding : "utf8"});
}
function appendToFile(destFile, files){
	IX.safeMkdirSync(path.dirname(destFile));
	if(fs.existsSync(destFile))
		fs.unlinkSync(destFile);
	IX.iterate(files, function(filename){
		fs.appendFileSync(destFile, fs.readFileSync(filename));
	})
}

function dupETSFiles(destDir){
	var destFile = destDir + "/src/lib/ets.js";
	IX.safeMkdirSync(path.dirname(destFile));
	if(fs.existsSync(destFile))
		fs.unlinkSync(destFile);
	fs.appendFileSync(destFile, "(function () {\n");
	fs.appendFileSync(destFile, fs.readFileSync("_bin/tpl/lib/parser.js"));
	fs.appendFileSync(destFile, "\n");
	fs.appendFileSync(destFile, fs.readFileSync("_bin/tpl/lib/translator.js"));
	fs.appendFileSync(destFile, '\n');
	fs.appendFileSync(destFile, fs.readFileSync("_bin/tpl/browser/ets.js"));
	fs.appendFileSync(destFile, "\n})();");
	
	exec("cp -r _bin/tpl/lib " + destDir + "/_tasks/deploy/_lib");
}

function copyFiles(cbFn){
	IX.safeMkdirSync(ixwPrjDir);
	if (ixwPrjType  == 1 ) {
		exec("cp -r _tpl/www " + ixwPrjDir);
		exec("cp -r _tpl/server " + ixwPrjDir);
	} else {
		exec("cp -r _tpl/www/* " + ixwPrjDir);
	}
	var destDir =  ixwPrjType==1?"/www":"";
	var wwwDir = ixwPrjDir + destDir;

	exec("cp -r _asserts " + wwwDir);
	exec("cp -r _tasks " + wwwDir);

	dupFile('../_lib/ixwui.less', destDir + "/src/less/ixwui.less");
	dupFile((ixwPrjType  == 1?"bp":"fp") + "_post.sh", "/init_project.sh");
	dupFile('_www.ixw_config.js', destDir + "/ixw_config.js");
	dupFile('_www.package.json',  destDir + "/package.json");	
	dupFile('_www.src.ixw.index.js.html', destDir + "/src/ixw/index.js.html");
	if (ixwPrjType  == 1 ) {
		dupFile("_server.package.json", "/server/package.json");
		dupFile("_server.public.index.htm", "/server/public/index.htm");
		dupFile("_server.service.db.db.sql", "/server/service/db/db.sql");
		dupFile('_www.proto.sim.htm',  "/www/proto/sim.htm");
		dupFile('_www.proto.index.htm', "/www/proto/index.htm");
	}else {
		dupFile('_front.proto.index.htm',  "/proto/index.htm");
		dupFile('_front.proto.dist.index.htm', "/proto/dist/index.htm");
	}

	appendToFile(wwwDir + "/src/lib/ixw.js", [
		"_lib/_ixw/base.js",
		"_lib/_ixw/session.js",
		"_lib/_ixw/engine.js",
		"_lib/_ixw/pages.js"
	]);
	
	_etsc(false);
	appendToFile(wwwDir + "/src/lib/ixwui.js", [
		"_lib/_ixwui/base.js",
		"_lib/_ixwui/dialog.js",
		"_lib/_ixwui/sysDialog.js",
		"_lib/_ixwui/fileUploader.js",
		"_lib/_ixwui/datepicker.js",
		"_lib/_ixwui/pagination.js",
		"_lib/_ixwui/chosable.js"
	]);
	_etsc(true);

	dupETSFiles(wwwDir);
	setTimeout(cbFn, 1000);
}

var ProjectTypes = [
	"[0] Web Frontend project only;",
	"[1] Whole Web project including Frontend and Backend (only unix/linux/mac-os platform supported)."
];
var ProjectTypeStr = [
	[
		"The new project has three grunt tasks, please check Gruntfile.js to get more information.",
		"Before you start up project, please run 'sh init_project.sh' under directory {DIR}",
		"",
		"After you config valid HTTP service for the project, please update line 11 in file proto/index.htm:",
		'\tvar IXW_BaseUrl = "http://localhost/{NAME}";',
		"as your configuration before you open it in browser.\n\n"
	].join("\n"),
	[
		"The new project has 2 directories under {DIR}: ",
		"\t'www' is for frontend project and",
		"\t'server' is for backend project",
		"",
		"Before you start up project, please run 'sh init_project.sh' under directory {DIR}",
		"",

		"After initialize the project '{NAME}': ",
		"1) You can run 'npm start' under 'server' to start the project and browse it with URL:",
		"\thttp://localhost:4000",
		"If you want to change HTTP to HTTPS or the port, please update line 15-16 in config file 'config.js' under 'server':",
		'\t"port" : 4000,',
		'\t"useHTTPS" : false,',
		"And change the value of IXW_BaseUrl in following files:",
		'\twww/proto/index.htm',
		'\tserver/public/index.htm',
		"More detail you can find in those files.",
		"",
		"2) Also you can visit Frontend project with backend supported:",
		"\t http://localhost:4000/demo/proto/index.htm",
		"",
		"3) Also you can visit Frontend project with simulation data:",
		"\t http://localhost:4000/demo/proto/sim.htm",
		"",
		"Enjoy it!",
		""
	].join("\n")
];
var OutputStr = {
	"PRJ_NAME" : {
		before : "Please input project name(default is sample):",
		after : "\tproject name will be: {NAME}.\n"
	},
	"PRJ_NS" : {
		before : "Please input project namespace(default is {NS}):",
		after : "\tproject namespace will be: {NS}.\n"
	},
	"PRJ_DIR" : {
		before : "Please input project root directory (default is {DIR}):",
		after : "\tproject root director will be: {DIR}.\n"
	},
	"PRJ_TYPE" : {
		before : [
			"Please choose project type(default is " + ProjectTypes[0] + "):",
			"\t" + ProjectTypes[0],
			"\t" + ProjectTypes[1]
		].join("\n"),
		after : "\tproject type will be : {TYPE}.\n"
	},
	"PRJ_FILES" : {
		before : "Please confirm above settings. If yes, please press [ENTER] to continue, otherwise press [CTRL-C] to quit.",
		after : [
			"\n\nAbove settings will be writen into {DIR}/ixw_config.js; you can change it manually.",
			"In ixw_config.js, the project name can be changed simply, but namespace should be carefule only if you know what will happen.",
			"",
			""
		].join("\n")
	}
};

function print(s){
	process.stdout.write(s);
}
var currentStep = "initial";
function inputHandler(cmdData){
	switch(currentStep){
	case "initial" :
		
		currentStep = "PRJ_TYPE";
		print(OutputStr[currentStep].before);
		return;
	case "PRJ_TYPE" :
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData))
			ixwPrjType = cmdData - 0 ;
		ixwPrjType = ixwPrjType != 1 ? 0 : 1;
		var typeStr = ProjectTypes[ixwPrjType];
		print(OutputStr[currentStep].after.replace('{TYPE}', typeStr));

		currentStep = "PRJ_NAME";
		print(OutputStr[currentStep].before);
		return;
	case "PRJ_NAME":
		cmdData = cmdData.replace(/\s|\"|\'/g, "");
		if (!IX.isEmpty(cmdData) || cmdData === "\n")
			ixwPrjName = cmdData;	
		print(OutputStr[currentStep].after.replace('{NAME}', ixwPrjName));
		
		currentStep = "PRJ_NS";
		ixwPrjNS = ixwPrjName.replace(/\s|\"|\'/g, "").substring(0,4).toUpperCase() || "SMPL";
		print(OutputStr[currentStep].before.replace('{NS}', ixwPrjNS));
		return;
	case "PRJ_NS":
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData))
			ixwPrjNS = cmdData;
		print(OutputStr[currentStep].after.replace('{NS}', ixwPrjNS));
		
		currentStep = "PRJ_DIR";
		ixwPrjDir = path.normalize(process.cwd() + "/../" + ixwPrjName.toLowerCase());
		print(OutputStr[currentStep].before.replace('{DIR}', ixwPrjDir));
		return;
	case "PRJ_DIR":
		cmdData = cmdData.replace(/\s|\"|\'/g, "").toUpperCase();
		if (!IX.isEmpty(cmdData))
			ixwPrjDir = path.normalize(cmdData);
		print(OutputStr[currentStep].after.replace('{DIR}', ixwPrjDir));

		currentStep = "PRJ_FILES";
		print(OutputStr[currentStep].before);
		return;
			
	default :
		print(OutputStr[currentStep].after);

		print("\n Start copy files .....\n ");
		copyFiles(function(){
			print("\n Copy files done!\n ");
			print(ProjectTypeStr[ixwPrjType].loopReplace([
				["{NAME}", ixwPrjName],
				["{DIR}", ixwPrjDir],
				["{NS}", ixwPrjNS]
			]));
			process.exit(0);
		});
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


