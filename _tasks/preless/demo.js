var fs = require('fs'),
	path = require('path');

var tasks = {};
var tplData = {
	bg : [],
	pic : []
};
exports.register = function(name){
	tasks[name] = false;
};
exports.set = function(name, result){
	if (!(name in tasks) || !result)
		return;
	tplData[result.type].push(result);
};
exports.check = function(demoPath) {
	function renderTpl(tplfile, destFile, data){
		var tpl = Preless.loadTplFromFile(tplfile);
		IX.safeWriteFileSync(demoPath +"/" +  destFile, tpl.renderData("", data));	
	}
	renderTpl("preview.htm", "preview.htm", tplData);
	renderTpl("demo.less", "less/demo.less", {
		hdr : [tplData],
		body : [tplData]
	});
};