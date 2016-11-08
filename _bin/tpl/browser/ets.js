// ets : easy template script
var ETS = {};
window.ETS = ETS;
ETS.namespace = window["ETS_NS"] || "IX.Tpl";
ETS.lineDelimiter = "\n";
var etsParseErros = [];
ETS.parseErrors = etsParseErros;
var debug = "ETS_DEBUG" in window ? window.ETS_DEBUG : false;

function loadFile(_fileUrl, _successFn, _failFn) {
	var request;
	if ("XMLHttpRequest" in window) {
		request = new XMLHttpRequest();
	}
	if ("ActiveXObject" in window) {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (!request) {
		return _failFn("need AJAX");
	}
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				_successFn(request.responseText);
			} else {
				_failFn(request.status + " : " + request.statusText);
			}
		}
	};
	request.open("GET", _fileUrl, true);
	request.send("");
}

function addErrorInfo(_fileObj, _method, _ex){
	try{
		etsParseErros.push({
			method: _method,
			path: _fileObj.path,
			sourceCode: _fileObj.code,
			parseCode: _fileObj.codeStr,
			error: _ex
		});
		console.info(etsParseErros[etsParseErros.length - 1]);
		_fileObj.error = _ex.toString();
	}catch(ex){
		console.error({
			method: "addErrorInfo",
			error: ex,
			arguments: arguments
		});
	}
}
function parseFile(_fileObj) {
	try {
		if (_fileObj.fileType == "js") {
			_fileObj.codeStr = { code: _fileObj.code };
			_fileObj.parseCode = {};
			_fileObj.source_code = _fileObj.code;
		} else {
			_fileObj.parseCode = IXTplParser.parse(_fileObj.code);
			_fileObj.codeStr = IXTplTranslate(_fileObj.parseCode, {
				nsName : ETS.namespace,
				newLine: ETS.lineDelimiter 
			});
		}
	} catch (ex) {
		addErrorInfo(_fileObj, "parseFile", ex);
	}
}
function evalCode(_script, _i) {
	try {
		/*
		window.funcs = {};
		funcs[jsFilePrev + _i] = new Function("return " + _script.codeStr + ";" + "//@ sourceURL=" + _script.path);
		return funcs[jsFilePrev + _i]();
		var n = new Function("return " + _script.codeStr + ";" + "//@ sourceURL=" + _script.path);
		return n();*/
		//eval(_script.codeStr + "//# sourceURL=" + _script.path);
		var script= document.createElement('script');
		script.type= 'text/javascript';
		script.text = _script.codeStr + "\r\n//@ sourceURL=" +  _script.path;
		document.body.appendChild(script);
	} catch (ex) {
		etsParseErros.push({
			method: "evalCode",
			path: _script.path,
			sourceCode: _script.code,
			code: _script.codeStr,
			error: ex
		});
		console.info(etsParseErros[etsParseErros.length - 1]);
	}
}

var TplFileReg = /\.js\.html?$/g;
var scriptPaths =[]; 
var loadFailFiles = [], loadedFiles, loadedSourceFiles;
var datetimetick = (new Date()).valueOf();

function _loadETScript(scriptPath){
	loadFile(scriptPath.path+"?t="+datetimetick, function (result) {
		scriptPath.code = result;
		parseFile(scriptPath);
		loadedFiles--;
		parseFiles();
	}, function (_e) {
		scriptPath.error = _e;
		loadedFiles--;
		loadFailFiles.push(scriptPath);
		parseFiles();
	});
}
function _loadETScriptSource(scriptPath){
	loadFile(scriptPath.path.replace(TplFileReg, 'js.ref.js'), function (result) {
		scriptPath.source_code = result;
		loadedSourceFiles--;
		parseFiles();
	}, function (_e) {
		scriptPath.source_error = _e;
		loadedSourceFiles--;
		loadFailFiles.push(scriptPath);
		parseFiles();
	});
}

