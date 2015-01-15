(function(){
function _log(){
	//function _ARR(iterable) {
	//	if (!iterable)
	//		return [];
	//	if (iterable.toArray)
	//		return iterable.toArray();
	//	var results = [];
	//	var len = iterable.length;
	//	for (var i = 0; i < len; i++)
	//		results.push(iterable[i]);
	//	return results;
	//}
	//var s = _ARR(arguments).join("");
	//window.console.log(s);
}

function isEmpty(str){
	return (str===undefined||str===null||str==="");		
}
var BaseTypes = {
	"object": Object,
	"function": Function,
	"string":String,
	"boolean":Boolean,
	"number": Number
};
function isTypeFn(type){
	var fn =function(obj){
		return (!isEmpty(obj) && (typeof(obj)==type || obj instanceof BaseTypes[type]));
	};
	return fn; 
};

var isString = isTypeFn("string");
var isNumber = isTypeFn("number");
var isFn = isTypeFn("function");

var _ix_idx = 0;
function IXid(){
	_ix_idx ++;
	return "ix"+_ix_idx;
}

function _iterate(arr, fn){
	if (!arr || arr.length == 0)
		return;
	for (var i=0; i<arr.length; i++)
		fn(arr[i], i);
}

function classAncestor(_el, clz){
	var el = _el.parentNode;
	while(el){
		var nodeName = el.nodeName.toLowerCase();
		if (nodeName=="div" && el.className.indexOf("wrap_div")>=0)
			break;
		el =(nodeName=="body")? null: el.parentNode;
	}
	return el;

}
function tableAncestor(_el){
	var el = _el.parentNode;
	while(el){
		var nodeName = el.nodeName.toLowerCase();
		if (nodeName=="table")
			break;
		el =(nodeName=="body")? null: el.parentNode;
	}
	return el;
}
function createDiv(id,clz, doc){
	var _doc = doc || document;
	var node = _doc.createElement('div');
	if (!isEmpty(clz))
		node.className = clz;
	node.id = id;
	_doc.body.appendChild(node);
	return node;
}
function $X(domEl, doc){
	var _doc = doc || document;
	if (isEmpty(domEl))
		return null;
	if (isString(domEl) || isNumber(domEl))
		return  _doc.getElementById(domEl);
	if ("ownerDocument" in domEl)
		return domEl;
	return null;
}
function $XC(clz, doc){
	var _doc = doc || document;
	if (isEmpty(clz))
		return null;
	var els = _doc.getElementsByClassName(clz);
	return  els.length>0?els[0]:null;
}

//   >>>>>>>>>>>>>can be replaced in JAVA
var StylePattern = /<\s*\/?\s*style\s*.*?>/ig;
var LStylePattern = /<\s*style\s*.*?>/ig;
var RStylePattern = /<\s*\/\s*style\s*.*?>/ig;

var BodyPattern = /<\s*\/?\s*body\s*.*?>/ig;
var LBodyPattern = /<\s*body\s*.*?>/ig;
var RBodyPattern = /<\s*\/\s*body\s*.*?>/ig;

var ScriptPattern = /<\s*\/?\s*script\s*.*?>/ig;
var LScriptPattern = /<\s*script\s*.*?>/ig;
var RScriptPattern = /<\s*\/\s*script\s*.*?>/ig;

var regSplit = function(str, reg){
	var _splitArr = [], _matchArr = str.match(reg), _len = _matchArr ? _matchArr.length : 0;
	for(var i = 0;i < _len;i++){
		var _arr = _matchArr[i], _idx = str.indexOf(_arr);
		if(_idx == -1)
			continue;
		_splitArr.push(str.substring(0,_idx));
		str = str.substring(_idx + _arr.length);
	}
	_splitArr.push(str);
	return {separate : _splitArr, arr : _matchArr};
};

function splitByTag(html, spreg, lreg, rreg){
	var sps = regSplit(html, spreg);
	var arr =sps.arr, strs = sps.separate;
	if (!arr)
		return {
			content :"",
			other :html
		};

	var i = 0;
	var bodys = [], others = []; 
	others.push(strs[0]);
	while(i<arr.length-1){
		var v1 = lreg.test(arr[i]); // !!! Must coding like this since regex.test(s) work abnormally
		var v2 = rreg.test(arr[i+1]);
		if (v1 && v2){
			bodys.push(strs[i+1]);
			others.push(strs[i+2]);
			i += 2;
		} else
			i += 1;
	}
	return {
		content : bodys.join(""),
		other : others.join("")
	};
}


function filterHTML(html){
	var sps = splitByTag(html, StylePattern, LStylePattern, RStylePattern);
	var styles = sps.content.length>0? ('<style type="text/css">' + sps.content + '</style>') : "";
	sps = splitByTag(sps.other, ScriptPattern, LScriptPattern, RScriptPattern);
	var bodyContent = sps.other; 
	sps = regSplit(bodyContent, BodyPattern);
	if (!sps.arr)
		return styles + bodyContent;
	sps = splitByTag(bodyContent, BodyPattern, LBodyPattern, RBodyPattern);
	return  styles + sps.content;
}
//  <<<<<<<<<<<<<<<< can be replaced in JAVA

var scaleIds = [];
function doScale(el, rate){
	el.style.MozTransform = "scale(" + rate + ")";
	el.style.webkitTransform = "scale(" + rate + ")";
}

function rescaleElement(el){
	var pEl = el.parentNode;
	pEl.style.width = "auto";
	pEl.style.height = "auto";
	doScale(el, 1);
}

function scaleElement(el, maxW){
	var pEl = el.parentNode;
	var offW = el.offsetWidth, offH = el.offsetHeight;
	var rate = 1;
	try{
		rate = (maxW - el.offsetLeft) / offW;
	}catch(ex){
		window.console.err("abnormal rate:" + maxW, el);
	}
	if (isNaN(rate) || rate<=0)
		rate = 1;
	
	pEl.style.width = (maxW - el.offsetLeft)  +"px";
	pEl.style.height = (el.offsetHeight * rate ) + "px";

	doScale(el, rate);
}
function wrapElement2Scale(el){
	var yid = el.getAttribute("_yid_");
	if (!yid){
		yid = IXid();
		scaleIds.push(yid);
		el.setAttribute("_yid_", yid);
		el.className = el.className + " " + yid + "_body wrap_body";
		//_log("new wrapper " + yid);
	}
	var pEl = el.parentNode;
	if (pEl.id != yid + "_wrapper") {
		var _el = createDiv(yid + "_wrapper", "wrap_div", frameDoc);
		pEl.insertBefore(_el, el);
		_el.appendChild(el);
		pEl = _el;
	}
	return yid;
}
function scaleImgElement(imgEl, maxW){
	if (imgEl.offsetLeft + imgEl.offsetWidth< maxW)
		return;
	if (imgEl.width >= imgEl.offsetWidth)
		scaleElement(imgEl, maxW);
}

function resizeElement(el, maxW){
	var nodeName = el.nodeName.toLowerCase();
	if (nodeName.charAt(0) == '#' || nodeName == "a" || nodeName == "br" || nodeName == "style" || nodeName == "img")
		return true;
	//_log(nodeName + ":" + el.offsetLeft + " + " + el.offsetWidth + "," + el.offsetHeight + "::" + el.width);
	if (el.offsetLeft + el.offsetWidth< maxW)
		return true;
	if (el.width >= el.offsetWidth) {
		var _el = el;
		if (nodeName=="td" || nodeName == "tr" || nodeName == "tbody" || nodeName == "th")
			_el = tableAncestor(_el);
		
		wrapElement2Scale(_el);
		scaleElement(_el, maxW);
		return true;
	}
	return false;
}

// may cause too deep stack and overflow;
// function resizeChildElements(el, maxW){	
// 	var childEl = el.firstChild, nextEl = null;	
// 	while(childEl){
// 		nextEl = childEl.nextSibling;
// 		if (!resizeElement(childEl, maxW))
// 			resizeChildElements(childEl, maxW);		
// 		childEl= nextEl;
// 	}
// }

function getNextElement(rootEl, el){
	var _el = el, nextEl = null;
	while(_el && _el != rootEl){
		nextEl = _el.nextSibling;
		if (nextEl)
			break;
		_el = _el.parentNode;
	}
	return nextEl;
}
function resizeChildElements(el, maxW){	
	var childEl = el.firstChild;	
	while(childEl){		
		if (!resizeElement(childEl, maxW))
			childEl = childEl.firstChild;
		else
			childEl= getNextElement(el, childEl);
	}
}
/////////////////////////////////////////////////////////////////
var HtmlTemplate = [
"<html><head><style>",
"body{overflow:hidden;margin:0;border:0;padding:0;}",
".wrap_div{margin:0;border:0;padding:0;overflow:hidden;display:inline-block;}",
".wrap_body{-webkit-transform-origin-x:0;-webkit-transform-origin-y:0;}",
"</style></head><body></body></html>"].join("");
var frameWin = null, frameDoc = null, frameBody = null, viewEl = null;

var inCalculating = false, toReCalculate = false;
function _calc(preFn){
	toReCalculate = false;
	inCalculating = true;

	var maxW = frameBody.offsetWidth;
	if (maxW == frameBody.getAttribute("_width_")) {
		inCalculating = false;
		return;
	}
	frameBody.setAttribute("_width_", maxW);

	preFn && preFn();
	resizeChildElements(frameBody, maxW);
	_iterate(imgYids, function(yid){
		var  imgEl = $XC(yid + "_body", frameDoc);
		if (!imgEl)
			return;
		var el = classAncestor(imgEl.parentNode, "wrap_div");
		if (!el)
			scaleImgElement(imgEl, maxW);
	});
	var frameHTML = frameBody.innerHTML;
	viewEl.innerHTML = frameHTML;
	window.infobox.updateEntosRenderAreaSize(viewEl.offsetWidth, viewEl.offsetHeight);
	inCalculating = false;
}

function calc () {
	var curtime = new Date();
	//_log("start clean:" + curtime);
	_calc();
	//_log("end clean; cost ", (new Date()).getTime() - curtime.getTime(), "ms");
}

function reCalc() {
	if (inCalculating){
		toReCalculate = true;
		return;
	}

	var curtime = (new Date()).getTime();
	//_log("start clean:" + curtime);	
	_calc(function(){
		_iterate(scaleIds, function(yid){rescaleElement($XC(yid + "_body", frameDoc));});
	});
	//_log("end clean; cost ", (new Date()).getTime() - curtime, "ms");
}


var imgYids = [];
var loadedImgYids =  {};
function _checkAllImagesLoaded(fn){
	for (var i=0; i<imgYids.length; i++){
		if (imgYids[i] in loadedImgYids)
			continue;
		return setTimeout(function(){
			_checkAllImagesLoaded(fn);
		}, 200);
	}
	fn();
}
function renderFrame(html){
	var frameHTML = filterHTML(html);
	frameBody.innerHTML = frameHTML;
	//If loading images cost too long time, open this sentence; //viewEl.innerHTML = frameHTML;
	_iterate(frameDoc.images, function(imgEl){
		if (imgEl.width == 0 || imgEl.height == 0)
			return;
		var yid = wrapElement2Scale(imgEl);
		imgYids.push(yid);
		_log("img onload", imgEl);
		imgEl.onload = function(){
			_log("img scale", imgEl);
			loadedImgYids[yid] = true;
		};
		imgEl.onerror = function(){
			_log("img error", imgEl);
			loadedImgYids[yid] = true;
		};
	});
	_checkAllImagesLoaded(function(){
		calc();
		window.onresize = reCalc;
	});
}

window.Y =  {};
Y.onload = function(){
	viewEl = $X('w0');
	frameWin = $X('c1').contentWindow;
	frameDoc = frameWin.document;
	frameDoc.write(HtmlTemplate);
	frameBody = frameDoc.body;

	renderFrame(window.infobox.loadEntosRenderData());
};

})();