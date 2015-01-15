var fs = require('fs'),
	path = require('path'),
	util = require('util'),
	PNG = require('pngjs').PNG;

var GrowingPacker = require('../lib/GrowingPacker'),	
	nf = require('../lib/node-file.js'),
	ztool = require('../lib/ztool');

function createPng(width, height) {
	var png = new PNG({
		width : width,
		height : height
	});
	var n = png.width* png.height *4;
	for (var i =0; i< n ; i++)
		png.data[i] = 0;
	return png;
}
function compareString(a, b){
	var len = Math.min(a.length, b.length);
	for (var i=0; i <len; i++){
		var v = a.charCodeAt(i) - b.charCodeAt(i);
		if (v!=0)
			return v>0?1:-1;
	}
	return a.length>len? 1: (b.length>len?-1 : 0);
}
//*************************************************************
//  输出预览内容
//*************************************************************
var demoHtmTpl = [
'\t<div>',
'\t\t<h3>.x-CLZ</h3>',
'\t\t<span class="CLZ" style="INFO"></span><span class="label">INFO</span>',
'\t</div>'
].join("\n");
var demoCssTpl = '.CLZ{INFO .x-CLZ;}';
var demoCssHdrTpl = '[class^="PREFIX"], [class*=" PREFIX"] {.x-PREFIX;}\n';
var demoCssReferTpl = [
'.x-PREFIX() {',
'\tdisplay : inline-block;',
'\tbackground-image : url(../images/FILE.png);',
'\tbackground-repeat: no-repeat;',
'}',
'@import "FILE";',
].join("\n");

function getPreviewContent(arr) {
	var demoHtm = [], demoCss = [];
	arr.forEach(function(item){
		var clz = item.className, info = item.whStyle;
		demoHtm.push(demoHtmTpl.replace(/INFO/g, info).replace(/CLZ/g, clz));
		demoCss.push(demoCssTpl.replace(/INFO/g, info).replace(/CLZ/g, clz));
	});
	return {
		less1 : demoCss.join("\n"),
		body : demoHtm.join("\n")
	};
}
//*************************************************************
//写入样式文件
//*************************************************************
var lessTpl = [
'.x-NAME() {',
	'\t/* INFO */',
	'\tbackground-position : -XPOSpx -YPOSpx;',			
'}'].join("\n");
function writeStyleSheetFile(filename, imgInfoArr, ifPreview) {
	var lessData = [];
	imgInfoArr.forEach(function(obj){
		var pos = obj.fit;
		lessData.push(lessTpl.replace(/NAME/g, obj.className)
				.replace(/INFO/g, obj.whStyle)
				.replace(/XPOS/g, pos.x).replace(/YPOS/g, pos.y));
	});
	_writeFile(filename, lessData.join("\n"));
	console.log("Output image css to " + filename);
	return ifPreview?getPreviewContent(imgInfoArr):null;
}
function collectImage(imageFileName, cbFn){
	var pngParser = new PNG();
	fs.createReadStream(imageFileName).pipe(pngParser);
	pngParser.on('parsed', function () {
		var result = {};
		result.image = this;
		result.width = this.width;
		result.height = this.height;	
		
		var size = 0;
		this.pack().on('data', function(chunk) {
			size += chunk.length;
		}).on('end', function() {
			result.size = size;
			cbFn(result);
		});
	});
}
function packImages(imgInfos) {
	var imgInfoArr = new Array();
	imgInfos.forEach(function(oImg){
		imgInfoArr.push(oImg);
	});
	imgInfoArr.sort(function(a, b) {
		return compareString(a.className, b.className);//b.h - a.h;
	});
	
	//对图片进行坐标定位
	var packer = new GrowingPacker();
	packer.fit(imgInfoArr);
	imgInfoArr.root = packer.root;
	// console.info("packer after fit :" + util.inspect(imgInfoArr));
	return imgInfoArr;
}
//*************************************************************
//	输出合并的图片
//*************************************************************
function drawImages(imageFile, imgInfoArr, callback){
	var imageResult = createPng(imgInfoArr.root.w, imgInfoArr.root.h);
	ztool.forEach(imgInfoArr, function (j, obj, goon) {
		//对图片进行定位和填充
		var image = obj.image;
		image.bitblt(imageResult, 0, 0, image.width, image.height, obj.fit.x, obj.fit.y);
		goon();
	}, function (count) {
		nf.mkdirsSync(path.dirname(imageFile));
		//图片填充
		imageResult.pack().pipe(fs.createWriteStream(imageFile));
		console.log("output image png to ", imageFile);
		callback();
	});
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
 * 		margin : margin for each images
 * } 
 */
exports.merge = function (cfg, cb) {
	var srcPath = cfg.src,
		classPrefix = cfg.classPrefix ||"",
		destDir = cfg.dest,
		filename = cfg.filename,
		margin = cfg.margin|| 16;
	//读取图片信息
	function readImgInfo(_fname, callback) {
		var fname = _fname.split(".");
		if (fname.length!=2 || fname[1].toLowerCase() !="png")
			return callback(null);
		collectImage(srcPath + "/" + _fname, function(result){
			result.className = classPrefix + fname[0];
			result.whStyle = 'width: '+ result.width + 'px; height:' + result.height + 'px;';
			result.w = result.width + margin;
			result.h = result.height + margin;
			callback(result);
		});
	}

	function output(list){
		if (list.length==0)
			return cb(null);
		var imgInfoArr = packImages(list);
		drawImages(destDir + "/images/" + filename + ".png", imgInfoArr, function(){
			var result = writeStyleSheetFile(destDir + "/css/" + filename + ".less",  imgInfoArr, cfg.ifPreview);
			if (result){
				result.less0 = demoCssReferTpl.replace(/FILE/g, filename).replace(/PREFIX/g, classPrefix);
				result.less1 = demoCssHdrTpl.replace(/PREFIX/g, classPrefix) + result.less1;
			}
			cb(result);
		});
	}
	fs.readdir(srcPath, function (err, files) {
		//console.info("icons file list: " + files);
		var list = [];
		ztool.forEach(files, function (j, fname, goon) { 
			readImgInfo(fname, function(result){
				result && list.push(result);
				goon();
			});
		}, function(){output(list);});
	});
};
