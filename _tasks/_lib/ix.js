/**
 * IX utilities extended for node.js;
 * @processOwner should be global variable which show the process and its files owner
 * 
 * File Utilities:
 	safeMkdirSync(path) : create folder for path
	saveFileIfNotExist(path, name, data, cbFn) : save data only if path/name not existed.
	safeChkFileSync(dir, subdir, filename) : make sure filePath existed and return null if filename existed. 
	safeRenameAsSync(oldFilename, dir, subdir, filename) : check if filePath/filename existed, 
			if yes, remove oldFilename only; else rename it to new path.
	safeCopyToSync(srcFile, dir, subdir, filename) :check if filePath/filename existed, 
			if yes, do noting; else copy it to new path.
	safeWriteFileSync(filePath, fileData) :
	iterDirSync(rootPath, filePath, iterFn),

	createDigest :createDigest,
	digestOnce : digestOnce,
 * Error/Log Utilities:
	setLogPath(path) : reset the log file output path, for example: 
			if path is "/tmp/ix", the log/err file should be "/tmp/ix.log"/"tmp/ix.err"
	err(errMsg) : output to *.err file
	log(errMsg) : output to *.log file
 *}
 */
var fs = require('fs');
var path = require('path');
var util = require('util');
var crypto = require('crypto');
var childProcess = require('child_process');

function chownFileOwner(filePath){
	if (global.processOwner)
		childProcess.exec("chown -R " + global.processOwner  + " " + filePath);
}
function _safeMkdirSync(_path){
	var dirs = _path.split("/"), currentDir = "";
	dirs.shift();
	try {
		dirs.forEach(function(dir){
			currentDir = currentDir + "/"  + dir;
			if (!fs.existsSync(currentDir))		
				fs.mkdirSync(currentDir, 0755);
		});
	}catch(ex){
		console.error("Exception as mkdir :" + currentDir + "::" +  ex);
	}
}
function saveFileIfNotExist(filePath, filename, fileData, cbFn){
	var fileName = filePath + "/" +filename;	
	if (fs.existsSync(fileName))
		return cbFn(new Error("File existed: " + fileName), fileName);

	if (!fs.existsSync(filePath)){
		_safeMkdirSync(filePath);
		chownFileOwner(filePath);
	}
	if (debugIsAllow("file"))
		IX.log("SAVE " +  fileName + ":" + fileData.length);
	fs.writeFile(fileName, fileData, {
		mode : 0755
	},function(err) {
		chownFileOwner(fileName);
		cbFn(err, fileName);
	});
}
function safeChkFileSync(dir, subdir, filename){
	var filePath = dir + "/" + subdir; 
	var fileName = filePath + "/" + filename;
	if (debugIsAllow("file"))
		IX.log("safeChkFileSync  " +  fileName);
	if (fs.existsSync(fileName))
		return null;
	if (!fs.existsSync(dir)){
		IX.safeMkdirSync(dir);
		chownFileOwner(dir);
	}
	if (!fs.existsSync(filePath)){
		fs.mkdirSync(filePath, 0755);
		chownFileOwner(filePath);
	}
	return fileName;
}
function safeRenameAsSync(oldFilename, dir, subdir, filename){
	var fileName = safeChkFileSync(dir, subdir, filename);
	if (debugIsAllow("file"))
		IX.log("try RENAME  " +  fileName + " from " + oldFilename);
	if (!fileName)
		return fs.unlinkSync(oldFilename);
	fs.renameSync(oldFilename, fileName);
	chownFileOwner(fileName);
}
function safeCopyToSync(srcFile, dir, subdir, filename){
	var fileName = safeChkFileSync(dir, subdir, filename);
	if (debugIsAllow("file"))
		IX.log("try COPY  " +  fileName + " from " + srcFile);
	if (!fileName)
		return;
	fs.createReadStream(srcFile).pipe(fs.createWriteStream(fileName));
	chownFileOwner(fileName);
}
function safeWriteFileSync(filePath, fileData){
	var dir = path.dirname(filePath);
	_safeMkdirSync(dir);
	fs.writeFileSync(filePath, fileData);
	chownFileOwner(filePath);
}

function iterDirSync(rootPath, filePath, iterFn){
	var _path = rootPath + filePath;
	var file = fs.statSync(_path);
	if (file.isDirectory())
		(fs.readdirSync(_path) || []).forEach(function(fname){
			iterDirSync(rootPath, filePath + "/" + fname, iterFn);
		}); 
	else if(file.isFile())
		iterFn(filePath, _path);
}

function createDigest(){
	var d = crypto.createHash('sha1');
	return {
		update : function(chunk){d.update(chunk);},
		end : function(){return d.digest('hex');}
	};
}
function digestOnce(data){
	var checksum = createDigest();
	checksum.update(data);
	return checksum.end();
}

var logFile = "/tmp/ix";
function setLogPath(logPath, filename) {
	if (IX.isEmpty(logPath) && IX.isEmpty(filename))
		return;
	if (!fs.existsSync(logPath))
		_safeMkdirSync(logPath);
	logFile = logPath + "/" + filename;
	try{
		fs.appendFileSync(logFile + '.log', "\n");	
		console.log("success set log path : " + logFile);
	}catch(ex){
		console.error("Exception as set log dir: " + logFile  + "\n" + ex);
	}
}

function _log(type, msg) {
	var dstr = IX.getTimeStrInMS();
	var _msg =  "[" + dstr + "]:" + msg;
	if ("Test" in global && global.Test.debug != "file")
		return console.log(_msg);
	
	var fname = logFile + "." + type.toLowerCase();
	fs.appendFileSync(fname, _msg + "\n");
	try{
		var fstat = fs.statSync(fname);
		if (fstat && fstat.size > 10000000) // log file size is over 10M, rename file; 
			fs.renameSync(fname, fname + "." + dstr);
	}catch(ex){
		console.error("Exception as rename to log file " +  fname + "." + dstr + " : \n" + ex);
	}
}

IX.extend(IX, {
	safeMkdirSync : _safeMkdirSync,
	saveFileIfNotExist : saveFileIfNotExist,
	safeChkFileSync : safeChkFileSync,
	safeRenameAsSync : safeRenameAsSync,
	safeCopyToSync : safeCopyToSync,
	safeWriteFileSync : safeWriteFileSync,
	
	iterDirSync : iterDirSync,
	createDigest :createDigest,
	digestOnce : digestOnce,
	
	setLogPath : setLogPath,
	err : function(errMsg) {_log("ERR", errMsg);},
	log : function(errMsg) {_log("LOG", errMsg);}
});