/**
 * @param parsedData : parsing data;
 * @param transConfig : {
 *		newLine : "\n" || "\r\n"
 *		nsName : name space for gloal tpl class;
 * }
 */
function _ix_tpl__translate(parsedData, transConfig) {
	var _newline = transConfig && transConfig.newLine || "\n",
		nsName = (transConfig && transConfig.nsName || "IX.Tpl") + ".";

	var code = "", exportsCode = "", lastTag = "",
	nameSpaces = {}, lastLine = 1;

	var reg_pre = "((\\r\\n\\s*)|(\\n\\s*))";

	var EmptyLineEndReg = new RegExp(reg_pre + "$", "g");
	var EmptyLineStartReg = new RegExp("^" + reg_pre, "g");
	var EmptyLineReg = new RegExp(reg_pre, "g");

	var LineSplitReg = /(\r*\n\s*)/g;

	exportsCode = _newline;

	function _compileText(midText){
		var tArr = midText.split(LineSplitReg);
		var len = tArr.length;
		var text = "";
		for (var _i = 0; _i < len; _i++) {
			var ci = tArr[_i];
			if (!ciq)
				continue;
			var cMatch = ci.match(LineSplitReg);
			if (cMatch)
				text += ci.replace(LineSplitReg, cMatch + "'");
			else
				text += ci + (_i == len - 1 ? "" : "',");
		}
		return text;
	}
	function compileTextTag(op){
		var matchResult = null;
		var midText = op.text.replace(/'/g, "\\'");
		var prevText= "'", endText = "',";

		matchResult = midText.match(EmptyLineEndReg);
		if (matchResult) {
			endText = "'," + matchResult[0];
			midText = midText.replace(EmptyLineEndReg, "");
		}
		matchResult = midText.match(EmptyLineStartReg);
		if (matchResult) {
			prevText = matchResult[0] + "'";
			midText = midText.replace(EmptyLineStartReg, "");
		}
		matchResult = midText.match(EmptyLineReg);
		if (matchResult)
			midText = _compileText(midText);
        code += (prevText + midText + endText).replace(/'',/g, "");
	}
	//line start by 1
	//column start by 0
	function add_newline(op) {
		var totalLine = op.first_line - lastLine;
		if (totalLine >= 1) {
			for (var i = 0; i < totalLine; i++)
				code += _newline;
		}
		lastLine = op.last_line + 1;
	}
	function compleTplExport(exportValue, idValue, _prevTpls){
		var ifTopTpl = !_prevTpls || _prevTpls.length == 0;
		if (!exportValue)
			return ifTopTpl;

		var _nsValue = "t_" + idValue;
		if (!ifTopTpl) {
			var _root = "", _root_o = "t_" + _prevTpls[0];
			for (var i = 1; i<_prevTpls.length; i++)
				_root += _prevTpls[i] + ".";
			_root += idValue;
			_nsValue = "new IX.ITemplate({tpl:" + _root_o + ".getTpl('" + _root + "')})";
		}

		var _nsName = nsName + exportValue.value;
		if (nameSpaces[_nsName])
			throw "重复的命名空间：" + _nsName;
		nameSpaces[_nsName] = 1;
		exportsCode += "IX.setNS('" + _nsName + "', " + _nsValue + ");" + _newline;

		return ifTopTpl;
	}
	function compileTplTag(op, _prevTpls) {
		var idValue = op.attrs.id.value;
		var ifTopTpl = compleTplExport(op.attrs.export, idValue, _prevTpls);
		var codepair = ["", ""];

		if (!ifTopTpl) {
			codepair[0] = "'" + op.text.replace(/'/g, "\\'") + "',";
			codepair[1] = "'" + op.endText + "',";
		} else {
			lastTag = op.type;
			add_newline(op);

			_prevTpls = [];
			codepair[0] = "var t_" + idValue + " = new IX.ITemplate({tpl: [";
			codepair[1] = "'']});" + _newline;
		}
		_prevTpls.push(idValue);
		code += codepair[0];
		getCodes(op.tpls, _prevTpls);
		code += codepair[1];
		_prevTpls.pop();
	}
	function compileUseTag(op){
		var data = op.attrs.data, idValue = op.attrs.id.value;
		var tplId = null, refId = "";

		if (idValue[0] == ".") { //local template
			tplId = "t_" + idValue.substring(1);
			var idx = tplId.indexOf(".");
			if (idx > -1) {
				refId = "'" + tplId.substring(idx+1) + "'";
				tplId = tplId.substring(0, idx);
			}
		} else // use gobal template
			tplId = nsName + idValue;

		var _method = data ? ("renderData('" + refId + "', " + data.value + ")") 
				: ("getTpl(" + (refId=="''"?"":refId) + ")");
		code += tplId + "." + _method + ",";
	}
	function getCodeStr(op, _prevTpls) {
		if (!op) return;
		switch(op.type){
		case "script":
			add_newline(op);
			lastTag = "script";
			code += op.text + _newline;
			break;
		case "tpl":	compileTplTag(op, _prevTpls);break;
		case "use":	compileUseTag(op);	break;
		case "text":compileTextTag(op);	break;
		case "note":
			code += op.text.replace(/.*/g, "");
			break;
		}
	}

	function getCodes(_options, _prevTpls) {
		for (var i = 0; i<_options.length ; i++)
			getCodeStr(_options[i], _prevTpls || []);
	}

	getCodes(parsedData);
	if (lastTag == "script")
		code = code.replace(/\n$/, "");
	exportsCode = exportsCode == _newline ? "" : exportsCode;
	return "(function () {" + code + exportsCode + "})();";
}
/**
 * @param parsedData : .js.html file data
 * @param transConfig : {
 *		newLine : "\n" || "\r\n"
 *		nsName : name space for gloal tpl class;
 * }
 */
function IXTplTranslate(parsedData, transConfig) {
    try {
        return { code: _ix_tpl__translate(parsedData, transConfig) };
    } catch (ex) {
        return { error: ex };
    }
}

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.translate = IXTplTranslate;
}