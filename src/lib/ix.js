/*
 * IX project 
 * https://github.com/lance-amethyst/IX
 * Distrib No : 20150722T141637Z041
 *
 * Copyright (c) 2015 Lance GE, contributors
 * Licensed under the MIT license.
 */
/*
 * IX Distribution for Browsers.
 */
(function(){
/**  
 * IX constant can be access anywhere;
 * 		IX_GLOBAL
 * 		IX_VERSION
 *	 	IX_DEBUG_MODE
 *		IX_DOM_MODE
 * 		IX_SCRIPT_NAME
 */
var isInDom = false;
try {
	isInDom = window && ("navigator" in window);
}catch(ex){}
var ixGlobal = isInDom?window: global;

IX_GLOBAL = ixGlobal;
IX_GLOBAL.IX_DOM_MODE = isInDom;

IX_GLOBAL.IX_VERSION = "1.0";
IX_GLOBAL.IX_DEBUG_MODE = false;

IX_GLOBAL.IX_SCRIPT_NAME = "ix.js";

var ixGlobalName = (isInDom ? "window" : "global");

function isEmptyFn(str){return (str===undefined||str===null||str==="");}
function isUndefined(obj){return typeof(obj) === 'undefined';}
function isValidString(obj){return typeof(obj) === 'string' && obj!=="";}
function isGlobalNS(obj, name){return (obj == ixGlobal) && (name == ixGlobalName);}

/**  
 * IXDebug is utilities to decide what information should display in runtime. It includes: {
	isAllow(name) :  check if name related information should be printed.
	clear() :
	reset(list) :  reset the allowed information's regex
 * }
 */
var debugCacheList = [];
IX_GLOBAL.IXDebug = {
	isAllow : function(name) {
		if (!IX_DEBUG_MODE)
			return false;
		var l = debugCacheList.length;
		for ( var i = 0; i < l; i++){
			if(debugCacheList[i] === "all" || new RegExp(debugCacheList[i], "i").test(name))
				return true;
		}
		return false;
	}, 
	clear : function() {debugCacheList = [];},
	reset : function(list) {debugCacheList = list;}
};
IX_GLOBAL.debugIsAllow = IXDebug.isAllow;

/**  Shortcut provided in this file:
 *  
$XA(iterObj) = IX.cvtToArray.	
$XP(obj, pname, defV) = IX.getProperty. 
 * 	For example: var myId = $XP(config, "id", 123)
 * 		assign config.id to myId, or assign 123 to myId if config has no property named as "id". 
$XF(obj, fname) = IX.getPropertyAsFunction. 
 * 	For example: var closeFn = $XF(config, "close")
 * 		assign config.close to closeFn, or assign IX.emptyFn to closeFn if config has no function 
 * 		named as "close". 
 */
/**
 * Base utilities for IX project. All can be called as IX.xxxx(...) anywhere: {
 * 
 * Type utilities:
 	isEmpty(obj) : return if obj is undefined, null or empty string.
 	isUndefined(obj) : return if obj is undefined
 	isBoolean(obj): return if obj is an instance of Boolean.
 	isObject(obj) : return if obj is an instance of object, not include null object.
 	isString(obj) : return if obj is an instance of string, not include empty string "".
 	isNumber(obj): return if obj is an instance of Number.
 	isFn(obj) : return if obj is an instance of function.
 	isStaticType(obj) : return if obj is an instance of static type such as: 
 		non-object/null/Number/Function/String/Date/Boolean/RegExp
 	isArray(obj) : return if obj is an instance of Array.
 	getClass(obj) : return obj class name if it's created by new XX(...)
 *
 * Array utilities :
 	cvtToArray(obj) : return an array from converted obj if possible, otherwise return []
 *
 * Namespace utilities:
  	ns(nsname): make sure nsname existed in current window/global. If not, create it as {}. 
 	nsExisted(nsname) : return if nsname is existed in current window/global.
 	getNS(nsname): return the object identified by nsname if existed in current window/global. 
 		Otherwise, return undefined.
 	setNS(nsname, obj) : set nsname in window/global as obj. If not existed, create it as obj.
 *
 * Properties utilities: 
 *  @pname  can be "a.b.c" to check obj.a.b.c, but value "a..c" are forbidden
 	hasProperty(obj, pname) : return if obj has property as pname 
 	setProperty(obj, pname, value) 
 	getProperty(obj, pname, defV) : if obj has a property named as pname, return its value 
 		no matter if it is null or empty; otherwise return the defV; 
 	getPropertyAsFunction(obj, fname) : similar with getProperty; if no such function, return IX.emptyFn
 	clone(obj) : return a duplicate object but totally different with obj although the value is same.
 		(Attention: obj should not be recursive references);
 	deepCompare(src, dest) : return if same between src and dest deeply to leaf property;
 * 
 * Loop/Iterate utilities:
 	iterate(arr, iterFn) : iterate to call iterFn for every elements in arr by sequence.
 		iterFn is a function to accept such object and index of object in arr. it can be defined 
 		as function(item, indexOfItemInArray)
 	fnIterate(arr, fname) : similar with iterate function, but no need to provide function.
		fname is a string which each element in arr will execute its function named by pname.
	iterbreak(arr, iterfn) : similar with iterate function but can be broken by thrown exception 
 		from iterFn
 	loop(arr, acc, iterFn) : iterate to do accumulation for every elements in arr by sequence.
 		iterFn can be defined as function(oldAccumulator, item, indexOfItemInArray), its task is
 		deal with the item and the oldAccumulator and return the newAccumulator to help loop 
 		function to get the result of accumulation.
 	loopDsc(arr, acc, iterFn) : similar with loop function but the sequence is from last to first.
 	loopbreak(arr, iterFn) :  similar with loop function but can be broken by thrown exception 
 		from iterFn.
  	partLoop(arr, startIndex, endIndex, acc, iterFn) :  similar with loop function but only deal with 
 		elements from startIndex to endIndex(not include endIndex). If the startIndex or endIndex is 
 		over-ranged, pick the proper index to replace. 
 	map(arr, mapFn) : return the new object which is mapped from arr's every element by mapFn.
 	each(obj, acc, iterFn) : deal with all properties for object and return the accumulated result.
 		iterFn can be defined as function(oldAccumulator, propertyValue, propertyName, indexOfPropertyInObject), 
 *
 * Execution utilities:
 	getTimeInMS() : get current time in ms ticks.
 	getTimeStrInMS() : get current time in yyyymmddThhmmssZnnn format.
 	emptyFn() : just a function shell but do nothing.
 	selfFn(obj) : return obj only.
 	safeExec(fn) : execute fn and catch any exception throw in execution exclude its.
 	execute(fname, args) : find the function which namespace is fname and execute it with given 
 		arguments which is array.
 	checkReady(condFn, execFn, period, options) : check to run execFn if condFn return true every 
 		period MS. options has 2 properties : maxAge and expire, and it can be ignored.
 	tryFn(fn): try to execute the given fn. If fn is not function, do nothing.
 *
 * Math utilities:
 	inRange(x, x1, x2) : return if x in range of (x1, x2);
 	ifLineIntersect(line1, line2) : return if line1 and line2 intersect
 	ifRectIntersect(rect1, rect2) : return if rect1 and rect2 intersect
 *	
 * Extent/inherit utilities :
 	extend(dst, src): copy or cover all properties from src to dst if existed in dst. 
 		After copying, return new dst. src will not be changed but dst may be changed.
 	inherit(src, ...): create a new object, copy all properties from each src by sequence.
 		After copying, return new object. Each src will not be changed.
 *
 * Error/Log utilities :
 	err(msg):
 	log(msg):
 *
 * Misc : 
 	id() :  return the unique id string;
 * }
 * 
 * 
 * Extend String.prototype with {
 * 	camelize() 
	capitalize()
	replaceAll(os, ns)
	loopReplace(varr)
		
	trim(),
	stripTags()
	stripScripts()
	stripFormTag()
	strip()
	substrByLength(len)
	isSpaces()

	isPassword()
	isEmail()
	
	trunc(len)
	tail(len)

	dehtml()
	enhtml()

	multi(len)
	
	pickUrls
	replaceUrls(_r, _f)
	regSplit(reg)	
	pick4Replace()
	replaceByParams(data)
	toSafe()
 * }
 *  
 * Add/Reset Function.prototype.bind 	
 */
IX_GLOBAL.IX = (function(){
var currentVersion = IX_VERSION;

function emptyFn(){/**Empty Fn*/}
function selfFn(o){return o;}

function getTimeInMS() {return (new Date()).getTime();}
function num2Str(n, m){m = m || 2;return ("0".multi(m) + n).slice(0-m);}
function getTimeStrInMS() {
	var d = new Date();
	return [d.getFullYear(), num2Str(d.getMonth()+1), num2Str(d.getDate()), 
	        "T", num2Str(d.getHours()), num2Str(d.getMinutes()), num2Str(d.getSeconds()), 
	        "Z", num2Str(d.getMilliseconds(), 3)].join("");
}

//Type utilities definitions
var BaseTypes = {
	"object": Object,
	"function": Function,
	"string":String,
	"boolean":Boolean,
	"number": Number
};
function isTypeFn(type){
	return function(obj){
		return (obj !== null && (typeof(obj)==type || obj instanceof BaseTypes[type]));
	};
}
function isStaticType(obj){
	return (obj === null || (typeof(obj) !== 'object') ||
			(obj instanceof String) || (obj instanceof Number) || (obj instanceof Boolean) ||
			(obj instanceof Date) || (obj instanceof RegExp)) ;
}
var typeUtils = {
	isEmpty : isEmptyFn,
	isUndefined : isUndefined,
	isBoolean : isTypeFn("boolean"),
	isObject : isTypeFn("object"),
	isString : isTypeFn("string"),
	isNumber : isTypeFn("number"),
	isFn : isTypeFn("function"),
	isStaticType : isStaticType,
	isArray : function(obj) {return (!!obj && obj instanceof Array);},
	getClass : function (obj) { return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];}
};

// Array utilities definitions:
var arrUtils = {
	cvtToArray : function (iterable) {
		if (!iterable)
			return [];
		if (iterable.toArray)
			return iterable.toArray();
		var results = [];
		var len = iterable.length;
		for (var i = 0; i < len; i++)
			results.push(iterable[i]);
	    return results;
	}
};

//Namespace and Property Utilities definitions;
function cloneFn(obj) {
	// "Static" types.
	if (isUndefined(obj) || isStaticType(obj)) 
		return obj;
	var clonedObj = null;
	// Array.
	if (typeUtils.isArray(obj)) {
		clonedObj = [];
		for (var i = 0; i < obj.length; i++)
			clonedObj[i] = cloneFn(obj[i]);
		return clonedObj;
	}
	// Objects.
	clonedObj = new obj.constructor();
	for (var pname in obj)
		clonedObj[pname] = cloneFn(obj[pname]);
	return clonedObj;
}
function deepCompare(src, dest) {
	if (isEmptyFn(src) || isEmptyFn(dest))
		return src === dest;
	if (src == dest)
		return true;
	var typeDest = typeof(dest), typeSrc = typeof(src);
	if (typeDest != typeSrc)
		return false;
	if (typeDest === 'undefined')
		return true;
	if (typeDest === 'function')
		return src.toString() != dest.toString();
	if (typeDest !== 'object')
		return src == dest;

	var pname = null;
	for (pname in src) {
		if (!deepCompare(src[pname], dest[pname]))
			return false;
	}
	for (pname in dest) {
		if (!(pname in src) && !isUndefined(dest[pname]))
			return false;
	}
	return true;
}

function _nsCheck(name, obj){
	if (isUndefined(obj[name])) obj[name] = {};
	return true;
}
function _nsAssign(name, obj){
	if (isUndefined(obj[name])) obj[name] = {};
	return obj[name];
}
function _nsExisted(name, obj){ return !isUndefined(obj[name]);}
function _nsGet(name, obj){return isUndefined(obj[name]) ? undefined : obj[name];}

//Careful if used : names should be array with strings, both array and strings should not be empty;
function __objLoop(obj, names, fn){ 
	if (isGlobalNS(obj, names[0])) names.shift();
	var nsObj = obj, flag = true, i=0, len = names.length; 
	while(i<len && flag && nsObj){
		var curname = names[i];
		if (curname === "") {
			console.error("invalid NS name:" + names.join("."));
			return undefined;
		}
		flag = fn(curname, nsObj);
		if(flag)
			nsObj = nsObj[curname];
		i++;
	}
	return flag;
}
function objLoopFn(obj, nsname, fn){
	return (obj && isValidString(nsname)) ? __objLoop(obj, nsname.split("."), fn) : undefined;
}
function assignToObjFn(obj, nsname, value){
	if (!isValidString(nsname) || isGlobalNS(obj, nsname))
		return;
	var names = nsname.split(".");
	var lastName = names.pop();
	var nsObj = names.length === 0? obj : __objLoop(obj, names, _nsAssign);
	if (nsObj)
		nsObj[lastName] = value;
}

var nsUtils = {
	ns : function(nsname){objLoopFn(ixGlobal, nsname, _nsCheck);},
	nsExisted : function(nsname){return objLoopFn(ixGlobal, nsname, _nsExisted);},
	getNS : function(nsname){return objLoopFn(ixGlobal, nsname, _nsGet);},
	setNS : function(nsname, value){assignToObjFn(ixGlobal, nsname, value);}
};

var propertyUtils = {
	hasProperty : function(obj, pname){return objLoopFn(obj, pname, _nsExisted);},
	getProperty : function(obj, pname, defV){
		var v = objLoopFn(obj, pname, _nsGet);
		return isUndefined(v) ? defV : v;
	},
	setProperty : function(obj, pname, v){assignToObjFn(obj, pname, v);},
	getPropertyAsFunction:function(obj, fname){
		var fn = objLoopFn(obj, fname, _nsGet);
		return typeUtils.isFn(fn) ? fn : emptyFn;
	},
	clone :cloneFn,
	deepCompare: deepCompare
};

// Loop/Iterate Utilities definitions :
function loopFn(varr, sIdx, eIdx, acc0, fun, isAscLoop) {
	if (!varr || varr.length===0)
		return acc0;
	var len=varr.length;
	eIdx = (eIdx===-1)?len: eIdx;
	if (sIdx>=eIdx)
		return acc0;
	
	var acc = acc0, min = Math.max(0, sIdx), max = Math.min(len, eIdx);
	var xlen = len -1;
	for (var i=0; i<=xlen; i++) {
		var idx = isAscLoop?i:(xlen-i);
		if (idx>=min && idx<max && (idx in varr))
			acc = fun(acc, varr[idx], idx);
	}
	return acc;
}
var iterateFn = function(arr, fun){
	if (isEmptyFn(arr))
		return;
	var len = arr.length;
	for (var i=0; i<len; i+=1)			
		fun(arr[i], i);
};
var loopUtils = {
	iterate: iterateFn,
	fnIterate :function(arr, fname){
		iterateFn(arr, function(item){
			var fn = item && item[fname];
			if (fn && typeUtils.isFn(fn))
				fn();
		});
	},
	iterbreak: function(varr, fun){
		try{
			iterateFn(varr, fun);
		}catch(_ex){}
	},
	loop:function(varr, acc0, fun){return loopFn(varr, 0, -1, acc0, fun, true);},
	loopDsc:function(varr, acc0, fun){return loopFn(varr,0, -1, acc0, fun, false);},
	loopbreak: function(varr, fun){
		try{
			loopFn(varr, 0, -1, 0, fun, true);
		}catch(_ex){}
	},
	partLoop:function(varr,sIdx,eIdx, acc0, fun){
		return loopFn(varr, sIdx, eIdx, acc0, fun, true);
	},
	
	map : function(arr, fun){
		return loopFn(arr, 0, -1, [], function(acc, item, idx){
			acc.push(fun(item, idx));
			return acc;
		}, true);
	},
	each:function(obj, acc0, fun){
		var acc = acc0, p="", idx = 0;
		if (obj)
		for (p in obj){
			acc = fun(acc, obj[p], p, idx);
			idx+=1;
		}
		return acc;
	}
};

//Execution Utilities definitions;
/**
 *  _config :{
 *     maxAge : timeInMSec, default no limit;
 *     expire:
 *  } 
 */
function checkReadyFn(condFn, execFn, period, _config){		
	var _period = Math.max(20, period || 100);
	var maxAge = $XP(_config, "maxAge", null), expireFn = $XF(_config, "expire"), startTick = null;
	if (isNaN(maxAge))
		maxAge = null;
	if (maxAge !== null)
		startTick = getTimeInMS();
	function _checkFn(){			
		if (condFn())
			execFn();
		else if (maxAge!==null && (getTimeInMS()-startTick)>maxAge)
			expireFn();
		else
			setTimeout(_checkFn, _period);
	}
	_checkFn();
}
var execUtils = {
	getTimeInMS : getTimeInMS,
	getTimeStrInMS : getTimeStrInMS,
	emptyFn : emptyFn,
	selfFn: selfFn,
	safeExec : function(fn){
		try {
			fn();
		}catch(e){
		//	console.error(IX.Test.listProp(e));
		}
	},
	execute : function(fname, args) {
		var fn = nsUtils.getNS(fname);
		if (typeUtils.isFn(fn))
			fn.apply(null, args);
	},
	checkReady : checkReadyFn, 
	tryFn : function(fn){return (typeUtils.isFn(fn)? fn: emptyFn)();}
};


// Other Utilities definitions;
function ifLineIntersect(line1, line2){return (line2.min-line1.max) * (line2.max-line1.min) < 0;}
function ifRectIntersect(rect1, rect2){
	return ifLineIntersect({min : rect1.minx, max: rect1.maxx}, {min : rect2.minx, max: rect2.maxx}) &&
		ifLineIntersect({min : rect1.miny, max: rect1.maxy}, {min : rect2.miny, max: rect2.maxy});
}
var mathUtils = {
	inRange : function(x, x1, x2){return (x-x1)*(x-x2)<=0;},
	ifLineIntersect : ifLineIntersect,
	ifRectIntersect: ifRectIntersect
};

//Extend/Inherit Utilities definitions;
var extendFn = function(dst, src) {
	if (dst===null || dst===undefined)
		dst = {};
	for (var pname in src)
		dst[pname] = src[pname];
	return dst;
};
var extendUtils = {
	// obj = IX.extend(dst, src);
	// obj will has all members in both dst and src, 
	// in same time, dst will has all members in src. 
	extend: extendFn,
	// obj = IX.inherit(src1, src2, src3,...);
	// obj will has all members in all src*, 
	// and all src* will not be changed. 
	inherit : function(){
		return loopUtils.loop(arrUtils.cvtToArray(arguments), {}, extendFn);
	}
};

function _log(type, msg){
	var dstr = getTimeStrInMS();
	console[type==="ERR"? "error" : "log"](dstr + " : " + msg);
}
var errUtils = {
	err : function(errmsg){
		_log("ERR", errmsg);
		if (IX_DEBUG_MODE && IX.isFn(IX_GLOBAL.alert)){
			IX_GLOBAL.alert(errmsg);
		}
	},
	log : function(msg){if (IX_DEBUG_MODE) _log("LOG", msg);}
};

var ix_id_idx = 0;
return extendUtils.inherit(typeUtils, arrUtils, propertyUtils, nsUtils, loopUtils, 
		extendUtils, execUtils, mathUtils, errUtils, {
	id : function(){
		ix_id_idx ++;
		return "ix" + ix_id_idx;
	}
});
})();

IX_GLOBAL.$XA = IX.cvtToArray;
IX_GLOBAL.$XE = IX.err;
IX_GLOBAL.$XP = IX.getProperty;
IX_GLOBAL.$XF = IX.getPropertyAsFunction;

/**
 * 	Extends String.prototype for some tool kits. 
 */

function regSplit(str, reg){
	var _splitArr = [], _matchArr = str.match(reg), _len = _matchArr ? _matchArr.length : 0;
	for(var i = 0;i < _len;i++){
		var _arr = _matchArr[i], _idx = str.indexOf(_arr);
		if(_idx === -1)
			continue;
		_splitArr.push(str.substring(0,_idx));
		str = str.substring(_idx + _arr.length);
	}
	_splitArr.push(str);
	return {separate : _splitArr, arr : _matchArr};
}
function substrByLength(str, maxLength){
	var stringArr = [], matchPRC_regx = /[^\u0020-\u007A]/g, strLen = str.length,
		simpleCharLen = (str.match(/[\u0020-\u007A]/g) || []).length,
		subStringByMaxLength = str.substring(0, maxLength);
	
	if((subStringByMaxLength.match(matchPRC_regx) || []).length>0){
		var count = 0;
		for(var i = 0;i < maxLength;i++){
			var key = str[i];
			if(key === undefined || count >= maxLength){
				if (i < maxLength - 1 && i < strLen)
					stringArr.push("...");
				break;
			}
			count += key.match(matchPRC_regx) ? 2 : 1;
			stringArr.push(key);
		}
	}else
		stringArr.push(subStringByMaxLength);
	
	return {
		reString : stringArr.join(""),
		reLength : strLen > maxLength ? maxLength : strLen,
		stringLength : (strLen - simpleCharLen) * 2 + simpleCharLen
	};
}
var UrlRegEx = /http(s)?:\/\/[\w.]+[^\s]*/g;
var EmailPattern = /^[_a-zA-Z0-9.]+[\-_a-zA-Z0-9.]*@(?:[_a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,4}$/;
var ScriptPattern = new RegExp( '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)', 'img');
var FormPattern = new RegExp( '(?:<form.*?>)|(?:<\/form>)', 'img'); 
var TrimPattern = /(^\s*)|\r/g;
var ReplaceKeyPattern = /{[^{}]*}/g;

IX.extend(String.prototype, {
	camelize: function(){ return this.replace(/\-(\w)/ig, function(B, A) {return A.toUpperCase();}); },
	capitalize: function(){ return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase(); },
	replaceAll:function(os, ns){return this.replace(new RegExp(os,"gm"),ns);},
	loopReplace:function(varr){return IX.loop(varr, this, function(acc, item){
		return acc.replaceAll(item[0], item[1]);
	});},
		
	trim:function(){
		var str = this.replace(TrimPattern, ""), end = str.length-1, ws = /\s/;
		while(ws.test(str.charAt(end)))	end --;
		return str.substring(0, end+1);
	},
	stripTags:function() {return this.replace(/<\/?[^>]+>/gi, '');},
	stripScripts: function() {return this.replace(ScriptPattern, '');},
	stripFormTag:function(){return this.replace(FormPattern, '');},
	strip:function() {return this.replace(/^\s+/, '').replace(/\s+$/, '');},
	substrByLength : function(len){ return substrByLength(this.toString(), len); },
	isSpaces:function() {return (this.replace(/(\n)|(\r)|(\t)/g, "").strip().length===0);},

	isPassword : function(){
		var pwd =  this.trim();
		return pwd.length === this.length && this.length > 5 && this.length < 21;
	},
	isEmail : function(){
		var email = this.trim();
		return IX.isEmpty(email) || EmailPattern.exec(email);
	},
	
	trunc:function(len){return (this.length>len)?(this.substring(0, len-3)+"..."):this;},
	tail:function(len){return (this.length>len)?(this.substring(this.length-len)):this;},

	dehtml:function(){return this.loopReplace([["&", "&amp;"], ["<", "&lt;"],['"', "&quot;"]]);},
	enhtml:function(){return this.loopReplace([["&lt;", "<"],["&quot;",'"'], ["&amp;", "&"]]);},

	multi:function(len){
		var s = "";
		for (var i =0; i<len; i++) s += this;
		return s;
	},
	
	pickUrls:function(){return this.match(UrlRegEx);},
	replaceUrls : function(_r, _f){return this.replace(_r || UrlRegEx, _f || function(a){return '<a href="'+ a + '" target="_blank">' + a + '</a>';});},
	regSplit : function(reg){return regSplit(this, reg);},
	
	pick4Replace : function(){return this.match(ReplaceKeyPattern);},
	replaceByParams : function(data) {
		return IX.loop(this.match(ReplaceKeyPattern), this, function(acc, item){
			var _key = item && item.length>2? item.slice(1,-1) : "";
			return IX.isEmpty(_key)?acc:acc.replaceAll(item, $XP(data, _key, ""));
		});
	},
	toSafe : function(){return this.replace(/\$/g, "&#36;");}
});

/**
 * 		Extends Function.prototype which function bind.
 */
Function.prototype.bind = function() {
	var __method = this, args = $XA(arguments), object = args.shift();
	return function() {return __method.apply(object, args.concat($XA(arguments)));};
};
})();
(function(){
/**
 * IX.Array is a supplement for Array.prototype. It includes: {
 	init(length, defaultValue): create a new Array that each element is set to defaultValue.
 	isFound(element, arrayObject, equalFn): return if element is in current arrayObject by equalFn.
 		For equalFn, should be defined as function(a,b) and return boolean value; 
   		if the caller don't provide the function and a has equal operator, use a.equal to compare.
   		otherwise, using default operator "==".
 	sort(arr, cmpFn) :  return new sorted array from sort 
	compact(arr, validFn):return an array object which remove invalid elements from arr by validFn.	 
	remove(arr, element, equalFn): return new array object which removed matched elements from arr.
	pushx(arr, item): return array object which arr append item as last element.
	flat(arr) : return new array which contain all leaf elements in arr.
	indexOf(arr, matchFn): return the index of first matched element. If no matched, return -1;
	splice(arr, startIndex, deleteCount, insertArrayObject): 
			delete "deleteCount" elements from startIndex in arr and insert insertArrayObject into 
	 		startIndex of arr after all, return the new array object.  
	toSet(arr, equalFn): return unduplicated array of arr filtered by equalFn.
	isSameSet(arr1, arr2, equalFn): return if arr1 is same set as arr2 no matter the order.
	merge2Set(arr1, arr2, equalFn) : return unduplicated array from arr1 and arr2
 * }
 */

function getEqualFn(equalFn){
	return IX.isFn(equalFn)?equalFn:function(a, b) {
		return (IX.isObject(a) &&("equal" in a) && IX.isFn(a.equal))?a.equal(b):(a==b);
	};
}
function indexOf(arr, matchFn) {
	if(!arr || arr.length===0)
		return -1;
	var len = arr.length;
	for (var i=0; i<len; i++)
		if (matchFn(arr[i])) return i;
	return -1;
}
function isFoundFn(elem, arr, equalFn){
	return 0 <= indexOf(arr, function(item){
		return equalFn(elem, item);
	});
}
function compact(arr, validFn) {
	var fn = IX.isFn(validFn) ? validFn : IX.selfFn;
	return IX.loop(arr, [], function(acc, item) {
		if (fn(item, acc))
			acc.push(item);
		return acc;
	});
}
function remove(arr, elem, equalFn){
	var fn = getEqualFn(equalFn);
	return compact(arr, function(item){
		return !fn(elem, item);
	});
}
function flat(arr) {
	return IX.isArray(arr)?IX.loop(arr, [], function(acc, item){
		return acc.concat(flat(item));
	}) : [arr];
}
function toSet(arr, equalFn) {
	var fn = getEqualFn(equalFn);
	return compact(arr, function(item, acc){return !isFoundFn(item, acc, fn);});
}

IX.Array = {
	init : function(len, defV){
		var arr = [];
		for (var i=0; i<len; i++)
			arr.push(IX.clone(defV));
		return arr;
	},
	isFound : function(elem, arr, equalFn){
		return isFoundFn(elem, arr, getEqualFn(equalFn));
	},
	sort : function(arr, cmpFn){
		return IX.map(arr, function(item){return item;}).sort(cmpFn);
	},
	compact: compact,
	remove: remove,
	pushx:function(arr, item){
		arr.push(item);
		return arr;
	},
	flat : flat,
	indexOf :indexOf,

	// exmaples:
	// arr= ["a", "b", "c", "d"]
	// (arr, 4) : return []
	// (arr, 3):  remove 1 elem: arr[3]; return ["a", "b", "c"];
	// (arr, 3, 4) : return []
	// (arr, 1, 2) : remove 2 elems: arr[1], arr[2]; return ["a", "d"];
	// (arr, 1, 2, ["g", "k", "l"]) : remove 2 elems: arr[1], arr[2] and add 3 elems; 
	//              return ["a", "g", "k", "l", "d"];
	// (arr, 1, 0, ["g", "k", "l"]) : remove 0 elems and add 3 elems; 
	//              return ["a", "g", "k", "l", "b", "c", "d"];
	splice: function(arr, start, deleteCount, insertArray){
		var count = isNaN(deleteCount)?1:deleteCount;
		var len = arr.length;
		if (start<0 || start>len || count<0 || (start+count)>len)
			return [];
		var iArr = insertArray?insertArray:[];
		return [].concat(arr.slice(0, start), iArr, arr.slice(start+count));
	},
		
	toSet : toSet,
	isSameSet:function(arr1, arr2, equalFn){
		if (arr1===null && arr2===null)
			return true;
		if (arr1===null || arr2===null)
			return false;
		var fn = getEqualFn(equalFn);
		var _arr1 = arr1, _arr2 = arr2;
		var elem = null, _isFound = false;
		function _validItem(item){
			var _isSame = fn(elem, item);
			_isFound = _isFound || _isSame;
			return !_isSame; // remove it;
		}
		while(_arr1.length>0 && _arr2.length>0){
			elem = _arr1[0];
			_isFound = false;
			_arr2 = compact(_arr2, _validItem);
			if (!_isFound)
				return false;
			_arr1 = remove(_arr1, elem, fn);
		}
		return _arr1.length === 0 && _arr2.length === 0;
	},
	merge2Set: function(arr1, arr2, equalFn){
		return toSet([].concat(arr1, arr2), equalFn);
	}
};
})();
(function(){
/**	
 * 	Utilities tool for async jobs
 * 	Date : 2013-9-5 
 *  Author : Lance, GE
 *  Interface :
   		IX.wait4(arr, function worker(item, cbFn), function done(err, results);
   		IX.parallel(name, function worker(cbFn)).on(name, function worker(cbFn)).exec(function done(errs, results))
   		IX.sequential(name, function worker(cbFn)).next(name, function worker(cbFn)).exec(function done(errs, results))
 *  Description:
  		wait4 : any key's worker failed will cause done(err);
  		parallel :done will execute only if all parallel worker finished;
		sequential : done will execute if any step worker failed;
 * 
 */

function checkDone(len, keys, results){
	if (keys.length<len)
		return false;
	for (var i=0;i<len; i++){
		if (!(keys[i] in results)) 
			return false;
	}
	return true;
}

function getLocalLog(type){
	var tips = "Condition." + type + "[" + IX.id() + "]:";
	return function _log(info){
		if (debugIsAllow("condition"))
			IX.log(tips + info);
	};
}

/**
 *  workFn: function(key,function(err, data))  		
 *  doneFn : function(err, result);  
 *  
 *  Example:
 *  	condition.wait4(["key1", "key2", ...],  function(key, cbFn, idx){ *  		
 *  		cbFn(error, result4key);
 *  	}, function(err, results){
 *  		//result : {key1 :result1, key2: result2, ...}
 *  	});
 */
IX.wait4 = function(keys, workFn, doneFn){
	var _mylog = getLocalLog("wait");
	var len = keys.length;
	var _results = {}, _keys = [], hasErr = false;
	 
	function workDone(name, err, result){
		if (err || hasErr){
			if (hasErr) return;
			hasErr = true;
			return doneFn(new Error(name+ ":" + err));
		}
		_results[name] = result;			
		if (checkDone(len, _keys, _results)){
			_mylog("done ---------------");
			doneFn(null, _results);
		}
	}	
	keys.forEach(function _worker(key, idx){		
		var name = IX.isString(key)?key : ("t" + idx);
		_keys.push(name);
		_mylog("do : ==============" + name);
		workFn(key, function(err, result){
			_mylog("done : ==============" + name);
			workDone(name, err, result);
		}, idx); 
	});
};

/**
 *  on: 
 *  	params :
 *  		name : 'ssdasd' 
 *  		fn: function(function(err, result))  		
 *  	return {on, exec};
 *  exec
 *  	param 
 *  		doneFn : function(err, result)
 *  
 *  Example:
 *  	condition.parallel("branch1", function(fn){
 *  		fn(err1, result1);
 *  	}).on("branch2", function(fn){
 *  		fn(err2, result2);
 *  	}).exec(function(err, result){
 *  		// err :  {branch1: err1, branch2: err2}
 *  		// result : {branch1: result1, branch2: result2}
 *  	});
 */
IX.parallel = function(_name, _fn){
	var _mylog = getLocalLog("parallel");
	var keys = [], fns = {}, errs = {}, results = {};

	function workDone(name, err, result, doneFn){
		errs[name] = err===null?null:(new Error(name+ ":" + err));
		results[name] = result;
		if (checkDone(keys.length, keys, results)){
			_mylog("done ---------------");
			doneFn(errs, results);
		}
	}
	function _exec(doneFn){keys.forEach(function(name){
		_mylog("do : ==============" + name);
		fns[name](function(err, result){
			_mylog("done: ==============" + name);
			workDone(name, err, result, doneFn);
		});
	});}
	function _on(name, fn){
		if (IX.isFn(fn)) {
			keys.push(name);
			fns[name] = fn;
		}
		return {
			on : _on,
			exec : _exec
		};
	}
	return _on(_name, _fn);
};

/**
 *  next: 
 *  	params :
 *  		name : 'ssdasd' 
 *  		fn: function(function(err, result))  		
 *  	return {next, exec};
 *  exec
 *  	param 
 *  		doneFn : function(err, result)
 *  
 *  Example:
 *  	condition.sequential("step1", function(fn){
 *  		fn(err1, result1);
 *  	}).next("step2", function(fn){
 *  		fn(err2, result2);
 *  	}).exec(function(err, result){
 *  		// err : {stepN : errN}
 *  		// result : {step1: result1, ...stepN-1: resultN-1}
 *  	});
 */

function sequential(_name, _fn){
	var _mylog = getLocalLog("sequential");
	var keys = [], fns = {}, errs = {}, results = {};

	function workDone(name, err, result, doneFn){
		if (err){
			errs[name] = new Error(name + ":" + err);
			return doneFn(errs, results);
		}
		results[name] = result;
		if (keys.length === 0) {
			_mylog("done ---------------");
			doneFn(null, results);
		} else
			doNext(doneFn);
	}
	function doNext(doneFn){
		var name = keys.shift(); 
		_mylog(" : ==============" + name);
		fns[name](function(err, result){
			_mylog("done : ==============" + name);
			workDone(name, err, result, doneFn);
		});
	}
	function _exec(doneFn){
		if (keys.length===0)
			return doneFn({}, {});
		doNext(doneFn);
	}
	function _next(name, fn){
		if (IX.isFn(fn)) {
			keys.push(name);
			fns[name] = fn;
		}
		return {
			next : _next,
			exec : _exec
		};
	}
	return _next(_name, _fn);
}
IX.sequential = sequential;
IX.sequentialSteps = function(steps){
	var cond = sequential("START!", function(fn){fn(null, true);});
	IX.iterate(steps, function(step){
		cond.next(step[0], function(fn){step[1](step[0], fn);});
	});
	return cond;
};
})();
(function(){
/**
 * IX.State is simple state-machine utilities:{
	toggle(origStat, newStat) : if newStat give, return newStat, otherwise return !origStat
 * }
 *
 * IX.IManager is a Class to deal with key/value safely. It provide:
 * @Methods :{
	isRegistered(key) : check if key exist;
	register(key, value) : set the key mapped to value
	unregister(key) : clear the key's value
	get(key) : get the value mapped by key,
	clear() : clear all key/value;
 * }
 *
 * IX.IList is a Class to deal with Array easily. It provide:
 * @Methods : {
	isEmpty() : check if list is empty
	isLast(k) : check if k is last element in list
	getList() : return whole list
	getSize() : return the length of list
	indexOf(key) : return the index of key in list
	remove(idx) : remove the element in list idx position
	tryRemove(key): try remove key from list if existed
	append(key) : remove existed key and append key to last position in list
	tryAdd(key) : append key only if it is inexisted in list
	insertBefore(key, dstKey) : remove key if existed and insert it before dstkey, or append it if dstKey not existed
	clear() : clean all list
 * }
 * 
 * IX.I1ToNManager is a Class to deal with special key/value which one key mapped to many values. It provide:
 * @Methods : {
  	@Methods(IX.IManager)
  	
	hasValue(key) : check if any value is mapped by key
	put(k, v) : map k to v
	remove(k, v) : unmap v by k
 * }
 * 
 * IX.IListManager will manage key/value store with ordered key list. It provide:
 * @Methods : {
  	@Methods(IX.IManager)
  	
  	register(key, value) : @Override append the key to the last of list 
	unregister(key) :  @Override remove the entry for key from store
	isEmpty() : check if store is empty
	getSize() : get the size of store
	hasKey(key) : check if key is in store
	isLastKey(key) : check if key is the last in store
	getKeys() : get all key in sequence in store
	getByKeys(keys) :  get all values mapped by keys
	getAll() : get all values in store
	iterate(fn) :  for each value, iterate to execure fn(value, key)
	getFirst() : get the first meaningful value

	append(key) :  only append key to store's key list, will not changed value
	insertBefore(key, dstKey) : only for key, same as IX.IList.insertBefore,
	remove(key) : same as unregister, remove entry and value by key.
	clear() : clear the store
 * }
 * 
 * IX.IPagedManager will manage key/value store with ordered key list in paged info.
 * params :
	newInstFn : function(item){return itemModel;} // to create model for item
	instHT : null or instance of IX.IListManager  // if null, will create HT of IListManager
	dataCaller : function({pageNo, pageSize}, cbFn({total, items: [item]})) // dynamic load data for paged data
 * @Methods : {
	get : function(id){return itemModel;},
	getFirst : function(){return firstItemModel;},
	// getSize : function(){return sizeInHT;},
	getTotal : function(){return total;},

	load : load(pageNo, pageSize, cbFn([itemModel]), lazyLoad)
	putData : function({total, items}, startPos),
	addItems : function(itemIds){} // only change total and clear page info;
	removeItems : function(itemIds){}, // remove itemModels in HT, change total and clear page info;
	// iterate : function(fn), // iterate all itemModels in HT,
	clear : function(){ids = [];} // clear page info;
 * }
 *
 * IX.formatDataStore is an utilities handle with JSON data , for example
 * if convert JSON like :
 *  {
  		type : "array"/"json", [option; default :"json"]
 *		1: for array:
  		fields :["name1", "name2", ...],
  		items:[ [value1, value2, ...], ...]
 * 		2: for json:
  		items : [{name1: value1, name2: value2},...]
 *  } to Array like :
 *  [{name1: value1, name2: value2},...]
 * 
 */
IX.State = {
	toggle :function(origStat, newStat){
		return (newStat===undefined)?!origStat : newStat;
	}
};

IX.IManager = function(){
	var _ht = {};
	return {
		isRegistered : function(name){
			return (name in _ht) && (_ht[name]);
		},
		register: function(name, obj) {
			_ht[name] = obj;
		},
		unregister : function(name){
			_ht[name] = null;
		},
		get: function(name){
			return (name in _ht)?_ht[name]: null;
		},
		clear : function() {
			_ht = {};
		}
	};
};

var _IXArrayIndexOf =  IX.Array.indexOf;
IX.IList = function(){
	var _keyList = [];

	function indexOfFn(key) {
		return key ? _IXArrayIndexOf(_keyList, function(item) {
			return item == key;
		}) : -1;
	}
	function removeFn(idx) {
		if (idx >= 0 && idx<_keyList.length)
			_keyList = _keyList.slice(0, idx).concat(_keyList.slice(idx+1));
	}
	function appendFn(key){
		if (!_keyList || _keyList.length === 0)
			_keyList = [key];
		else {
			var idx = indexOfFn(key);
			removeFn(idx);
			_keyList.push(key);
		}
	}
	function insertBefore(key, dstKey) {
		// find the dstKey, if not exist, append current key to the end of list.
		var dstIdx = indexOfFn(dstKey);
		if (dstIdx == -1) {
			appendFn(key);
			return;
		}
		// find the key, if current key is before dstKey, do nothing.
		var idx = indexOfFn(key);
		if (idx != -1 && dstIdx - idx == 1)
			return;
		// else remove the existed record and insert it before dstKey.
		if (idx >= 0) {
			removeFn(idx);
			dstIdx = indexOfFn(dstKey);
		}
		_keyList = _keyList.slice(0, dstIdx).concat([key], _keyList.slice(idx));
	}
	return {
		isEmpty :function(){return _keyList.length===0;},
		isLast : function(k){return _keyList.length>0 && k==_keyList[_keyList.length-1];},
		getList : function(){return _keyList;},
		getSize: function(){return _keyList.length;},
		indexOf : indexOfFn,
		remove : removeFn,
		tryRemove : function(key){removeFn(indexOfFn(key));},
		append : appendFn,
		tryAdd :function(key){
			if (!_keyList || _keyList.length === 0)
				_keyList = [key];
			else if (indexOfFn(key) <0)
				_keyList.push(key);
		},
		insertBefore : insertBefore,
		clear : function(){
			_keyList = [];
		}
	};
};
IX.I1ToNManager = function(eqFn) {
	var _eqFn = IX.isFn(eqFn)?eqFn : function(item, value){return item==value;};
	var _mgr = new IX.IManager();

	var hasEntryFn = function(key) {
		var list = _mgr.get(key);
		return list && list.length>0;
	};
	var indexOfFn = function(arr, value) {
		return _IXArrayIndexOf(arr, function(item){return _eqFn(item, value);});
	};

	return IX.inherit(_mgr, {
		hasValue :hasEntryFn,
		put : function(k, v) {
			if (!hasEntryFn(k)) {
				_mgr.register(k, [v]);
				return;
			}
			var list = _mgr.get(k);
			if (indexOfFn(list, v)==-1)
				_mgr.register(k, list.concat(v));
		},
		remove : function(k, v){
			var list = _mgr.get(k);
			var idx = indexOfFn(list, v);
			if (idx >= 0)
				_mgr.register(k, IX.Array.splice(list, idx));
		}
	});
};
IX.IListManager = function() {
	var _super = new IX.IManager();
	var _list = new IX.IList();

	var registerFn = function(key, obj) {
		_super.register(key, obj);
		var idx = _list.indexOf(key);
		if (obj) {
			if (idx == -1)
				_list.append(key);
		} else 
			_list.remove(idx);
	};
	var listFn = function(keys) {
		return IX.map(keys, function(item) {return _super.get(item);});
	};
	return IX.inherit(_super, {
		// register should not change the sequence of key.
		register : registerFn,
		unregister : function(key){registerFn(key);},
		isEmpty :function(){return _list.isEmpty();},
		getSize : function(){return _list.getSize();},
		hasKey : _super.isRegistered,
		isLastKey : function(key){return _list.isLast(key);},
		getKeys : function() {return _list.getList();},
		getByKeys : function(keys){return listFn(keys);},
		getAll : function() {return listFn(_list.getList());},
		iterate: function(fn){IX.iterate(_list.getList(), function(item){fn(_super.get(item), item);}); },
		getFirst : function() {
			var arr = _list.getList();
			if (!arr || arr.length === 0)
				return null;
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				var inst = _super.get(arr[i]);
				if (inst)
					return inst;
			}
			return null;
		},
		// only for key. append will remove existed record in keyList and append it to the end
		append : _list.append,
		insertBefore : _list.insertBefore,
		remove : function(key) {registerFn(key);},

		clear : function(){
			_super.clear();
			_list.clear();
		}
	});
};

IX.IPagedManager = function(newInstFn, instHT, dataCaller){
	var total = null;
	var ids = [];
	var ht = instHT ? instHT :(new IX.IListManager());

	function _add(pos, item){
		var model = newInstFn(item);
		var id = model.getId();
		ids[pos] = id;
		ht.register(id, model);
		return model;
	}
	function putData(data , startPos){
		if ("total" in data)
			 total = data.total;
		var pos = startPos || 0;
		return IX.map(data.items, function(item, idx){
			return _add(pos + idx, item);
		});
	}
	function load(pageNo, pageSize, cbFn, lazyLoad){
		var startPos = pageNo * pageSize;
		if (lazyLoad){
			var _ids = [];
			var _num = total === null? 0 : Math.min(pageSize, total - startPos);
			for(var i=0; i<_num; i++) {
				var id = ids[startPos + i];
				if (IX.isEmpty(id)) break;
				_ids.push(id);
			}
			if (_num > 0 && _ids.length == _num)
				return cbFn(ht.getByKeys(_ids));
		}
		dataCaller({
			pageNo : pageNo,
			pageSize : pageSize
		}, function(result) {
			cbFn(putData(result, startPos));
		});
	}
	function resetTotal(_total){
		total = _total;
		ids = [];
	}
	return {
		get : ht.get,
		getFirst : ht.getFirst,
		//getSize : ht.getSize,
		getTotal : function(){return total;},

		load : load,
		putData : putData,
		addItems : function(itemIds){
			resetTotal(total + itemIds.length);
		},
		removeItems : function(itemIds){
			IX.iterate(itemIds, function(itemId){
				ht.unregister(itemId);
			});
			resetTotal(total - itemIds.length);
		},
		//iterate : ht.iterate,

		clear : function(){ids = [];}
	};
};

IX.formatDataStore = function(data){
	var _items = $XP(data, "items", []);
	if (_items.length>0 && $XP(data, "type", "json")!="json"){
		var _fields = $XP(data, "fields", []);
		_items =  IX.map(_items, function(row){
			return IX.loop(_fields, {}, function(acc, col, idx){
				acc[col] = IX.isArray(row)?row[idx]:row[col];
				return acc;
			});
		});
	}
	
	return IX.map(_items, function(item){
		var id = $XP(item, "id");
		if (IX.isEmpty(id))
			item.id = IX.id();
		return item;
	});
};
})();

