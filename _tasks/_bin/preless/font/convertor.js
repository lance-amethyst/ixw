var fs = require('fs'),
	util = require('util');
	path = require('path'),
	_ = require('lodash'),
	DOMParser = require('xmldom').DOMParser,
	fstools = require('fs-tools'),
	exec = require('child_process').exec;

var ztool = require('../lib/ztool'),
	nf = require('../lib/node-file');
var errorInfo = [];
var tmpDir = './tmp_iconfont/';	//组装svg font生成的临时目录---临时存放转换坐标系后的svg文件
//*******************************************************
//char to unicode
//*******************************************************
var UnicodePrefixes = {
	'css' : '\\',
	'js' : '\\u',
	'unicode16' : '0x'
};
var toUnicode = function (str, type) {
	var l = str.length, result = []; 
	var unicodePrefix = (type in UnicodePrefixes)?UnicodePrefixes[type]:'';	
	for (var i =0; i < l; i++) {
		var unicode16 = str.charCodeAt(i).toString(16);
		if (unicode16.length < 4) {
			var t = '0000' + unicode16;
			unicode16 = t.slice(t.length - 4);
		}
		result.push(unicodePrefix + unicode16);
	}
	return result.join(' ');
};

//*******************************************************
//输出预览内容
//*******************************************************
var previewItemHtml = [
'\t<div>',
	'\t\t<h3><span class="CLZ"></span> : CONTENT</h3>',
	'\t\t<span data-l-ico="CONTENT">data-l-ico="CODE"</span>',
	'\t\t<span data-r-ico="CONTENT">data-r-ico="CODE"</span><br/>',
	'\t\t<span class="CLZ"></span><span class="label">.x-CLZ</span>',
'\t</div>'].join("\n");

function getPreviewContent(glyphs) {
	var htm = [], lesses = [];
	glyphs.forEach(function(glyph){
		var content =  glyph.unicode;
		htm.push(previewItemHtml.replace(/CONTENT/g, content).replace(/CODE/g, content.replace("&", "&amp;")).replace(/CLZ/g, glyph.css));
		lesses.push(".CLZ:before{.x-CLZ;}".replace(/CLZ/g, glyph.css));
	});
	return {
		body : htm.join("\n"), 
		demoCss : lesses.join("\n")
	};
}
//*******************************************************
//生成字体样式文件less
//*******************************************************
function writeStyleSheetFile(destDir, glyphs, ifPreview){
	var cssRoot = destDir + "/css";
	var content = [];
	glyphs.forEach(function(glyph){
		content = content.concat('.x-' + glyph.css  + '(){content : "' + glyph.content + '";}');
	});
	nf.mkdirsSync(cssRoot);
	fs.writeFileSync(cssRoot + '/font.less', content.join("\n"), 'utf8');
	//生成DEMO文件
	return ifPreview?getPreviewContent(glyphs):null;
}

//*******************************************************
// create error log
//*******************************************************
var errorLogTemplate = _.template([
	'font icon svg is invalid: \n',
	'<% _.forEach(errorLogs, function (err) { %>',
		'<%= err.fname %>\n',
	'<% }); %>'
].join(''));

function createErrorLog (errorLogs) {
	var errOut = errorLogTemplate({
		errorLogs : errorLogs
	});
	console.info("error path : " + process.cwd());
	fs.writeFileSync(path.resolve(process.cwd() , 'error.log'), errOut, 'utf8');
}
//*******************************************************
//解析SVG Img
//*******************************************************
function parseSvgImage(filename) {
	var doc = (new DOMParser()).parseFromString(fs.readFileSync(filename, 'utf8'), "application/xml");
	var svg = doc.getElementsByTagName('svg')[0];
	
	if (!svg.hasAttribute('height'))
		throw 'Missed height attribute in ' + filename;	
	if (!svg.hasAttribute('width'))
		throw 'Missed width attribute in ' + filename;
	
	var viewBox = svg.getAttribute('viewBox');
	viewBox =(viewBox && viewBox.length > 0)? viewBox.replace(/\s+/g, ',').split(','): null;	
	function parseViewBox(idx, name){
		return (viewBox && idx in viewBox)? viewBox[idx]:parseFloat(svg.getAttribute(name));
	}
	var svgInfo = {
		x: parseViewBox(0, 'x'),
		y : parseViewBox(1, 'y'),
		width : parseViewBox(2,'width'),
		height : parseViewBox(3, 'height')
	};
	
	var _path = svg.getElementsByTagName('path');	
	//if (_path.length != 1)
	//	throw 'Number of paths is not supported: ' + _path.length + '(' + filename + ')';	
	if (_path.length != 1) {
		//output err log in to error.log
		//console.log("svg icon is not format:" + filename);
		errorInfo.push({fname : filename});
		svgInfo.d = '';
		svgInfo.transform = '';
		return svgInfo;
	}
	_path = _path[0];
	
	svgInfo.d = _path.getAttribute('d');
	svgInfo.transform = _path.hasAttribute('transform')?_path.getAttribute('transform'):null;
	return svgInfo;
}

