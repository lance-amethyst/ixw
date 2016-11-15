var util = require('util');
var fs = require('fs');
var pathApi = require("path");

var parser = require("./_lib/parser.js").parser;
var translator = require("./_lib/translator.js");

var jsdom = require('jsdom');

function isEmpty(s){return s === "" || s === undefined || s === null;}
function parse(basedir, fname, options, cbFn){
	var ixwFiles = [],
		pkgFiles = [];

	var srcType = "begin";
	var dumpMsg = [new Date()];
	var pkgJs = options.name + ".js";
	var pkgHint = "[" + pkgJs +  "        ".substring(pkgJs.length) + "]";

	var filepath = pathApi.join(basedir, fname);
	var filedir = pathApi.dirname(filepath);

	function iterateTag(tag){
		var path = "";
		if (tag.tagName.toLowerCase()=="script"){
			path = tag.getAttribute("src");
		} else { // link
			var type = tag.getAttribute("type");
			if (type && type.toLowerCase()=="ets")
				path = tag.getAttribute("href");
		}
		if (isEmpty(path))
			return;
		var path1 = pathApi.normalize(filedir + "/" + path);

		if (path1.indexOf("src/lib/ix.js")>=0)
			srcType = "ixw";
		else if (path1.indexOf("proto/global.js")>=0 || path1.indexOf("proto/dist/global.js")>=0)
			srcType = "sim";
		else if (srcType == "sim" && path1.indexOf("sim/")<0)
			srcType = "pkg";
		else if (path1.indexOf("src/lib/ets.js")>=0)
			srcType = "end";

		if (tag.hasAttribute("undeploy")){
			dumpMsg.push("[UNDEPLOY]" + path);
			return;
		}
		if (srcType == "ixw"){
			dumpMsg.push("[ixw.js  ]" + path);
			ixwFiles.push(path1);
			return;
		}
		if (srcType == "pkg"){
			dumpMsg.push( pkgHint + path);
			pkgFiles.push(path1);
			return;
		}
		if (path.indexOf("_lib/jquery-2.1.1.js")<0)
			dumpMsg.push("[DISCARD ]" + path);
	}
	function dumpInfo(){
		dumpMsg.push("concat to ixw.js: " + ixwFiles.length + " files");
		dumpMsg.push("concat to " + pkgJs + ": " + pkgFiles.length + " files");
		fs.writeFileSync(basedir + "/autoconcat.inf", dumpMsg.join("\n"));
	}

	jsdom.env(
		fs.readFileSync(filepath, "utf8"),
		[basedir + "/_tasks/_lib/jquery-2.1.1.js"],
		function (err, w) {
			w.$('link,script').each(function(){
				iterateTag(this);
			});
			dumpInfo();
			cbFn(ixwFiles, pkgFiles);
		}
	);
}
function etsc_parse(filepath, opt) {
	var content = fs.readFileSync(filepath, "utf8");
	if (isEmpty(content)) return "\n";
	//console.log(filepath, ":", pathApi.extname(filepath), pathApi.extname(filepath) == ".html");
	if (pathApi.extname(filepath) == ".html") {
		var result = parser.parse(content);
		result = translator.translate(result, opt);
		if("error" in result)
			throw new Error("file: " + filepath + " has error:" + result.error);
		return result.code;
	}
	return content;
}
function doConcat(basedir, destPath, srcFiles, opt){
	var filepath = pathApi.join(basedir, destPath);
	//fs.writeFileSync(filepath, "");
	IX.safeWriteFileSync(filepath, "");

	var ifParseFail = false;
	console.log("Concating to ", filepath, ":");
	srcFiles.forEach(function(fname, idx){
		try{
			if (idx > 0)
				fs.appendFileSync(filepath, "\n");
			console.log("\t", pathApi.relative(basedir, fname));
			fs.appendFileSync(filepath, etsc_parse(fname, opt));
		} catch(e) {
			console.error(e);
			ifParseFail = true;
		}
	});
	if (ifParseFail)
		throw new Error("do auto-concat fail!");
}

function autoConcat(basedir, entryFile, destPath, options, cbFn){
	parse(basedir, entryFile, options, function(ixwFiles, pkgFiles){
		var opt = {nsName : options.namespace + ".Tpl"};
		doConcat(basedir, destPath + "js/ixw.js", ixwFiles, opt);
		doConcat(basedir, destPath + "js/" + options.name + ".js", pkgFiles, opt);

		console.log("Detail for auto-concating can be seen in file: " + basedir + "/autoconcat.inf");
		cbFn();
	});
}

module.exports = function(cfg, done){
	autoConcat(process.cwd(), cfg.deploy.file, cfg.deploy.dest, cfg, done);
};

// autoConcat("/data/share/github/dog", "proto/index.htm", "_dist/", {
// 	name : "dog",
// 	namespace : "DOG"
// }, function(){});