(function(){
/**
 * IX.Date is a set of utilities for Date to convert to or deconvert to data string. It includes: {
  	setDS(v) : set separator between YYYY MM DD, will affect all date utilities;
 	setTS(v) : set separator between hh mm ss, will affect all date utilities;
 	setUTC(bool) : set if using UTC
 	getDS() : get separator between YYYY MM DD
 	getTS() : get separator between hh mm ss
 	isUTC :return if using UTC
 
 	format(date) : return a string like "YYYY-MM-DD hh:mm:ss" for date;
	formatDate(date) : return a string  in "YYYY-MM-DD" for date
	formatTime(date) : return a string  in "hh:mm:ss" for date
 
 	formatStr(str) :  parse str first, next do similar as format 
 	formatDateStr(str) : similar as formatDate
 	formatTimeStr(str) : similar as formatTime
	
	getDateText(oldTSinMS, curTSinMS) : show interval in simple mode,
 	isValid(dateStr, type) :  check if valid type format for dateStr which separated with TS/DS  
 * }
 * 
 * IX.IDate is a Class to deal with Date. It is supplement for Date:
 * 	@Params timeInSecond : the time ticks in second from 1970,1,1
 *	@Methods :{
		toText : similar to IX.Date.format
		toWeek : return the day in the week
		toDate(includeYear) : return [YYYY年]M月D日,
		toTime(ts) : return hh:mm
		toShort :return [[YYYY年]M月D日] hh:mm
		toInterval(tsInSec) : return simple interval or Today hh:mm or [[YYYY年]M月D日] hh:mm for tsInSec or now,
		toSimpleInterval : show interval in simple mode until now,	
 *	};
 */

var Fields4Day = ["FullYear", "Month", "Date"];
var Fields4Time = ["Hours", "Minutes", "Seconds"],
	Fields4Week = ["Hours", "Minutes",, "Day"];

var FieldLimits4Day = [-1, 12, 31], FieldLimits4Time = [24, 60, 60];
var IntervalUnits = ["刚才", "秒钟前", "分钟前", "小时前", "天前", "周前", "个月前", "年前"];
var IntervalCounts = [0, 10, 60, 3600, 86400, 604800, 2592000, 31536000];
var DT_Weeks = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
var DT_KeyWords = {
	Year : "年",
	Month : "月",
	Day : "日",
	Today : "今天"
};

var _isUTC = false;
var ds = "-", ts = ":";

function getFieldValues(dt, fields){
	var getPrefix = "get" + (_isUTC?"UTC":"");
	return IX.map(fields, function(f){
		var v  = dt[getPrefix + f]() - (f=="Month"?-1:0);
		var s = "00"+ v;
		return f=="FullYear" ? v : s.substring(s.length-2);
	});
}
function getText4Interval(olderTSInMS, tsInMS) {
	var interval = (tsInMS -olderTSInMS) / 1000 ;
	for (var i = IntervalCounts.length-1; i>=0; i--)
		if (interval >= IntervalCounts[i]){
			var nstr = i===0 ? "" : Math.round(interval / (i==1?1:IntervalCounts[i]));
			return nstr + IntervalUnits[i];
		}
}
function isValidDate(sps, isDate){ // sps: [2012,9, 3] or [13, 30, 0]...
	var limits = isDate ? FieldLimits4Day : FieldLimits4Time;
	return sps.length == 3 && IX.loop(sps, true, function(acc, item, idx){
		if (!acc || isNaN(item) || item.indexOf(".")>=0) return false; // invalid number;
		if (isDate && idx===0) return true; //  will not check year number;
		var n = item * 1 + (isDate ? 0 : 1);
		return n > 0 && n <= limits[idx];
	});
}

function _formatStr(str, sp) {
	if (IX.isEmpty(str))
		return "";
	str = str.split(sp, 3);
	return IX.map(sp==ds?[4,2,2]:[2,2,2], function(item, idx){
		var nstr = (str.length>idx?str[idx]:"");
		return ("0".multi(item) + nstr).substr(nstr.length, item);
	}).join(sp);
}
function _format(date, type) {
	var dateStr = type != "Time" ? getFieldValues(date, Fields4Day).join(ds) : "",
		timeStr = type != "Date" ? getFieldValues(date, Fields4Time).join(ts) : "";
	if (type == "Date") return dateStr;
	else if (type == "Time") return timeStr;
	else return dateStr + " " + timeStr;
}
function isValid(str, isDate){
	return isValidDate(str.split(isDate?ds :ts, 3), isDate);
}
IX.Date = {
	setDS : function(v){ds = v;},
	setTS : function(v){ts = v;},
	setUTC : function(isUTC){_isUTC= isUTC;}, 
	getDS : function(){return ds;},
	getTS : function(){return ts;},
	isUTC :function(){return _isUTC;},
	// return YYYY-MM-DD hh:mm:ss 
	format : _format,
	// return YYYY-MM-DD
	formatDate : function(date) {return _format(date, "Date");},
	// return hh:mm:ss
	formatTime : function(date) {return _format(date, "Time");},
	
	// return YYYY-MM-DD hh:mm:ss 
	formatStr:function(str) {
		str = (str + " ").split(" ");
		return _formatStr(str[0], ds) + " " + _formatStr(str[1], ts);
	},
	// return YYYY-MM-DD
	formatDateStr:function(str){return _formatStr(str, ds);},
	// return hh:mm:ss
	formatTimeStr:function(str){return _formatStr(str, ts);},
	getDateText : getText4Interval,
		
	formatBySec : function(tickInSec, withTime){
		return !tickInSec?"":_format(new Date(tickInSec*1000), withTime?"":"Date");
	},
	getTickInSec : function(str){
		var tickInMS = null;
		if (str && str instanceof Date)
			tickInMS =  str.getTime();
		else if (IX.isString(str) && !IX.isEmpty(str)) {
			var sp = str.replace(/[0-9|:|\ ]/g, '')[0];
			tickInMS = (new Date(str.replaceAll(sp, "/"))).getTime();
		}
		return isNaN(tickInMS) ? null : Math.ceil(tickInMS/1000);
	},

	// accept YYYY-MM-DD hh:mm:ss return true/false;
	isValid : function(dateStr, type) {
		var dt = dateStr.split(" ");
		if (type=="Date" ||type=="Time")
			return dt.length==1 && isValid(dt[0], type == "Date");
		return dt.length==2 && isValid(dt[0], true) && isValid(dt[1], false);
	}
};

IX.IDate = function(timeInSecond) {
	var timeInMS = timeInSecond*1000;
	var date = new Date(timeInMS);
	var dateStr = _format(date);
	var timeValues = getFieldValues(date, [].concat(Fields4Day, Fields4Week));
	
	function toDateStr(includeYear){
		var curTime = getFieldValues(new Date(), Fields4Day);
		includeYear = includeYear || (curTime[0]>timeValues[0]);
		return [includeYear?timeValues[0]:"", includeYear?DT_KeyWords.Year:"",timeValues[1], DT_KeyWords.Month, timeValues[2], DT_KeyWords.Day].join("");
	}
	function _toIntvText(_date, showToday){
		var curTime = getFieldValues(_date, [].concat(Fields4Day, Fields4Week));
		var strs = [];
		var shouldAppend = false;
		if (timeValues[0] != curTime[0]){
			shouldAppend = true;
			strs = strs.concat(timeValues[0], ds);
		}
		if (shouldAppend || timeValues[1] != curTime[1] || timeValues[2] != curTime[2])
			strs = strs.concat(timeValues[1], ds, timeValues[2], "");
		else if (showToday)
			strs = DT_KeyWords.Today +" ";
		
		strs = strs.concat(timeValues[3], ts, timeValues[4]);
		return strs.join("");
	}
	
	return {
		toText: function(){return dateStr;},
		toWeek : function() {return DT_Weeks[timeValues[5]];},
		toDate: toDateStr,
		toTime : function(ds){return [timeValues[3], timeValues[4]].join(ds || ":");},
		toShort : function(){ return _toIntvText(new Date(), false);},
		toInterval : function(tsInSec){
			var _date = tsInSec?(new Date(tsInSec*1000)) :(new Date());  
			var _tsInMS = _date.getTime();
			if(_tsInMS- timeInMS<3600000) // inner one hour
				return getText4Interval(timeInMS, _tsInMS);
			return _toIntvText(_date, true);
		},
		toSimpleInterval : function(){return getText4Interval(timeInSecond * 1000, IX.getTimeInMS());}
	};
};
})();
(function(){
/**
 * IX.UUID is simple utility to generate UUID:{
	generate() : generate a unique key in world wide
 * }
 *
 * IX.IObject is an abstract Class.
 * @param {} config {
 * 		id: the identified object(String, number, ...). If without, use IX.UUID.generate to create one.
 * 		type: the object type, can be anything which's meaning is assigned by inherit class.
 * }
 * @return {
 * 		getId(): return current object identification.
 * 		setId(id): replace identification's value	
 * 		getType() : return current object type. Maybe null.
 * 		equal(dst) : return if they have same identification.
 * 		destroy(): it is better to have  for each new class.
 * }
 *
 */	
var itoh = '0123456789ABCDEF';
function generateUUID() {
	var  s = [];
	var i=0;
	for (i = 0; i <36; i++)
		s[i] = Math.floor(Math.random()*0x10);
	s[14] = 4;
	s[19] = (s[19] & 0x3) | 0x8;
	
	for (i = 0; i <36; i++) s[i] = itoh[s[i]];
	s[8] = s[13] = s[18] = s[23] = ''; // seperator
	return s.join('');
}
IX.UUID = { generate: generateUUID};

IX.IObject = function(config){
	var _id = $XP(config, "id", generateUUID());
	var _type = $XP(config, "type");
	
	return {
		getId:function(){return _id;},
		setId:function(id){_id = id;},
		getType:function(){return _type;},
		equal : function(dst) {return _id == dst.getId();},
		destroy: function(){}
	};
};
})();