var _debugPanel = null;
function addRule(style, selectorText, cssText, position) {
	//style标签  选择器   样式   位置 
	if (style.insertRule) { //chrome | FF |IE9+ 
		style.insertRule(selectorText + '{' + cssText + '}', position);
	} else if (style.addRule) { //IE8 IE7 IE6 
		style.addRule(selectorText, cssText, position);
	}
}
function debugParseScript(ci, i, trtplcode){
	var _div = document.createElement("table");
	_div.innerHTML = [
		"<tr><td>", i+1, 
		"</td><td class='path'>", ci.path,
		"</td><td><textarea>", ci.code || ci.source_error,
		"</textarea></td><td><pre>", (ci.source_code || ci.source_error || "").replace(/</g, "&lt;"),
		"</pre></td><td><pre>", trtplcode,
		"</pre></td></tr>"].join("");

	var row = _div.rows[0];
	_debugPanel.tBodies[0].appendChild(row);

	var txt_s = row.getElementsByTagName("pre");

	var height = Math.max(txt_s[0].scrollHeight, txt_s[1].scrollHeight) + 30;
	txt_s[0].style.height = height + "px";
	txt_s[1].style.height = height + "px";

	if (txt_s[0].innerHTML != txt_s[1].innerHTML)
		row.className += "error";
}
if (debug) {
	var tableStyles = [
		["table.etsdebug", 					"width:100%; border-collapse:collapse;table-layout:fixed;"],
		["table.etsdebug td", 				"border: 1px solid gray;"],
		["table.etsdebug td:first-child", 	"text-align:center;"],
		["table.etsdebug th", 				"border: 1px solid gray; background-color: #ccc; color:black;"],
		["table.etsdebug textarea",			"width:100%;height:100%; background-color:transparent;"],
		["table.etsdebug tr td.path",		"word-break: break-all;word-wrap: break-word;"],
		["table.etsdebug tr.error td.path", "color:red;"],
		["table.etsdebug pre", 				"width:100%;height:100%; background-color:transparent; overflow: auto;"]
	];
	
	var _style = document.createElement("style");
	_style.type = "text/css";
	document.head.appendChild(_style);
	_style = document.styleSheets[document.styleSheets.length - 1];
	var j = tableStyles.length, i = 0;
	for (; i < j; i++)
		addRule(_style, tableStyles[i][0], tableStyles[i][1], i);

	_debugPanel = document.createElement("table");
	_debugPanel.className = 'etsdebug';
	_debugPanel.innerHTML = [
		"<colgroup>",
			"<col width='40' />",
			"<col width = '120' />",
			"<col />",
			"<col />",
			"<col />",
		"</colgroup>",
		"<thead>",
			"<tr><th colspan = 5></th><tr/>",
			"<tr><th>#</th><th>PATH</th><th>SOURCE</th><th>REF</th><th>CODE</th><tr/>",
		"</thead>",
		"<tbody></tbody>",
		"<tfoot><tr><td colspan = 5></td></tr></tfoot>"
	].join("");
	document.body.appendChild(_debugPanel);
}

function parseScript(ci, i){
	if (ci.load) 
		return 0;
	ci.load = true;
	
	var trtplcode  = "", hasError  = true;
	if (!ci.error) {
		if (ci.codeStr.error) {
			trtplcode = ci.codeStr.error;
			ci.codeStr = "";
			addErrorInfo(ci, "parseFiles", trtplcode);
		} else {
			hasError = false;
			ci.codeStr = ci.codeStr.code;
			trtplcode = (ci.codeStr || "").replace(/</g, "&lt;");
			evalCode(ci, i);
		}
	} else {
		trtplcode = ci.error;
		addErrorInfo(ci, "parseFiles", trtplcode);
	}
	if (debug)
		debugParseScript(ci, i, trtplcode);
	return hasError?1:0;
} 
function parseFiles() {
	if (loadedFiles !== 0 || (debug && loadedSourceFiles !== 0))
		return; // file not all loaded!

	var errorNum = 0, total = scriptPaths.length ;
	for (var i = 0; i < total; i++) 
		errorNum += parseScript(scriptPaths[i], i);

	if (debug) {
		var mstick = (new Date()).valueOf() - datetimetick;
		console.log("parsing tpl total use : "  + mstick + "ms");

		_debugPanel.tFoot.rows[0].cells[0].innerText = mstick;
		_debugPanel.tHead.rows[0].cells[0].innerHTML = "共" + total + "个，失败：" + errorNum + "个，耗时：" + mstick + "ms";
	}
}

var SCRIPT_TYPE = "ets" ;
function loadLinks(ci){
	if (ci.type != SCRIPT_TYPE)
		return;
	var ciHref = ci.href;
	var _file = {
		path: ciHref,
		code: "",
		load: false,
		parseCode: "",
		error: null,
		fileType: "js"
	};
	 
	if (ciHref.match(TplFileReg))
		_file.fileType = "js.htm";
	else if (!ciHref.match(/\.js$/)) 
		return addErrorInfo(_file, "loadLinks", 
				!ciHref ? "缺少属性“href”或href属性值为空" : "不能解析的文件，目前只支持以.js.html、.js.htm、.js为后缀的文件解析。");
	scriptPaths.unshift(_file);
}
function loadFiles(_i) {
	var scriptPath = scriptPaths[_i];
	if (!scriptPath) 
		return;
	_loadETScript(scriptPath);

	if (debug) {
		if (scriptPath.fileType != "js") {
			_loadETScriptSource(scriptPath);
		} else {
			loadedSourceFiles--;
			parseFiles();
		}
	}
}
function onload() {
	var  scripts = document.getElementsByTagName("link");
	var i =0;
	for (i = scripts.length - 1; i >= 0; i--)
		loadLinks(scripts[i]);
	loadedFiles = scriptPaths.length;
	loadedSourceFiles = loadedFiles;
	
	for (i =0; i< scriptPaths.length; i++)
		loadFiles(i);
}

if(window.addEventListener){
	window.addEventListener("load", onload);
}else{
	window.attachEvent("onload", onload);
}