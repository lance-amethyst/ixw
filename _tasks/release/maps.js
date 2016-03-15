var fs = require('fs');
var util = require('util');
var path = require('path');

var filesData = require('./maps.json');

var curRelNo = null;
var files2Replace = [];

var PathSepRegex = /\\|\//;
var LocalPathSep = path.sep;
var StdPathSep = "/";

function _renameFile(filePath, absFilePath, digest){
	var fileData = filePath in filesData ? filesData[filePath] : null;
	if (!fileData || fileData.digest !== digest) {
		console.log("file:" +  filePath + "::: is not same!");
		filesData[filePath] = {
			digest : digest,
			relNo : curRelNo
		};
		fileData = filesData[filePath];
	}

	var fnames = absFilePath.split(PathSepRegex);
	var fnameArr = fnames.pop().split(".");
	var last = fnameArr.pop();
	fnameArr.push(fileData.relNo);
	fnameArr.push(last);
	var newFname = fnameArr.join(".");
	fnames.push(newFname);
	fs.renameSync(absFilePath, fnames.join(LocalPathSep));
	
	fnames = filePath.split(PathSepRegex);
	fnames.pop();
	fnames.push(newFname);
	fnames = fnames.join(StdPathSep);
	files2Replace.push({src: filePath, dest: fnames});

	console.log("file:" +  filePath + " should be renamed as " + fnames);
}

function renameImageFiles(prjCfg, rootPath){
	var files2Rename = {};
	var oemList = prjCfg.oem;
	oemList.unshift("");
	var pngs = IX.map($XP(prjCfg, "preless.picmap", []), function(task){
		return $XP(task, "path", "pic");
	});
	IX.iterate(oemList, function(oemName){
		IX.iterate(pngs, function(pngName){
			var name = pngName + (oemName ? ("-"+oemName) : "") + ".png";
			files2Rename[name] = true;
		});
	});

	IX.iterDirSync(rootPath, "images", function(filePath, absFilePath){
		var fnames = filePath.split(PathSepRegex);
		if (fnames[0] != "images" || !(fnames[1] in files2Rename))
			return;

		absFilePath = path.normalize(absFilePath);
		_renameFile(filePath, absFilePath, IX.digestOnce(fs.readFileSync(absFilePath)));
	});
}

function replaceFileContent(filePath, absFilePath){
	absFilePath = path.normalize(absFilePath);
	var data = fs.readFileSync(absFilePath, {encoding : "utf8"}).toString();
	files2Replace.forEach(function(f2r){
		data = data.replaceAll(f2r.src, f2r.dest);
	});
	fs.writeFileSync(absFilePath, data, {encoding : "utf8"});
	//_renameFile(filePath, absFilePath, IX.digestOnce(data));
}

exports.mark = function(prjCfg, relCfg, relNo){
	var _cwd = process.cwd();
	var rootPath = _cwd + "/_dist.copy/";

	curRelNo = relNo;
	console.log("Current Release NO: " +  relNo);
	renameImageFiles(prjCfg, rootPath);
	console.log("Image Files : " + util.inspect(files2Replace));

	IX.iterDirSync(rootPath, "js", replaceFileContent);
	IX.iterDirSync(rootPath, "css", replaceFileContent);

	var jsonString = JSON.stringify(filesData).replace(/\}/g, '}\n');
	fs.writeFileSync(_cwd + '/_tasks/release/maps.json', jsonString);
};