(function(){
/** 
 * IX.ITemplate is a Class to deal with HTML template. It provide simple grammer:
 * 		<tpl id="id">..{NAME}...<tpl> 
 * 		tpl tag can be recurrsive.
 * @Params config :{
   		tpl :  the HTML template definition string or array contains strings.
  		tplDataFn : the function to provide data to tpl[tplId]
 *  }
 * @Methods :{
	render(tplId) : render the specified template with given tplDataFn
	renderData(tplId, data) : render the specified template with given data
	getTpl(tplId) : get the whole template or specified sub-template
 * };
 * 
 * @Comments : tplId can be empty or "root", it has same means.
 */	
var EmptyTpl = {
	render:function(){return "";},
	renderData:function(){return "";},
	getTpl: function(){return "";}
};
var tplRegex = new RegExp('(?:<tpl.*?>)|(?:<\/tpl>)', 'img');
var rpRegex = /([#\{])([\u4E00-\u9FA5\w\.-]+)[#\}]/g;
var idRegex = /['"]/;

function parseTpl(tplstr){
	var tplMgr = {};
	function newTpl(name, html){tplMgr[name] = {name : name, tpl : [html]};}
	function appendTpl(name, html){tplMgr[name].tpl.push(html);}
	function reformTpl(name){
		var curTpl = tplMgr[name];
		var html =  curTpl.tpl.join("");
		curTpl.tpl = html; 
		curTpl.list =  IX.Array.toSet(html.match(rpRegex)).sort();
	}
	function _openTpl(acc, newName, html){
		var newTplName = acc[0] + "." + newName;
		appendTpl(acc[0], "#"+ newName + "#");
		acc.unshift(newTplName);
		newTpl(newTplName, html);
		return acc;	
	}
	function _closeTpl(acc, html){
		reformTpl(acc[0]);
		acc.shift();
		appendTpl(acc[0], html);				
		return acc;
	}
	var _regSplit = tplstr.regSplit(tplRegex);
	var tplArr = _regSplit.arr, contentArr = _regSplit.separate;
	newTpl("root", contentArr[0]);
	var nameArr = IX.loop(tplArr, ["root"], function(acc, item, idx) {
		if (item=="</tpl>")
			return _closeTpl(acc, contentArr[idx + 1]);
		var arr = item.split(idRegex);
		return _openTpl(acc, arr[1], contentArr[idx + 1]);
	});
	reformTpl("root");
	
	return (nameArr.length==1 && nameArr[0]=="root")?tplMgr : null;
}

IX.ITemplate = function(config){
	var _tpl = $XP(config, "tpl", []);
	_tpl = [].concat(_tpl).join("");	
	if(IX.isEmpty(_tpl))
		return EmptyTpl;	
	var tplMgr = parseTpl(_tpl);
	if (!tplMgr) {
		IX.err("unformated Tpl: " + _tpl);
		return EmptyTpl;
	}
	
	var _dataFn = $XP(config, "tplDataFn");
	if (!IX.isFn(_dataFn))
		_dataFn = function(){return null;};
	
	function getProps(data, name){
		if (!IX.hasProperty(data,name))
			return null;
		var v = $XP(data, name);
		return IX.isEmpty(v)?"":v;
	}
	function renderFn(tplId, data){
		var tpl = tplMgr[tplId];
		if (!tpl) {
			IX.err("can't find templete by name: " + tplId);
			return "";
		}
		return tpl.tpl.loopReplace(IX.loop(tpl.list, [], function(acc, item){
			var t = item.charAt(0);
			var _name = item.substring(1, item.length-1);
			if (t=='{') {
				var v = getProps(data, _name);
				if (v!==null)
					acc.push([item, v]);			
			} else if (t=='#') {
				var h = IX.map($XP(data, _name, []), function(itm, idx) {
					var idata = IX.inherit(itm, {idx: idx});
					return renderFn(tplId+ "." + _name, idata);
				}).join("");
				acc.push([item, h]);
			}
			return acc;
		}));
	}
	function _render(tplId, data){
		var id = "root";		
		if (!IX.isEmpty(tplId)) 
			id = tplId.indexOf("root")===0 ? tplId : ("root." + tplId);
		
		return renderFn(id, data?data:_dataFn(id)).replace(/\[(\{|\})\]/g, "$1");
	}
	function _getSubTpl(tplId, _id){
		var tpl = tplMgr["root." + _id];
		if (!tpl) return "";
		
		var s = tpl.tpl,  list = tpl.list;
		if(!list || list.length === 0)
			return _id == tplId ? s : ('<tpl id="' + _id.split(".").pop() + '">' + s + '</tpl>');
		
		return IX.loop(list, s, function(acc, item){
			var ci = item.replace(/#/g, "");
			return acc.replace(new RegExp(item, "img"),  _getSubTpl(_id + "." + ci));
		});
	}
	return {		
		render : function(tplId){return _render(tplId);},
		renderData : function(tplId, data){return _render(tplId, data);},
		getTpl: function(tplId){
			if (IX.isEmpty(tplId) || tplId == "root")
				return _tpl;
			var _id = tplId.indexOf("root.") === 0 ? tplId.substring(5) : tplId;
			return _getSubTpl(_id, _id);
		}
	};
};
})();

(function(){
/** 
 * IX.ITask is a Class to schedule task to similar a thread :
 * @Params
 	taskFn(times) : real task function 
 	interval : the interval to execute task. In ms. 
 	times : the max times can be executed.
 * @Methods :{
	start() : start to run task;
	stop(tplId) : stop running 
 * };
 * 
 */
var getTimeInMS = IX.getTimeInMS;
IX.ITask = function(taskFn, interval, times){
	var ts = -1, h = null, execFlag = false;
	var _times = 0, _total = isNaN(times)?-1:times;

	function _fn(){
		if (!execFlag) return;
		taskFn(_times);
		_times ++ ;
		if (_total>0 && _times>=_total) return;
		var _ts = getTimeInMS();
		h= setTimeout(_fn, ts + 2 * interval - _ts);
		ts = _ts; 
	}
	
	return {
		start : function(){
			ts = getTimeInMS();
			execFlag = true;
			_times = 0;
			h = setTimeout(_fn, interval);
		},
		stop : function(){
			execFlag = false;
			clearTimeout(h);
			h = null;
			ts = -1;	
		}
	};
};
})();

(function(){
/** 
 * Extended Shortcut list: 
$X(id) = IX.get;
$Xw = IX.win
$XD = IX.Dom;
$XH = IX.HtmlDocument;
$Xc = IX.Cookie;
 */

/**
 * Base DOM related utilities for IX project. All can be called as IX.xxxx(...) anywhere:
 * 
 * IX utilities extended for DOM:
 * 
	isOpera   
	isChrome
	isFirefox
	isSafari
	
	isMSIE
	isMSIE7

	isMSWin
	
	isAndroid
	isAppleHD
	isIPhone
	isIPad
	
	getUrlParam(key, defV) : get value from url query string by key , or return defV if key not exist.
	toAnchor(name) : reset hash for current page;

	bind(el, handlers) : bind event handler on el
	unbind(el, handlers) : remove event handler on el
	
	getComputedStyle(el) : get the computed style after render in browser;
	decodeTXT(txt) : decode from encoded text,
	encodeTXT(txt) : make txt can be shown in document,
	isElement(el) : check if el is valid DOM element
	createDiv(id,clz) : create a div tag under body with id and clz
	get(domEl) : get DOM element by id/el
 * }
 * 
 * IX.win is an utilities for action on window only: {
	getScreen() : get current screen status:
			scroll : [scrollX, scrollY, body.scrollWidth, body.scrollHeight],
			size : [body.clientWidth, body.clientHeight]
	//getWindowScrollTop():
	getScrollY():
	bind(handlers)
	unbind (handlerIds)
	scrollTo(x,y)
 * }
 * IX.Xml is a library to deal with XML string or document. It includes: {
	parser(xmlString): it convert xmlString to XML document object and return.
	getXmlString(xmlDocument) : it convert XML document to string and return.
	duplicate(xmlDocument) : it duplicate xml document object and return.
 * }
 *
 * IX.Dom is a library to deal with DOM. It includes :{
	first(node, tagN): try to get the first child of DOM element node which tag name is tagN.
 	next(node, tagN): try to get the first next sibling of DOM element node which tag name is tagN.
	cdata(node, tagN): try to get the text of DOM element node which is involved by CDATA tag.
	text (node, tagN): try to get the text of DOM element node.
	attr (node, attN): try to get the value of attribute of DOM element node which name is attrN.
	setAttr(node, attN, v) : try to set attribute value.
	dataAttr(node, attN) : get the value of attribute "data-{attN}" 
	setDataAttr(node, arrN, v) : similar as setAttr to set value of attribute "data-{attN}" 
 * 		
 	remove(node) : remove node from DOM tree;
 	isAncestor(node, annode) : check if annode is ancestor of node;
 	ancestor(node, tagName) : get first ancestor node of node with tagname;
 	is(el, tagName) : check if el is tagName element
 	
	inTag(tagN, content, attrs) : get html fragment by tagN, content,attrs
	inPureTag(tagN, content, attrs) : similar with inTag, but content is include by CDATA mark
 * }
 *
 * IX.HtmlDocument is an utilities to deal with DOM element by class. It includes : {
	getStyle(node, styleName): get node's style. 
			e.g. $XH.getStyle(node, "border-left-width"), $XH.getStyle(node, "font-size")
	hasClass(el, clzName)
	removeClass(el, clzName)
	addClass(el, clzName)
	toggleClass(el, clzName) : if el has clzName, remove it, otherwise add it;
	next(el, clzName) : get el's first sibling with clzName,
	first(parentEl, clzName) : get parentel, first child node with clzName
	isAncestor(node, pnode) : check if pnode is ancestor of node;
	ancestor(node, clzName) : get first ancestor of node which has clzName
	getScroll(el) : get el's curre scroll status :
			scrollTop
			scrollLeft
	getZIndex(el) :  get z-index of el
	rect(el, ri) : set el position and area (ri: [left, top, width, height])
	getPosition(el, isFixed) : get position in DOM flow.
		return [left, top, width, height]
 * }	
 *
 * IX.Cookie is used to handle cookie special , it include :{
	get(name),
	set(name, cookie)
	remove(name)
 * }
 * 
 * IX.Util.Event is used to handle DOM event, it include : {
	target(e) :  get event target
	stopPropagation(e) : stop event bubble up;
	preventDefault(e) : stop event default behavior
	stop(e) : make browser not response event.
 * }
 *
 */
var ua = window.navigator.userAgent.toLowerCase();
function checkUA(keywords){return ua.indexOf(keywords)!==-1;}

var _isIPad = checkUA('ipad'), _isIPhone = checkUA('iphone');

var CSSVendorName = (function(){
	var style = document.body.style;
	if ("transition" in style)
		return "";
	if ("-webkit-transition" in style)
		return "-webkit-";
	if ("-ms-transition" in style)
		return "-ms-";
	if ("-0-transition" in style)
		return "-o-";
	return "";
})();

IX.extend(IX, {
	isOpera : checkUA("opera"),   
	isChrome : checkUA("chrome"),  
	isFirefox : checkUA("firefox") && !checkUA("webkit"),  
	isSafari : window.openDatabase && checkUA("safari") && checkUA('version'),
	
	isMSIE : checkUA("msie") && !checkUA("opera"), 
	isMSIE7 : document.all && checkUA("msie 7.0"),

	isMSWin : checkUA("windows"),
	
	isAndroid: (checkUA("gecko") && checkUA('safari') && checkUA('mobile') && checkUA('android')),
	isAppleHD: _isIPad || _isIPhone,
	isIPhone: _isIPhone,
	isIPad: _isIPad,

	CSSVendorName :  CSSVendorName,
	
	getUrlParam : function(key, defV){
		var v = defV;
		IX.iterbreak(window.location.search.substring(1).split("&"), function(item){
			if(item.indexOf(key+"=")!==0)
				return;
			v = item.substring(key.length+1);
			throw v;
		});
		return v;
	},
	toAnchor : function(name){window.location.hash = "#" + name;}
});

var hasEventListener = ("addEventListener" in window);
var ix_attachEvent = hasEventListener?function(target, eName, fn){
	target.addEventListener(eName, fn, false);
}:function(target, eName, fn){
	target.attachEvent("on" + eName, fn);
};
var ix_detachEvent = hasEventListener?function(target, eName, fn){
	target.removeEventListener(eName, fn, false);
}:function(target, eName, fn){
	target.detachEvent("on" + eName, fn);
};

function EventBindManager(){
	var ht = new IX.I1ToNManager();
	function _evtWrapper(ehKey, evt){
		if (!ht.hasValue(ehKey))
			return;
		var e = evt || window.event;
		if (e && !("target" in e) )
			e.target = e.srcElement; // for IE hack
		IX.iterate(ht.get(ehKey), function(fn){
			if (IX.isFn(fn))
				fn(e);
		});
	}
	function _bind(el, evtName, handler){
		var evtKeys = el.data_ixEvtKeys;
		if (!evtKeys)
			evtKeys = {id : IX.id()};
		var ehKey = evtKeys.id + "." + evtName;
		if (!evtKeys[evtName]) { // never bind!
			evtKeys[evtName] = function(evt){return _evtWrapper(ehKey, evt);};
			ix_attachEvent(el, evtName, evtKeys[evtName]);
		}
		ht.put(ehKey, handler);
		el.data_ixEvtKeys = evtKeys;
	}
	function _unbind(el, evtName, handler){
		var evtKeys = el.data_ixEvtKeys;
		if (!evtKeys)
			return;
		if (!evtKeys[evtName])
			return;
		var ehKey = evtKeys.id + "." + evtName;
		ht.remove(ehKey, handler);
		if (!ht.isEmpty(ehKey)){
			ix_detachEvent(el, evtName, evtKeys[evtName]);
			evtKeys[evtName] = null;
		}
	}
	return {
		exec : _evtWrapper,
		bind : _bind,
		unbind : _unbind
	};
}
var DOM_EventList = [
	"click", "dblclick", "focus", "blur", 
	"keyup", "keydown", "keypress",
	"mouseover", "mouseout", "mousedown", "mousemove", "mouseup",
	"resize", "scroll",
	"touchstart", "touchend", "touchmove"
];
var bindMgr = new EventBindManager();
function _bindHandlers(el, handlers, isUnbind){
	if(!el || !handlers) return;
	var bindFn = bindMgr[isUnbind ? "unbind" : "bind"];
	IX.iterate(DOM_EventList, function(evtName){
		if (IX.isFn(handlers[evtName]))
			bindFn(el, evtName, handlers[evtName]);
	});
}
	
IX.extend(IX, {
	bind : function(el, handlers) {_bindHandlers(el, handlers);},		
	unbind : function(el, handlers) {_bindHandlers(el, handlers, true);},
	
	getComputedStyle : "getComputedStyle" in document.defaultView? function(el){
		return document.defaultView.getComputedStyle(el);
	}:function(el){		
		return el.currentStyle || el.style; 
	},
	decodeTXT : function(txt){
		return (txt+"").replaceAll("&nbsp;", ' ').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
	},
	encodeTXT : function(txt){
		return (txt+"").replaceAll('&', '&amp;').replaceAll("<","&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;");
	},
	isElement: function(el){return el.nodeType===1;},
	createDiv : function(id,clz){
		var node = document.createElement('div');
		if (!IX.isEmpty(clz))
			node.className = clz;
		node.id = id;
		document.body.appendChild(node);
		return node;
	},
	get : function(domEl){
		if (IX.isEmpty(domEl))
			return null;
		if (IX.isString(domEl) || IX.isNumber(domEl) )
			return document.getElementById(domEl);
		if ("ownerDocument" in domEl)
			return domEl;
		return null;	
	}
});
window.$X = IX.get;

var winBindMgr = new EventBindManager();
var Win_EventList = ["click", "resize", "scroll" ,"mousedown", "mouseover", "mouseout"];
function _winBindHandlers(handlers, isUnbind){
	if(!handlers) return;
	var bindFn = winBindMgr[isUnbind ? "unbind" : "bind"];
	IX.iterate(Win_EventList, function(evtName){
		if (IX.isFn(handlers[evtName]))
			bindFn(window, evtName, handlers[evtName]);
	});
}
IX.win =  {
	getScreen : function(){
		var body = document.documentElement;
		var win = window;
		var _scrollX = "scrollX" in win?win.scrollX:body.scrollLeft,
			_scrollY = "scrollX" in win?win.scrollY:body.scrollTop;
		
		return {
			scroll : [_scrollX, _scrollY, body.scrollWidth, body.scrollHeight],
			size : [body.clientWidth, body.clientHeight]
		};
	},
	// getWindowScrollTop : function() {
	// 	return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop	|| 0;
	// },
	getScrollY : function(){
		if (typeof window.pageYOffset == 'number')
			return window.pageYOffset;
		var doc = window.document;
		var isCompatMode = (typeof doc.compatMode == 'string') && (doc.compatMode.indexOf('CSS') >= 0);
		var _scrlTop = isCompatMode && doc.documentElement ? doc.documentElement.getAttribute("scrollTop") : null;
		if (typeof _scrlTop == 'number')
			return _scrlTop;

		_scrlTop = doc.body ? doc.body.getAttribute("scrollTop") : null;
		if (typeof _scrlTop == 'number')
			return _scrlTop;
		return 0;
	},

	bind : function(handlers){_winBindHandlers(handlers);},
	unbind : function(handlerIds){_winBindHandlers(handlerIds, true);},
	scrollTo : function(x,y){
		window.scrollTo(x, y);
		winBindMgr.exec("scroll", null);
	}	
};
window.$Xw = IX.win;

/**
 * 	IX.Xml is a library to deal with XML string or document. It includes: {
 * 		parser(xmlString): it convert xmlString to XML document object and return.
 * 		getXmlString(xmlDocument) : it convert XML document to string and return.
 *  	duplicate(xmlDocument) : it duplicate xml document object and return.
 * 	}
 */
IX.Xml = {
	parser:function(str){
		str = IX.isString(str)?str:"";
		var doc = null;
		if ("DOMParser" in window) {
			doc = (new window.DOMParser()).parseFromString(str, "text/xml");
		}else if ("ActiveXObject" in window){
			doc=new window.ActiveXObject("Microsoft.XMLDOM");
			doc.async="false";
			doc.loadXML(str);
		} else {
			$XE("this browser can't support XML parser.");
		}
		return doc;
	},
	getXmlString:function(xmlDoc){
		if(!xmlDoc){
			return "";
		}
		if(IX.nsExisted("document.implementation.createDocument")) {
			return (new window.XMLSerializer()).serializeToString(xmlDoc);
		}else if ("ActiveXObject" in window){
			return xmlDoc.xml;
		} else {
			$XE("this browser can't support XML parser.");
		}
		return "";
	},
	duplicate:function(xmlDoc){
		return this.parser(this.getXmlString(xmlDoc));
	}
};

/**
 * 	IX.Dom is a library to deal with DOM. It includes :{
 * 		first(node, tagN): try to get the first child of DOM element node which tag name is tagN.
 * 		next(node, tagN): try to get the first next sibling of DOM element node which tag name is tagN.
 * 		cdata(node, tagN): try to get the text of DOM element node which is involved by CDATA tag.
 * 		text (node, tagN): try to get the text of DOM element node.
 * 		attr (node, attN): try to get the value of attribute of DOM element node which name is attrN.
 * 		
 * 		inTag(tagN, content, attrs): 
 * 		inPureTag(tagN, content, attrs): 
 * }
 */
IX.Dom = (function(){
	var loopFn = function(node, type, checkFn, valueFn) {
		if (!node) return valueFn(null);
		var cnode = ("firstChild" in node)?node[type==="first"?"firstChild":"nextSibling"]:null;
		while(cnode!==null && !checkFn(cnode))
			cnode = cnode.nextSibling;
		return valueFn(cnode);
	};
	
	var getFn = function(node, tagN, type){
		return IX.isString(tagN)?loopFn(node, type, function(cnode){
					return cnode.nodeName.toLowerCase()==tagN;
				},function(cnode){
					return cnode;
				}
			):null;
	};
	var textFn = IX.isMSIE ?
		function(node){return node? node.innerText:"";} :
		function(node){return node?node.textContent:"";};
	
	var cdataFn = function(node){
		if (!node)
			return "";
		return loopFn(node,"first",function(cnode){
				return cnode.nodeType==4;
			},function(cnode){
				return cnode?cnode.nodeValue:"";
			}
		);
	};
	var firstFn = function(node,tagN) {
		return getFn(node,tagN, "first");
	};
		
	var inTagFn = function(tag, content, attrs){//attrs should like [[pramName, paramValue],...
		var _attrs = IX.loop(attrs, [],  function(acc, item){
			return acc.concat(' ', item[0], '="', item[1], '"');
		});
		var arr = [].concat("<", tag, _attrs, ">", content, "</", tag, ">");
		return arr.join("");
	};
	var inPureTagFn = function(tag, content, attrs){
		return inTagFn(tag, ["<![CDATA[", content, "]]>"].join(""),  attrs);
	};
	var attrFn = function(node, attN){
		if(!node)
			return "";
		var val = node.getAttribute(attN);
		return IX.isEmpty(val)?"":val;
	};
	var setAttrFn = function(node, attN, val){
		if(!node)
			return;
		if (val)
			node.setAttribute(attN, val);
		else
			node.removeAttribute(attN);
	};
	return {
		first:firstFn,
		next:function(node, tagN){
			return getFn(node, tagN, "next");
		},
		cdata:function(node, tagN){
			return cdataFn(firstFn(node, tagN));
		},
		text:function(node, tagN){
			return textFn(firstFn(node, tagN));
		},
		attr:attrFn,
		setAttr:setAttrFn,
		dataAttr :function(node, name){
			return attrFn(node, "data-" + name);
		},
		setDataAttr : function(node, name, val){
			setAttrFn(node, "data-" + name, val);
		},
		remove: function(node){
			if(node)
				if(node.parentNode)
					node.parentNode.removeChild(node);
		},
		isAncestor : function(node, ancestor){
			var el = node;
			while(el){				
				if (el == ancestor)
					return true;
				var nodeName = el.nodeName.toLowerCase();
				el = (nodeName==="body")? null: el.parentNode;
			}
			return false;
		},
		ancestor : function(node, tagName){
			if (!node)
				return null;
			var el =  node;
			while(el){
				var nodeName = el.nodeName.toLowerCase();
				if (nodeName==tagName)
					break;
				el =(nodeName==="body")? null: el.parentNode;
			}
			return el;
		},
		is : function(el, tagName){
			return el.nodeName.toLowerCase() == tagName;
		},
		inTag : inTagFn,
		inPureTag : inPureTagFn
	};
})();
window.$XD = IX.Dom;
/*
*		getStyle(node, styleName): get node's style. e.g. $XD.getStyle(node, "border-left-width"), $XD.getStyle(node, "font-size")
*/
IX.HtmlDocument = (function(){
	var hasFn = function(el, clzName){
		return el && ("className" in el)&& IX.Array.isFound(clzName, (el.className+"").split(" "));
	};
	var removeFn = function(el, clzName){
		if (!el) return;
		var clz = IX.Array.remove(el.className.split(" "), clzName);
		el.className = clz.join(" ");
	};
	var addFn = function(el, clzName) {
		if (!el) return;
		var clzs = IX.Array.toSet(el.className.split(" ").concat(clzName));
		el.className = clzs.join(" ");
	};
	var nextFn = function(node, clzName){
		if (!node)
			return null;
		var el = node.nextSibling;
		while(el){
			if (hasFn(el, clzName))
				return el;
			el = el.nextSibling;
		}
		return el;
	};
	var _getComputeStyle = function(node, styleName){
		var oStyle = IX.getComputedStyle(node);
		return oStyle && (styleName in oStyle) ?oStyle[styleName] : null;
	};
	var _checkIfFixed = function(node){
		if (!node)
			return null;
		var el = node;
		while(el && el.tagName.toLowerCase()!="body"){
			if (_getComputeStyle(el, "position") == "fixed")
				return true;
			el = el.parentNode;
		}
		return false;
	};
	return {
		isPositionFixed : _checkIfFixed,
		hasClass : hasFn,
		removeClass : removeFn,
		addClass : addFn,
		toggleClass : function(el, clzName){
			if (!el) return;
			if (hasFn(el, clzName))
				removeFn(el, clzName);
			else addFn(el, clzName);
		},
		next :nextFn,
		first : function(parentEl, clzName){
			if (!parentEl)
				return null;
			var el = parentEl.firstChild;
			return hasFn(el, clzName)?el: nextFn(el, clzName);
		},
		isAncestor : function(node, pnode) {
			if (!node)
				return false;
			var el =  node;
			while(el!==null){
				if (el==pnode)
					return true;
				el = el.parentNode;
				if (el && el.nodeName.toLowerCase()=="body")
					break;
			}
			return false;
		},
		ancestor : function(node, clzName){
			if (!node)
				return null;
			var el =  node;
			while(el!==null && !hasFn(el, clzName)){
				el = el.parentNode;
				if (el && el.nodeName.toLowerCase()=="body")
					el = null;
			}
			return el;
		},

		getScroll: function(_dom){
			if (_dom && _dom.nodeType != 9)//not document
				return {
					scrollTop: _dom.scrollTop,
					scrollLeft: _dom.scrollLeft
				};
			var _window = !_dom ? window : _dom.defaultView || _dom.parentWindow;
			return {
				scrollTop: _window.pageYOffset ||
					_window.document.documentElement.scrollTop ||
					_window.document.body.scrollTop || 0,
				scrollLeft: _window.pageXOffset ||
					_window.document.documentElement.scrollLeft ||
					_window.document.body.scrollLeft || 0
            };
		},
		getZIndex : function(el) {
			var style = null;
			while(el && el.tagName.toLowerCase()!="body"){
				style = IX.getComputedStyle(el);				
				if (style.zIndex !="auto")
					return style.zIndex - 0;
				el = el.offsetParent;
			}
			return 0;
		},
		/* ri : [ left, top, width, height] */
		rect : function(el, ri){
			IX.iterate(["left", "top", "width", "height"], function(attr, idx){
				if (ri[idx]!==null)
					el.style[attr] = ri[idx] + "px";
			});
		},
		getPosition : function(el, isFixed){
			// getBoundingClientRect : Supported by firefox,chrome,IE8+,opera,safari
			// Return {top, left, right, bottom[, width, height]}
			// width and height are not supported in IE
			// top|left|right|bottom are offset value for visible part of window.
			var rect = el.getBoundingClientRect(),
				doc = document.documentElement || document.body;
			return [
				rect.left + (isFixed ? 0 : window.scrollX || doc.scrollLeft),
				rect.top + (isFixed ? 0 : window.scrollY || doc.scrollTop),
				el.offsetWidth,
				el.offsetHeight
			];
		}
	};	
})();
window.$XH = IX.HtmlDocument;

IX.Cookie = (function(){
	var getOptions = function(options){
		if (!options)
			return [];
		var vals = [];
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			vals.push('; expires=' + date.toUTCString()); // use expires attribute, max-age is not supported by IE
		}
		if ("path" in options)vals.push('; path=' + options.path);
		if ("domain" in options)vals.push('; domain=' + options.domain);
		if ("secure" in options)vals.push('; secure=' + options.secure);
		vals.push(';HttpOnly');
		return vals;
	};
	var _set = function(name, value, options){
		var vals = [name, '=', encodeURIComponent(value)].concat(getOptions(options));
		document.cookie = vals.join('');	
	};
	
	return {
		get : function(name){
			if (IX.isEmpty(document.cookie))
				return "";
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookieN = cookies[i].trim();
				// Does this cookie string begin with the name we want?
				if (cookieN.substring(0, name.length + 1) == (name + '='))
					return decodeURIComponent(cookieN.substring(name.length + 1));
	        }
	        return "";
		},
		set : _set,
		remove : function(name){
			_set(name, '', {
				expires: -1
			});
		}
	};
})();
window.$Xc = IX.Cookie;

var eventUtil = {
	target: function(e){
		return e.target||e.srcElement;
	},
	stopPropagation : function(e) {
		//如果提供了事件对象，则这是一个非IE浏览器
		if ( e && e.stopPropagation )
			//因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		else
			//否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
	},
	preventDefault : function(e) {	//阻止浏览器的默认行为
		//阻止默认浏览器动作(W3C)
		if ( e && e.preventDefault )
			e.preventDefault();
		//IE中阻止函数器默认动作的方式
		else
			window.event.returnValue = false;
		return false;
	}
};
eventUtil.stop =function(e){
	eventUtil.preventDefault(e);
	eventUtil.stopPropagation(e);
};
IX.ns("IX.Util");
IX.Util.Event = eventUtil;

})();
(function(){
/**
 * Base NET related utilities for IX project based on DOM. All can be called as IX.xxxx(...) anywhere:
 * 
 * 
 * 
 * IX.Ajax is an lib utitlities for simple ajax request. It always be replaced by jQuery.ajax : {
 * 	request(cfg) : start ajax request. 
  	@params cfg :{
		url : "http://abc.com/request",
		type :  "GET" or "POST",
		contentType : 'application/json' or 'application/x-www-form-urlencoded',
		data : JSON or params ...
		success(data) : when success, it is called.
		fail(data) : ,
		error(data):
	}
	stopAll()
 * }
 * 
 * IX.Net is a library for networking. It includes: {
	loadFile(url, responseHandler): active AJAX requirement and let responseHandler deal with response(Text).
	loadCss(cssUrl): load CSS and  apply to current document.
	loadJsFiles(jsFileUrlArray, postHandler): load all js files in array, and execute postHandler 
			after all jsFiles are loaded.
	tryFn(fnName, argsArray,  dependency): try to execute function fnName with parameters argsArray.
			If the function is not existed, resolve the dependency and try it again.
		@params	dependency:{
			beforeFn: function before applying dependency.
			cssFiles: all required CSS files for current function call.
			jsFiles: all required JS files for current function call.
			afterFn: function after executing current function call.
			delay: the milliseconds for waiting after js files are loaded.
		}
 *	}
 *
 * IX.urlEngine is a utilities to manage URL routines. {
	init(cfg) : to add/update url routine prefix
		@params cfg : {
		  	baseUrl : "https://abc.com/",
		  	[name]Url : "https: //...."
		}
	reset(cfg) : same as init	
	createRouter(routes) : create url routers
		@params routes : [{ 
			name : "page.entry",
			url : can be "/get" or function(params){return "/get";}, url should start with "/"
			urlType : default "base", the url's prefix set by init/reset.
		}]	
		@return : function(name, params){return url;}
 * }
 *
 * IX.ajaxEngine is a utilities to manage AJAX routines. {
	init(cfg) : to add/update ajax routine prefix, 
		@params cfg : {
		  	ajaxFn(ajaxParams) : can be jQuery.ajax, or will use built-in AJAX function.
		  	baseUrl : "https://abc.com/",
		  	[name]Url : "https: //...."
		}
		@sub-params :ajaxParams {
			url : url
			type :  "GET",
			contentType : 'application/json' , ...
			data : jsonData
			success(data) :
			fail(data) :
			error(data):
		}
	reset(cfg) : same as init	
	createCaller(routes) : create ajax routers
		@params routes : [{ 
			name : "signIn",
	 		url : "/session" / function(params){return "/abc";},
			urlType : default "base", the url's prefix set by init/reset.
	 		
	 		channel : used to lock channel to prevent request;
	  		type : "POST"/"GET"/"DELETE" , //default "POST"
	  		preAjax(name, params){return params;}
			postAjax(name, params, cbFn), 
			onsuccess(data,cbFn, params), 
			onfail(data, failFn, params)
		}]	
	 	@return : function(name, params, cbFn, failFn){}
		@sub-params :params {
			...
			_channel_ : assign to temporary channel to prevent duplicate call;
		}
 * };
 */

function createAjaxProxy(){
	if (window.XMLHttpRequest)
		return new window.XMLHttpRequest();
	if (typeof ActiveXObject == "undefined")
		return null;
	// IE
	var xmlhttpObj = ['MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'];
	for (var i = 0, len = xmlhttpObj.length; i < len; i++) {
		try{
			var proxy =  new window.ActiveXObject(xmlhttpObj[i]);
			if (proxy)
				return proxy;
		}catch(e){}
	}
	return null;
}
var isPhoneGapOnAppleHD = IX.nsExisted("IX.PhoneGap") && IX.isAppleHD;
function ajaxLoading(){
	//Show statusBar network status for iOS
	if (isPhoneGapOnAppleHD)
		window.location="myspecialurl:start";
}
function ajaxLoaded(){
	//Cancel statusBar network status for iOS
	if(isPhoneGapOnAppleHD)
		window.location="myspecialurl:end";
}

var r20 = /%20/g,
	rbracket = /\[\]$/,
	PATTERN_ESCAPED = /["'%\1-\x1f]/g;
function escapeText(text) {
	return (text)? text.replace(PATTERN_ESCAPED, function(c){
		var x=c.charCodeAt(0); return (x<16? "%0": "%")+x.toString(16); 
	}) : "";
}
function ajaxParam(a, traditional) {//traditional : 规定是否使用传统的方式浅层次的进行序列化（参数序列化），默认为 false(深层次)
	if (typeof(a) === 'string') {//处理JSON Params
		return escapeText(a);
	} else {
		var s = [],
		add = function( key, value ) {
			if(IX.isFn( value )) return;
			s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		};
		if ( traditional === undefined )
			traditional = false;
		if ( IX.isArray( a ) || ( !IX.isObject( a ) ) ) {
			IX.each( a, [],function(acc, name, value, idx) {
				if (!a.hasOwnProperty || a.hasOwnProperty(value))
				add( name, value );
			} );
		} else {
			for ( var prefix in a )
				buildAjaxParams( prefix, a[ prefix ], traditional, add );
		}
		return s.join( "&" ).replace( r20, "+" );
	}
}
function buildAjaxParams( prefix, obj, traditional, add ) {
	if ( IX.isArray( obj ) && obj.length ) {
		IX.each( obj, [],function(acc, v, name, i) {
			if ( traditional || rbracket.test( prefix ) )
				add( prefix, v );
			else
				buildAjaxParams( prefix + "[" + ( typeof v === "object" || IX.isArray(v) ? i : "" ) + "]", v, traditional, add );
		});
	} else if ( !traditional && obj !== null && typeof obj === "object" ) {
		if ( IX.isArray( obj ) || IX.isEmpty( obj ) )
			add( prefix, "" );
		else {
			for ( var name in obj )
				buildAjaxParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}
	} else
		add( prefix, obj );
}

var ajaxHT = new IX.IListManager();
function ajaxProxyStateChange(proxy, callback, failCbFn){
	var timer = proxy.timer;
	if (proxy.readyState == 4) {
		if(proxy.status == 200){
			if (debugIsAllow('ajax'))
				IX.log("ajaxProxyStateChange: "+ proxy.status + " " + proxy.responseText);
			clearTimeout(timer);
			proxy.timer = null;
			callback(proxy.responseText, proxy);
		}else{
			if (timer)
				clearTimeout(timer);
			failCbFn({
				retCode: 0,
				err : "AJAX fail",
				ajaxStatus: proxy.status
				//isTimeout: false
			}, proxy);
		}
	}
	ajaxHT.remove(proxy.id);
	proxy = null;
	ajaxLoaded();
}

var DefaultAjaxContentType = "application/x-www-form-urlencoded";
var ajaxArray = [];
function ajaxCall(cfg){
	var type = cfg.type || "GET";
	var failFn =  $XF(cfg, "fail");
	var params = ajaxParam(cfg.data);
	var url = cfg.url;
	if(type == "GET")
		url = url + "?" + params;
	
	var proxy = createAjaxProxy();
	if(!proxy){
		IX.err("unsupport AJAX. Failed");
		return failFn({
			retCode : 0,
			err: "unsupport AJAX. Failed"
		});
	}

	ajaxArray.push(proxy);
	proxy.timer = setTimeout(function(){
		failFn({
			retCode: 0,
			err: "timeout AJAX. Failed",
			isTimeout: true
		});	    
	}, 60000);
	proxy.onreadystatechange = function(){
		ajaxProxyStateChange(proxy, $XF(cfg, "success"), failFn);
	};

	try{
		proxy.open(type, url, "async" in cfg ? cfg.async : true);
		IX.each(cfg.headers || {}, {}, function(acc, value, key){
			proxy.setRequestHeader(key, value);
			return acc;
		});
		proxy.setRequestHeader("Content-type", $XP(cfg, "contentType", DefaultAjaxContentType));
		proxy.send(params);
		
		proxy.id = IX.id();
		ajaxHT.register(proxy.id, proxy);
		ajaxLoading();
	}catch(ex){
		failFn({
			retCode : 0,
			err:ex.message
		});
		ajaxLoaded();
	}
}

IX.Ajax = {
	request : function(cfg){
		ajaxCall({
			url: cfg.url,
			type: cfg.type,
			contentType : cfg.contentType || null,
			headers : IX.inherit({
				"Accept": "application/json"
			}, cfg.headers),
			data: cfg.data,
			fail : cfg.fail,
			success: function(responseTxt) {
				var succFn = $XF(cfg.success);
				try{
					succFn(JSON.parse(responseTxt));
				}catch(e) {
					succFn({
						retCode : 1,
						text : responseTxt
					});
				}
			}
		});
	},
	stopAll :function(){
		ajaxHT.iterate(ajaxArray, function(proxy){
			proxy.abort();
			ajaxHT.remove(proxy.id);
			proxy = null;
		});
		ajaxHT.clear();
		ajaxArray = []; 
	}
};

function loadFn(durl, cbFun){
	ajaxCall({
		url: durl,
		type: "GET",
		success: cbFun
	});
}
function _afterLoadJsFn(script, nextFn){
	if (!script.readyState){
		 script.onload= nextFn;
		 return;
	}
	// IE
	script.onreadystatechange= function () {
		if (debugIsAllow('net'))
			IX.log("STATE: [" +script.src +"]:" +  this.readyState);
		if (script.readyState == 'complete' || script.readyState == 'loaded') {
			script.onreadystatechange = null;
			nextFn();
		}
	};
}
var _head= document.getElementsByTagName('head')[0];
function loadJsFn(durl, nextFn){
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= durl;
	if (IX.isFn(nextFn))
		_afterLoadJsFn(script, nextFn);
	_head.appendChild(script);
}
function loadJsFilesInSeqFn(jsFiles, nextFn){
	var _nextFn = IX.isFn(nextFn)?nextFn:IX.emptyFn;
	if (!jsFiles || jsFiles.length===0)
		return _nextFn();
	var n = jsFiles.length;
	var idx =0;
	var fn = function(){
		loadJsFn(jsFiles[idx], function(){
			idx +=1;
			return (idx<n)?fn():_nextFn();
		});
	};
	fn();
}
function loadCssFn(cssFile){
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = cssFile;
	cssNode.media = 'screen';
	_head.appendChild(cssNode);
}
function tryExecute(fnName, argList, dependencyConfig){
	var fn = function(){				
		IX.execute(fnName, argList);
		IX.tryFn(dependencyConfig.afterFn);
	};
	if (IX.nsExisted(fnName))
		return fn();
	if (!dependencyConfig){
		return;
	}
	var config = dependencyConfig;
	IX.tryFn(config.beforeFn);
	IX.iterate(config.cssFiles, loadCssFn);
	var delay = config.delay || 100;
	loadJsFilesInSeqFn(config.jsFiles, function(){
		setTimeout(fn, delay);
	});
}

IX.Net = {
	loadFile:loadFn,
	loadCss:loadCssFn,
	loadJsFiles:function(jsFiles, nextFun, mode){
		//if (!mode || mode=="seq" ){
			loadJsFilesInSeqFn(jsFiles, nextFun);
		//}
	},
	tryFn:tryExecute
};

// IX.ajaxEngine && IX.urlEngine
function defaultParamFn(_name, _params){return _params;}
function defaulRspFn(data, cbFn){if (IX.isFn(cbFn)) cbFn(data);}
function getFunProp(_cfg, _name, defFn){
	var _fn = $XP(_cfg, _name);
	return IX.isFn(_fn)?_fn :defFn;
}

function urlRouteFn(routeDef, ifAjax){
	var _url = $XP(routeDef, "url");
	if (IX.isEmpty(_url))
		return null;
	var route = ifAjax ? {
		channel : $XP(routeDef, "channel"),
		type : $XP(routeDef, "type", "POST"),
		dataType : $XP(routeDef, "dataType", "form"),
		onsuccess : getFunProp(routeDef, "onsuccess", defaulRspFn),
		preAjax : getFunProp(routeDef, "preAjax", defaultParamFn),
		postAjax : $XF(routeDef, "postAjax"),
		onfail : getFunProp(routeDef, "onfail", defaulRspFn)
	} : {};
	route.url = _url;
	route.urlType = $XP(routeDef, "urlType", "base") + "Url";	
	return route;	
}
function createRouteHT(routes, ifAjax){
	return IX.loop(routes, {}, function(acc, routeDef){
		var _name = $XP(routeDef, "name");
		if (IX.isEmpty(_name))
			return acc;
		var route = urlRouteFn(routeDef, ifAjax);
		if (route)
			acc [_name] = route;
		return acc;
	});
}

var urlFac = (function UrlFactory(){
	var _urls = {};
	var genUrl = function(_route, params){
		if (!_route)
			return "";
		var url = _route.url;
		var _url = IX.isFn(url)?url(params):url.replaceByParams(params);
		var _urlBase = (_route.urlType in _urls)?_urls[_route.urlType] : _urls.baseUrl;
		return _urlBase + _url;
	};
	return {
		init : function(cfg){_urls = IX.inherit(_urls, cfg);},
		genUrl : genUrl
	};
})();

function createUrlRouter(routes){
	var _routeHT = createRouteHT(routes);
	return function(_name, params){
		return urlFac.genUrl(_routeHT[_name], params);
	};
}

function tryLockChannel(channel){
	if (IX.isEmpty(channel))
		return true;
	var id = "ajaxChannel_" + channel;
	if ($X(id))
		return false;
	IX.createDiv(id, "ajax-channel");
	if (debugIsAllow("channel"))
		IX.log ("lock channel: " + channel);
	return true;
}
function unlockChannel(channel){
	if (IX.isEmpty(channel))
		return;
	var el = $X("ajaxChannel_" + channel);
	if (el)
		el.parentNode.removeChild(el);
	if (debugIsAllow("channel"))
		IX.log ("unlock channel: " + channel);
}
function tryJSONParse(data){
	if (IX.isString(data))
		try{return JSON.parse(data);}catch(e){}
	return data;
}
function executeCaller(_caller, _ajaxFn, _name, params, cbFn, failFn){
	var channel = $XP(params, "_channel_", _caller.channel);
	if (!tryLockChannel(channel))
		return _caller.onfail({
			retCode : 0,
			err : "channel in using:"+ channel
		}, failFn, params);	
	
	var _cbFn = IX.isFn(cbFn) ? cbFn : IX.emptyFn;
	var isJson = _caller.dataType == 'json';
	var _data = _caller.preAjax(_name, params);
	_ajaxFn({
		url : urlFac.genUrl(_caller, params),
		type :  _caller.type,
		contentType : isJson ? 'application/json' : 'application/x-www-form-urlencoded',
		data : isJson ? JSON.stringify(_data) : _data,
		success : function(data) {
			unlockChannel(channel);
			var _data = tryJSONParse(data);
			if (_data.retCode!=1)
				_caller.onfail(_data, failFn, params);
			else
				_caller.onsuccess(_data, _cbFn, params);
		},
		fail: function(data){
			unlockChannel(channel);
			_caller.onfail(tryJSONParse(data), failFn, params);
		},
		error: function(data, errMsg, error){
			unlockChannel(channel);
			console.error(error);
			_caller.onfail({
				retCode : 0,
				err : error.message
			}, failFn, params);
		}
	});
	_caller.postAjax(_name, params, _cbFn);
}

var _ajaxEngineFn = null;
function initAjaxEngine(cfg){
	if (cfg && IX.isFn(cfg.ajaxFn))
		_ajaxEngineFn = cfg.ajaxFn;
	urlFac.init(cfg);		
}
function createAjaxCaller(routes){
	var _callerHT = createRouteHT(routes, true);
	return function(_name, params, cbFn, failFn){
		var _caller = _callerHT[_name];
		if (!_caller || !IX.isFn(_ajaxEngineFn))
			return;
		if (!$XP(params, '_t')) 
			params = IX.inherit(params, {_t : IX.getTimeInMS()});
		executeCaller(_caller, _ajaxEngineFn, _name, params, cbFn, failFn);
	};
}

IX.urlEngine = {
	init : urlFac.init,
	reset : urlFac.init,	
	createRouter : createUrlRouter	
};
IX.ajaxEngine ={
	init : initAjaxEngine,
	reset : initAjaxEngine,
	createCaller: createAjaxCaller
};

})();
(function(){
/**  
 * IX constant can be access anywhere;
 * 		IX_SCRIPT_PATH
 */

/**
 * IX.Util.Image is an utilities to deal with image data. It only support on HTML5 browsers:
 	getData(imgEl, cfg): 
 		cfg : {width, height}
	  	return : {url, w, h, data}
	setData(imgEl, imgData, keepRatio)
 * };
 */
function _getImageDataUrl(img,cw,ch, w, h){
	var canvas = document.createElement("canvas");
	canvas.width = cw;  
	canvas.height = ch;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, (cw-w)/2, (ch-h)/2, w, h);
	var dataURL = canvas.toDataURL("image/png");
	canvas.parentNode.removeChild(canvas);
	canvas = null;
	return dataURL;
}
function getRatioWH(w, h, rw, rh){
	var wratio = w/rw, hratio = h/rh;
	if (wratio>=1 && hratio>=1)
		return [rw, rh];
	wratio = Math.min(wratio, hratio);
	return [rw * wratio, rh *wratio];		
}

function getImageData(imgEl, cfg){
	if (!imgEl)
		return null;
	var img = new window.Image();
	img.src = imgEl.src;
	var wh =getRatioWH($XP(cfg, "width", img.width), $XP(cfg, "height", img.height), img.width, img.height);
	if (wh[0] * wh[1] === 0)
		return null;
	var dataURL = _getImageDataUrl(img, wh[0], wh[1], wh[0], wh[1]);
	return {
		url : imgEl.src,
		w: wh[0], 
		h: wh[1],
		data : dataURL
	};
}
function setImageData(imgEl, imgData, keepRatio){
	if (!imgEl)
		return;
	var img = new window.Image();
	img.src = imgData.data;
	var cwEl = keepRatio?imgEl:img;
	var wh =getRatioWH(cwEl.width, cwEl.height, img.width, img.height);
	var dataURL = _getImageDataUrl(img,cwEl.width, cwEl.height, wh[0], wh[1]);
	imgEl.src = dataURL;
}
IX.ns("IX.Util");
IX.Util.Image =  {
	getData : getImageData,
	setData : setImageData
};

var getIXScriptEl = function(){
	if ("scripts" in document) {
		var scripts =document.scripts;
		for(var i=0; i<scripts.length; i++) {
			if (scripts[i].src.indexOf(IX_SCRIPT_NAME)>=0)
				return scripts[i];
		}
	}
	var head = $XD.first(document.documentElement, "head");
	var ixEl = $XD.first(head, "script");
	while(ixEl){
		if (ixEl.src.indexOf(IX_SCRIPT_NAME)>=0)
			break;			
		ixEl = $XD.next(ixEl, "script");
	}
	return ixEl;
};

var ixEl = getIXScriptEl();
var path = ixEl?ixEl.src:"";
window.IX_SCRIPT_PATH = path.substring(0, path.indexOf(IX_SCRIPT_NAME)); 
})();
