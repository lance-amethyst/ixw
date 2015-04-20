var fs = require('fs');
var util = require('util');
var path = require('path');

var filesData = require('./maps.json');

var curRelNo = null;
var files2Replace = [];

function _renameFile(filePath, absFilePath, digest){
	var _oldData = filePath in filesData ? filesData[filePath] : null;
	var _oldDigest = _oldData ? _oldData.digest : "";
	var isSame = !!_oldData && (_oldData.digest == digest);

	if (!isSame)
		filesData[filePath] = {
			digest : digest,
			relNo : curRelNo
		}
	
	var fnames = absFilePath.split("/");
	var fnameArr = fnames.pop().split(".");
	var last = fnameArr.pop();
	fnameArr.push(isSame ? _oldData.relNo: curRelNo);
	fnameArr.push(last);
	var newFname = fnameArr.join(".")
	fnames.push(newFname);
	fs.renameSync(absFilePath, fnames.join("/"));
	
	fnames = filePath.split("/");
	if (fnames[0] !== "images")
		return;
	fnames.pop();
	fnames.push(newFname);
	files2Replace.push({src: filePath, dest: fnames.join("/")});
}
function renameFile(filePath, absFilePath){
	absFilePath = path.normalize(absFilePath);
	_renameFile(filePath, absFilePath, IX.digestOnce(fs.readFileSync(absFilePath)));
}
function replaceCssFile(filePath, absFilePath){
	absFilePath = path.normalize(absFilePath);
	var data = fs.readFileSync(absFilePath, {encoding : "utf8"}).toString();
	files2Replace.forEach(function(f2r){
		data.replaceAll(f2r.src, f2r.dest);
	});
	fs.writeFileSync(absFilePath, data, {encoding : "utf8"});
	_renameFile(filePath, absFilePath, IX.digestOnce(data));
}

exports.mark = function(relCfg, relNo){
	var _cwd = process.cwd();
	var rootPath = _cwd + "/_dist.copy/";
	
	curRelNo = relNo;

	IX.iterDirSync(rootPath, "images", renameFile);
	IX.iterDirSync(rootPath, "js", renameFile);

	console.log("Files : " + util.inspect(files2Replace));
	IX.iterDirSync(rootPath, "css", replaceCssFile);
	var jsonString = JSON.stringify(filesData).replace(/\}/g, '}\n');
	fs.writeFileSync(_cwd + '/_tasks/release/maps.json', jsonString);
};