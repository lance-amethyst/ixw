var fs = require('fs');
//var util = require('util');

var ztool = require('../lib/ztool.js');

// function to encode file data to base64 encoded string
function base64_encode(file) {
	return new Buffer(fs.readFileSync(file)).toString('base64');
}

//*************************************************************
//	输出预览内容
//*************************************************************
var demoHtmTpl = [
'\t<div>', 
	'\t\t<h3>.x-NAME</h3>',
	'\t\t<div class="NAME" style="INFO">INFO</span></div>',
'\t</div>'].join("\n");
var demoCssTpl = '.NAME {INFO .x-NAME;}';
var demoCssReferTpl = '@import "FILE";';

function getPreviewContent(infoCache) {
	var demoHtm = [], demoCss = [];
	infoCache.forEach(function(info){
		var clz = info.className, style = info.style;
		demoHtm.push(demoHtmTpl.replace(/NAME/g, clz).replace(/INFO/g, style));
		demoCss.push(demoCssTpl.replace(/NAME/g, clz).replace(/INFO/g, style));
	});
	return {
		less1 : demoCss.join("\n"),
		body : demoHtm.join("\n")
	};
}
//*************************************************************
//输出样式文件
//*************************************************************
var lessTpl = [
'.x-NAME() {',
	'\t/* INFO */',
	'\tbackground : url(data:image/png;base64,DATA) DIRECT;',			
'}'].join("\n");
function writeStyleSheetFile(filename, infoCache, ifPreview) {
	var lessData = [];	
	infoCache.forEach(function(info){
		lessData.push(lessTpl.replace(/NAME/g, info.className).replace(/INFO/g, info.style)
				.replace(/DATA/g, info.base64).replace(/DIRECT/g, info.direction));
	});
	_writeFile(filename, lessData.join('\n'));
	console.log("Output background css to " + filename);
	return ifPreview?getPreviewContent(infoCache):null;
}
//*************************************************************
//	主逻辑
//*************************************************************
/** cfg :{
 * 		dest : to contain less file
 * 		filename : to name the background less file
 * 		src : the direction contain origin background images
 * 		classPrefix : prefix for all background in src folder
 * 		ifPreview : if need demo file to preview
 * } 
 */
exports.merge = function(cfg, cb) {
	var srcPath = cfg.src;
	var clzPrefix = cfg.classPrefix || "";
	function parseFile(fname){
		var arr = fname.split(".");
		if (arr.length!=2 || arr.pop().toLowerCase()!="png")
			return null;
		var clzName = arr[0]; 
		var arr1 = clzName.split("_");
		var isH = arr1[0].toLowerCase() == 'h';
		return { //通过图片的文件名获取样式数据
			direction : isH ? 'repeat-x' : 'repeat-y',
			style : (isH?"height:":"width:") + arr1[1] + "px;",
			base64 : base64_encode(srcPath + "/" + fname),
			className : clzPrefix + clzName
		};		
	}
	function output(list){
		if (list.length==0)
			return cb(null);
		//console.info(list.length);
		var fname = cfg.filename;
		var result = writeStyleSheetFile(cfg.dest + "/css/" + fname + ".less", list, cfg.ifPreview);
		if (result)
			result.less0 = demoCssReferTpl.replace(/FILE/g, fname);
		cb(result);
	}
	fs.readdir(cfg.src, function (err, files) {
		//console.info("background list :\n\t" + util.inspect(files));
		var list = [];
		ztool.forEach(files, function (j, fname, goon) {
			var info = parseFile(fname);
			if (info)
				list.push(info);
			goon();
		}, function(){output(list);});	
	});
};