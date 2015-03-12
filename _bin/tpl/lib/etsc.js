var fs = require("fs");

var parser = require("./parser.js").parser;
var translator = require("./translator.js");

var TplFileReg = /\.js\.html?$/g;

function _parse_file(filepath, opt) {
	console.log("parsing file :" + filepath);
	var srcPath = filepath.replace(TplFileReg, '.js');
	if(fs.existsSync(srcPath))
		fs.unlinkSync(srcPath);
	if (opt.clean)
		return;

	var result = parser.parse(fs.readFileSync(filepath, "utf8"));
	console.log("translating ... ");
	result = translator.translate(result, opt);
	if("error" in result)
		return console.error("file: " + filepath + " has error:" + result.error);
	console.log("write to JS file :" + srcPath);
	fs.writeFileSync(srcPath, result.code);

	var refFilePath = srcPath + ".ref.js";
	if(fs.existsSync(refFilePath)){ 
		var isSame = fs.readFileSync(refFilePath, "utf8") == result.code;
		console.log("Check compiled:" + (isSame?"PASS":"FAIL") + " for " + filepath + "");
	}
	console.log("compile done");
}
function checkpath(filepath, opt){
	var file = fs.statSync(filepath);
	if(file.isFile() && filepath.match(TplFileReg))
		return _parse_file(filepath, opt);
	if(!file.isDirectory())
		return;

	(fs.readdirSync(filepath) || []).forEach(function(fname){
		 checkpath(filepath + "/" + fname, opt);
	});
}
/**
 * options : {
 * 	nsName : namespace for Tpl
 * 	clean : true to clean all middle files by etsc
 * }
 */
module.exports = function(fpath, options){
	var opt = {
		nsName : "IXE.Tpl",
		clean : false
	};
	if (IX.isFn(options))
		cbFn = options;
	else
		IX.extend(opt, options);
		
	try{
		checkpath(fpath, opt);
		return true;
	} catch(ex){
		console.error(ex);
		return false;
	}
};