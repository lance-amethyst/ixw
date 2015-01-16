var fs = require('fs'),
	path = require('path');

var previewHtmlTpl = [
	'<!DOCTYPE html>',
	'<html>',
		'<head>',
			'\t<meta charset="UTF-8" />',
			'\t<title>spirite preview</title>',
			'\t<link href="css/demo.less" rel="stylesheet/less">',
			'\t<script src="http://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.5/less.min.js"></script>',
		'</head>',
		'<body>',
		'BODY',
		'<iframe src="./css/demo.less" style="height:800px;width:600px;"></iframe>',
		'</body>',
	'</html>'
].join("\n");

var tasks = [];
var taskInfos = {};

function _check(destPath) {
	var bodys = [], less0s = [], less1s = [];
	for (var i=0;i<tasks.length; i++){
		var name = tasks[i];
		var task = taskInfos[name];
		bodys.push(task.body);
		less0s.push(task.less0);
		less1s.push(task.less1);
	}
	
	var previewHtml = previewHtmlTpl.replace(/BODY/g, bodys.join("\n"));
	_writeFile(destPath + "/preview.htm", previewHtml);
	_writeFile(destPath + "/css/demo0.less", less0s.join("\n\n"));
	_writeFile(destPath + "/css/demo1.less", less1s.join("\n\n"));
	_writeFile(destPath + "/css/demo.less", 
			fs.readFileSync(path.resolve(process.cwd(), 'asset_samples/demo.less')));
}

exports.register = function(name){
	tasks.push(name);
	taskInfos [name] = false;
};
exports.set = function(name, result){
	if (!(name in taskInfos && result))
		return;
	taskInfos[name] = {
		body : ['<div class="' +name + '_area">', result.body, "</div>"].join("\n"),
		less0 : result.less0 || "",
		less1 : result.less1 || ""
	};
};
exports.check = _check;