function parseGlyph(glyph){
	//从临时目录中读取svg文件获取svg的信息
	var svg = parseSvgImage(path.resolve(tmpDir, glyph.file));
	console.info("tmpDir is : " + tmpDir);
	console.info("glyph.file is : " + glyph.file);
	//console.info(svg);
	glyph.width = svg.width;
	//Fix for FontForge: need space between old and new polyline
	glyph.d = svg.d.replace(/zm/g, 'z m');
	
	//'unicode' attribute can be number in hex format, or ligature
	//console.info(glyph.code + "==" + (+glyph.code));
	if (glyph.code === +glyph.code)
		glyph.unicode = '&#x' + glyph.code.toString(16) + ';';
	else
		glyph.unicode = glyph.code;
}
//*******************************************************
//生成字体文件--读取临时目录中的所有svg合并为一个svg 的font文件
//*******************************************************
//*******************************************************
//生成SVG Font文件的模板
//*******************************************************
var SvgFontTemplate = _.template([
'<?xml version="1.0" standalone="no"?>',
'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
'<svg xmlns="http://www.w3.org/2000/svg">',
	'\t<metadata><%= metadata %></metadata>',
	'\t<defs>',
		'\t\t<font id="<%= font.fontname %>" horiz-adv-x="<%= fontHeight %>" >',
			'\t\t\t<font-face font-family="<%= fontFamily %>" font-weight="400" font-stretch="normal"',
				'\t\t\t\t units-per-em="<%= fontHeight %>" ascent="<%= font.ascent %>" descent="<%= font.descent %>"',
			'\t\t\t />',
			'\t\t\t<missing-glyph horiz-adv-x="<%= fontHeight %>" />',
			'<% _.forEach(glyphs, function (glyph) { %>',
			'\t\t\t<glyph glyph-name="<%= glyph.css %>" unicode="<%= glyph.unicode %>"',
				'\t\t\t\t d="<%= glyph.d %>"',  
				'\t\t\t\t horiz-adv="<%= glyph.width %>"',
			'\t\t\t />', 
			'<% }); %>',
		'\t\t</font>', 
	'\t</defs>',
'</svg>'].join("\n"));
function _createFont(destDir, glyphs){
	_.each(glyphs, parseGlyph);
	console.log("CREATE" + util.inspect(glyphs));
	var font = appCfg.font;
	var ffname = font.familyname;
	
	var svgOut = SvgFontTemplate({
		font : font,
		glyphs : glyphs,
		metadata : font.copyright,
		fontHeight : font.height,
		fontFamily : ffname
	});
	console.info(svgOut);
	var fontPath = destDir + "/css/font";
	nf.mkdirsSync(fontPath);
	fs.writeFileSync(path.resolve(fontPath , ffname + '.svg'), svgOut, 'utf8');
	fstools.removeSync(tmpDir);
}
function _createOtherFont(dest,cbFn){
	var font = appCfg.font;
	var ffname = font.familyname;
	var fontPath = dest + "/css/font";
	//TODO: fontforge -lang=ff -c 'Open($1); Generate($2);Open($1); Generate($3);' Yunfis.svg Yunfis.ttf Yunfis.woff
	var converCmd = [
		"fontforge",
		"-lang=ff",
		"-c",
		"'Open($1); Generate($2);",
		"Open($1); Generate($3);",
		"Open($1); Generate($4);'",
		fontPath + '/' + ffname + ".svg",
		fontPath + '/' + ffname + ".ttf",
		fontPath + '/' + ffname + ".woff",
		fontPath + '/' + ffname + ".eot"
	].join(" ");
	exec(converCmd, function(err){
		if (err) {
			console.error(err);
			//process.exit(1);
		}
		cbFn();
	});
}
//*******************************************************
//解析SVG 文件名信息
//*******************************************************
function parseSvgInfo(filename) {
	var arr = filename.split(".")[0].split("_");
	//console.info('basename is :' + arr);
	var info = {
		file : filename,
		css  : "ficon-" + arr[1]
	};
	var chs = arr[0].toLowerCase();	
	var ch = chs.substring(0, 1);
	if (ch!="l" && ch !="u"){
		info.content = ch;
		info.code = ch;
	}else{
		ch = (ch == 'u'?chs.toUpperCase():chs).substring(1,2);
		info.content = toUnicode(ch, 'css');
		info.code = '&#x' + toUnicode(ch) + ';';
	}
	return info;	
}
//*******************************************************
//生成SVG Image 文件的模板
//*******************************************************
var SvgImageTemplate = _.template([
'<svg height="<%= height %>" width="<%= width %>" xmlns="http://www.w3.org/2000/svg">',
	'<path d="<%= d %>"<% if (transform) { %> transform="<%= transform %>"<% } %> />',
'</svg>'].join(""));
//*******************************************************
//重新计算从svg转换为font的坐标
//*******************************************************
function recalCoordination(svgRoot) {
	var font = appCfg.font;
	if (font.descent > 0)
		font.descent = -font.descent;
	var fontHeight = font.ascent - font.descent;
	font.height = fontHeight;
	var glyphs = [], files= [];
	
	//console.log('fontHeight is : ' + fontHeight);
	//console.log('===================================================');
	//console.log('Transforming coordination');
	//console.log('===================================================');
	fstools.walkSync(svgRoot, /[.]svg$/i, function (filename) {
		var fname = path.basename(filename);
		//读取svg的信息
		var glyph = parseSvgImage(filename);
		glyphs.push(parseSvgInfo(fname));

		var scale = fontHeight / glyph.height;
		//descent shift
		var transform = 'translate(0 ' + font.descent + ')';
		//transform += 'translate(0 ' + (font.descent / scale) + ')';
		//scale 
		transform += ' scale(' + scale + ')';
		//vertical mirror
		transform += ' translate(0 ' + (glyph.height / 2) + ') scale(1 -1) translate(0 ' + (-glyph.height / 2) + ')';
		//console.info('transform is :' + transform);
		if (glyph.transform)
			transform += ' ' + glyph.transform;
		
		glyph.transform = transform;
		files.push(fname);		
		glyph.height = fontHeight;
		glyph.width = fontHeight;
		var svgOut = SvgImageTemplate(glyph);
		fs.writeFileSync(path.join(tmpDir, fname), svgOut, 'utf8');	
		
	});
	console.log('tmp svg files created!!');
	return glyphs;
}

//*******************************************************
//	主逻辑
//*******************************************************
exports.merge = function (cfg, cb) {
	var destDir = cfg.dest, ifPreview = cfg.ifPreview; 
	//建立临时文件夹
	nf.mkdirsSync(tmpDir);
	//读取svg图片目录，生成转换坐标系的svg图片，并且将新的临时文件放入临时目录
	var glyphs = recalCoordination(cfg.src);	
	//console.log('Optimizing images:' + util.inspect(glyphs));	
	//生成字体文件
	var svgoPath = path.resolve(process.cwd(), './node_modules/.bin/svgo');
	var svgoCmd = [svgoPath, '-f', tmpDir, '--config', path.resolve(__dirname, 'svgo.yml')].join(" ");
	
	exec(svgoCmd, function(err){
		if (err) {
			console.error(err);
			process.exit(1);
		}
		_createFont(destDir, glyphs);
		//add error log
		createErrorLog(errorInfo);
		_createOtherFont(destDir, function(){
			//生成字体样式文件
			cb(writeStyleSheetFile(destDir, glyphs, ifPreview));
		});
	});
};
