var util = require('util');
var fs = require('fs');
var path = require('path');
var topojson = require("topojson");

var infoHT = new IX.IListManager();
function writeTopojsonFile(srcPath, destPath){
	var geoData = require(srcPath);
	var key = (path.basename(srcPath, ".json") + "000000").substring(0, 6);

	console.log("convert :", srcPath, key);

	var baseData = infoHT.get(key) || {};
	baseData.id = baseData.id || key;
	baseData.name = baseData.name || geoData.name;
	infoHT.register(key, baseData);
	
	var topoData = topojson.topology({collection: geoData}, {
		"property-transform" : function(feature) {
			var properties = feature.properties;
			// var _key = (properties.id+ "000000").substring(0, 6);
			// var data = infoHT.get(_key) || {};
			// data.id = _key;
			// data.name = data.name || properties.name;
			// data.cp = data.cp || properties.cp;
			// infoHT.register(_key, data);
			return { id: properties.id,  name : properties.name};
		}
	});
	baseData.bbox = topoData.bbox;
	var bbox = baseData.bbox;
	//baseData.cp = baseData.cp || geoData.cp || [(bbox[0]+bbox[2])/2, (bbox[1]+bbox[3])/2];
	IX.safeWriteFileSync(path.dirname(destPath) + "/" + key + ".json", JSON.stringify(topoData));
}

function checkPath(filepath, dstPath){
	var file = fs.statSync(filepath);
	if(file.isFile() && filepath.indexOf("json")>=0)
		return writeTopojsonFile(filepath, dstPath);
	if(!file.isDirectory())
		return;

	(fs.readdirSync(filepath) || []).forEach(function(fname){
		checkPath(filepath + "/" + fname, dstPath + "/" + fname);
	});
}

var _cwd = process.cwd() + "/" ;
var tpl4JS = [
'(function(){var nsGEO = IXW.ns("GEO");nsGEO.', 
'', 
'=[',
'',
'];})();'];
function processFn(taskCfg, finishFn){
	var filepath = _cwd + taskCfg.src, dstPath = _cwd + taskCfg.dest;
	(fs.readdirSync(filepath) || []).forEach(function(fname){
		var file = fs.statSync(filepath+ "/" + fname);
		if(!file.isDirectory() || fname.substring(0,1) == '.')
			return;

		infoHT.clear();
		checkPath(filepath + "/" + fname, dstPath + "/" + fname);
		tpl4JS[1] = fname;
		tpl4JS[3] = IX.map(infoHT.getKeys().sort(), function(key){
			return JSON.stringify(infoHT.get(key));
		}).join(",\n");
		IX.safeWriteFileSync(dstPath + "/" + fname + ".js", tpl4JS.join(""));
	});
	
	finishFn();
}

module.exports = function(grunt, prjCfg, done){
	processFn(prjCfg.premap, done);
};