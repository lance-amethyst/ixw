/* Quick Zip only can be used in Unix/Linux/MacOS becuase using of Shell commands.
*/

var util = require("util");
var fs = require('fs');
var path = require('path');

var  _cwdname = "/tmp";
var _exec = require('child_process').exec;
var shCmds = [
	'cd ' + _cwdname,
	'mv {tmpname} {base}',
	'tar czvf {zipfile} {base}',
	'rm -rf {base}'
].join(";");
function QuickZip4TGZ(_zip){
	var tmpdir = _zip ? path.join(_zip.parentDir, _zip.folder) : IX.UUID.generate();
	var _tmppath = path.join(_cwdname, tmpdir);
	//console.log("ZIP To:" +  _tmppath);
	IX.safeMkdirSync(_tmppath);

	function compress(zipfilepath, cbFn){
		var basename = path.basename(zipfilepath, ".zip");
		var cmds = shCmds.loopReplace([
			["{base}", basename],
			["{zipfile}", zipfilepath],
			["{tmpname}", tmpdir]
		]);
		//console.log("CMDS:" + cmds);
		_exec(cmds, function(err){
		 	//console.log("compress done!" + zipfilepath);
			cbFn();
		});
	}
	return {
		file : function(dst, filename){
			//console.log("\tZIP:" +  filename);
			fs.writeFileSync(path.join(_tmppath, dst), fs.readFileSync(filename));
		},
		folder : function(dst){
			return new QuickZip4TGZ({
				parentDir : tmpdir,
				folder : dst
			});
		},
		compress : _zip ? undefined  :compress
	};
}

//var JSZip = require('jszip');
// function QuickZip4JSZip(_zip){
// 	var zip = _zip ? _zip : (new JSZip());
// 	function compress(zipfilepath, cbFn){
// 		var stream = zip.generateNodeStream({
// 			compression : "DEFLATE",
// 			compressionOptions : {level:6},
// 			type:'nodebuffer', 
// 			streamFiles:true
// 		});
// 		stream.pipe(fs.createWriteStream(zipfilepath))
// 			.on('error', function(err){
// 				console.log("Err Zip: " + zipfilepath, err);
// 			});
// 		cbFn();
// 	}
// 	return {
// 		file : function(dst, filename){
// 			zip.file(dst, fs.readFileSync(filename));
// 		},
// 		folder : function(dst){
// 			return new QuickZip4JSZip(zip.folder(dst));
// 		},
// 		compress : _zip ? undefined  :compress
// 	};
// }

var QuickZip = QuickZip4TGZ;

/** rule:  
	["abc", "cde","def"] for rule: "abc*cde*def"
	["",""] for rule : "*"
	["", ".html"] for rule "*.html"
 */
function matchRule(s, rule){
	var len = rule ? rule.length: 0; 
	if (len === 0)
		return false;
	var _s = s, idx = 0;
	if (!IX.isEmpty(rule[0])){
		idx = _s.indexOf(rule[0]);
		if (idx !== 0) 
			return false;
		_s = _s.substring(rule[0].length);
	}
	for (var i=1; i<len; i++){
		if (IX.isEmpty(rule[i]))
			continue;
		idx = _s.indexOf(rule[i]);
		if (idx < 0) 
			return false;
		_s = _s.substring(idx+ rule[i].length);
	}
	return true;
}
/* if match any of rules, return true */
function matchRules(filename, rules){
	var len = rules?rules.length : 0;
	if (len === 0)
		return false;
	for (var i=0; i<len; i++){
		if (matchRule(filename, rules[i]))
			return true;
	}
	return false;
}
function zipFilter(dirN, fileFilter, fileFn){
	var rules = fileFilter.get(dirN);
	fs.readdirSync(dirN).forEach(function(filename){
		if (rules && rules.length>0 && matchRules(filename, rules))
			return;
		fileFn(filename);
	});
}

function zipFile(zip, dirN, filename){
	zip.file(filename, path.join(dirN, filename));
}

function zipFolder(zip, dirN, folderName, fileFilter){
	var zipFolder = zip.folder(folderName);
	var _dirN = path.join(dirN, folderName);
	zipFilter(_dirN, fileFilter, function(filename){
		tryZip(zipFolder, _dirN, filename, fileFilter);
	});
}
function tryZip(zip, dirN, filename, fileFilter){
	var fstat = fs.statSync(path.join(dirN, filename));
	if (fstat.isFile())
		zipFile(zip, dirN, filename);
	else if (fstat.isDirectory())
		zipFolder(zip, dirN, filename, fileFilter);
	else
		return false;
	return true;
}

function zipFiles(zip, dirN, plist, fileFilter){
	var len = plist?plist.length : 0;
	if (len <= 0)
		return;
	//console.log("zipFiles: ", dirN, plist);
	zipFilter(dirN, fileFilter, function(filename){
		for (var i=0; i<len; i++){
			if (!matchRule(filename,  plist[i].rule))
				continue;
			var dst = plist[i].dst;
			var zipFolder = dst ? zip.folder(dst) : zip;
			if (tryZip(zipFolder, dirN, filename, fileFilter))
				break;
		}
	});
}
/** 
	zipInfo : {
		root : "target/basedir",
		files: [
			"filepath/filename", // ==> /filename
			"filepath/dirname",  // ==> /dirname/*
			["filepath/filename", "dir1/dir2"], // ==>/dir1/dir2/filename
			["filepath/dirname", "dir1/dir2"], // ==>/dir1/dir2/dirname
			"~filepath/filename", // remove the file from zip file
			"~filepath/dirname", // remove all files under the dirname from zip file	
		]
	}
	filename/dirname can use '*' to match any charactors; 
			examples : "abc*.html", "abc*l", "*2015*.html"
 */ 
exports.zip = function(zipfilepath, zipInfo, cbFn){
	var targetRoot = zipInfo.root || process.cwd();
	//console.log("ZIP target root: " + targetRoot);

	var zipFilesHT = new IX.I1ToNManager(); fileFilter = new IX.I1ToNManager();
	IX.iterate(zipInfo.files, function(filepath){
		var isStr = IX.isString(filepath);
		var _path = isStr ? filepath : filepath[0];
		var rule = path.basename(_path).split("*");
		var dirN = path.dirname(_path);
		var pair = null;
		if (isStr){
			if (dirN.charAt(0) == "~")
				return fileFilter.put(path.join(targetRoot, dirN.substring(1)), rule);
			pair = {rule:rule, dst: ""};
		} else 
			pair = {rule:rule, dst:filepath[1]};

		zipFilesHT.put(path.join(targetRoot, dirN), pair);
	});

	var zip = new QuickZip();
	IX.iterate(zipFilesHT.getKeys(), function(dirN){
		zipFiles(zip, dirN, zipFilesHT.get(dirN), fileFilter);
	});

	//console.log("Start ZIP file:", zipfilepath);
	zip.compress(zipfilepath, cbFn);
};
