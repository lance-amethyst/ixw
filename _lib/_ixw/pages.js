/*
 * IXW library  
 * https://github.com/lance-amethyst/IXW
 *
 * Copyright (c) 2015 Lance GE, contributors
 * Licensed under the MIT license.
 */
(function(){
IX.ns("IXW.Pages");

var DefaultPageName = null;
var Path2NameMapping = {};
var PageConfigurations = {};
var PageParamKeys = {};

function _checkDyncPath(_p){
	var l = _p.length;
	return l>2 && _p.charAt(0)=="{" && _p.charAt(l-1) == "}" ?_p.substring(1, l-1) : null;
}
function _splitPath(_path){
	return IX.Array.compact(_path.split("/"));
}
function mapPageConfig(_name, cfg){
	var _pathFormat = cfg.path.replace(/\./g, "#");
	if (IX.isEmpty(_name) || IX.isEmpty(_pathFormat))
		return false;
	var keys = [];

	var _arr = IX.map(_splitPath(_pathFormat), function(_p){
		var dp = _checkDyncPath(_p);
		if (dp) keys.push(dp);
		return dp ? "*" : _p;
	});
	_arr.push("#");

	IX.setProperty(Path2NameMapping, _arr.join("."), _name);
	Path2NameMapping["#" + _pathFormat] = _name;
	PageConfigurations[_name] = cfg;
	if (keys.length>0)
		PageParamKeys[_name] = keys;
	if (cfg.isDefault)
		DefaultPageName = _name;
	return true;
}

function getNameByPath(path){
	var obj = Path2NameMapping;
	IX.iterbreak(_splitPath(path), function(item){
		if (item in obj) obj = obj[item];
		else if ("*" in obj) obj = obj["*"];
		else{
			obj = null;
			throw IX;
		}
	});
	return (obj && "#" in obj) ? obj["#"] : null;
}
function getPageParams(_pathFormat, path){
	var params = {
		_name : Path2NameMapping["#" + _pathFormat.replace(/\./g, "#")]
	};
	var arr = _splitPath(_pathFormat), 
		_arr = _splitPath(path);
	IX.iterate(arr, function(_p, idx){
		var dp = _checkDyncPath(_p);
		if(dp) params[dp] = _arr[idx] == "-" ? "" : _arr[idx];
	});
	return params;
}
function getPathByName(name, params){
	var cfg = PageConfigurations[name];
	if (!cfg){		
		console.error("Can't find route : " + name);
		return "";
	}
	return IX.loop(PageParamKeys[name] || [], cfg.path, function(acc, key){
		return acc.replace('{' + key + '}', $XP(params, key, "") || "-");
	});
}

function checkPageConfigs(pageConfigs, done){
	var ht = new IX.I1ToNManager();
	var fnames = [];

	function _detect(name, fname){
		var _fn = null;
		if (IX.isFn(fname))
			_fn = fname;
		else if (!IX.isString(fname))
			return IXW.alert("Configuration failed : invalid Page initialized for " + name);
		else if (IX.nsExisted(fname))
			_fn = IX.getNS(fname);
		
		if (IX.isFn(_fn)) {
			PageConfigurations[name].init = _fn;
			return;
		}
		ht.put(fname, name);
		fnames.push(fname);
	}
	function _checkItem(acc, fname){
		var _fn = IX.getNS(fname);
		if (!IX.isFn(_fn)) {
			acc.push(fname);
			return acc;
		}
		IX.iterate(ht.get(fname), function(_name){
			PageConfigurations[_name].init = _fn;
		});
		ht.remove(fname);
		return acc;
	}
	
	IX.iterate(pageConfigs, function(cfg){
		var _name = cfg.name;
		if (!mapPageConfig(_name, cfg))
			return;;

		var _pageInit = "initiator" in cfg? cfg.initiator : null;
		if (IX.isString(_pageInit))
			_detect(_name, _pageInit);
		else if (!IX.isFn(_pageInit))
			IXW.alert("Configuration : error page initiator for " + _name);
	});
	fnames = IX.Array.toSet(fnames);		
	IX.checkReady(function(){
		fnames = IX.loop(fnames, [], _checkItem);
		return fnames.length==0;
	}, done, 40, {
		maxAge : 15000, //15 seconds
		expire : function(){ 
			IXW.alert("Can't find page initalizor: \n" + fnames.join("\n"));
		}
	});
}

var isSupportPushState = "pushState" in window.history; 
function _updByContext(_context, isNew){
	var path = _context.path;
	// console.log((isNew?"push state :" : "replace state :") + path);
	if (isSupportPushState )
		window.history[isNew ? "pushState" : "replaceState"](_context, "", "#" + path);
	else if (isNew)
		document.location.hash = path;
}
function _loadByContext(_context, _saveFn, cbFn){
	//console.log("_load: " + _context.path + "::" + !!_saveFn);
	var cfg = PageConfigurations[_context.name];
	var pageParams = $XP(_context, "page", {});

	var _bodyClz = $XP(cfg, "bodyClz", "");
	if (document.body.className != _bodyClz)
		document.body.className = _bodyClz;	

	var navRefresh = $XP(cfg, "nav");
	if (IX.isString(navRefresh))
		navRefresh = IXW.Navs.getInstance(navRefresh);
	if (IX.isFn(navRefresh))
		navRefresh(cfg, pageParams);

	IXW.ready(cfg.init, function(initFn){
		if (!IX.isFn(initFn))
			return IXW.alert("in Framework: " + initFn  + " is not function");
		_context.serialNo = IX.UUID.generate();
		(_saveFn || IX.emptyFn)(_context);

		initFn(cfg, pageParams, cbFn || IX.emptyFn);
		window.scrollTo(0, 0); //after jump page ,scroll reset to (0,0)
	});
}

function PageHelper(){
	var isInitialized = false;
	var context = null; //{name, path, page, serialNo}
	var pageAuthCheckFn = function(){return true;};

	function resetContext(_context){
		$XF(context && PageConfigurations[context.name], "switchOut")(context, _context);
		context = _context;
	}
	function _loadByPath(path, isNewRec, cbFn){
		var name = getNameByPath(path) || DefaultPageName,
			cfg = PageConfigurations[name];
		if(!pageAuthCheckFn(name, cfg))
			return;
		//console.log('load:' + path + ":::" +name);
		isInitialized = true;
		_loadByContext({
			path : path,
			name :  name,
			page : getPageParams(cfg.path, path)
		}, function(_context){
			resetContext(_context);
			_updByContext(_context, isNewRec);
		}, cbFn);
	}
	function _loadByState(state, cbFn){
		var name = (state && state.name) || DefaultPageName;
		var cfg = PageConfigurations[name];
		if(!pageAuthCheckFn(name, cfg))
			return IXW.alert("该页面已经失效，无法浏览。请登录之后重新尝试。")
		isInitialized = true;
		_loadByContext(state || cfg, resetContext, cbFn);
	}
	function _stateChange(e){
		//console.log("popstate:",e, e.state);
		if (!history.state && !e.state) {
			var path = document.location.hash.substring(1);
			_loadByPath(path.length>0?path:"");
			return;
		}
		var state = e.state;
		if (!isInitialized) 
			resetContext(state);
		else
			_loadByState(state, IX.emptyFn);
	}
	function _hashChange(e){
		//console.log("onhashchange:", e, context);
		if (!(context && "serialNo" in context)) //hashchanged by pop state
			return;
		// if (window.history.state && window.history.state.path == e.newURL.split('#')[1]) 
		// 	return;
		var path = e.newURL.split("#");
		_loadByPath(path.length>1?path[1]:"");
	}

	if (isSupportPushState)
		window.onpopstate= _stateChange;
	else if ("onhashchange" in window)	
		window.onhashchange = _hashChange;

	return {
		init : function(authCheckFn){pageAuthCheckFn = authCheckFn;},
		start : function(cbFn){
			if (context)
				return _loadByState(context, cbFn);
			_loadByPath(document.location.hash.replace(/^#/, ''), false, cbFn);
		},
		reload : function(name, params){
			if (arguments.length>0)
				 _loadByPath(getPathByName(name, params), true);
			else
				_loadByPath(context.path);
		},
		load : function(path, cbFn){_loadByPath(path || "", true, cbFn);},
		getCurrentContext : function(){return context;},
		getCurrentName : function(){return $XP(context, "name");},
		getCurrentPath : function(){return $XP(context, "path");},
		isCurrentPage : function(hash){return hash == $XP(context, "path");}
	};
}
var pageHelper = new PageHelper();

function jumpFor(el, evt){
	var _href = $XD.dataAttr(el, "href");
	if (IX.isEmpty(_href))
		return;	
	var ch = _href.charAt(0), name = _href.substring(1);
	if (ch ==="~"){ // pop up panel
		var instance = IXW.Popups.getInstance(name);
		instance && instance.show(el);
	} else if (ch ==='+') // open new window
		IXW.openUrl(document.location.href.split("#")[0] + "#" + name);
	else if(ch === '$') // do named actions
		IXW.Actions.doAction(name, {key : $XD.dataAttr(el, "key")}, el, evt);
	else if (!pageHelper.isCurrentPage(_href))
		pageHelper.load(_href);
}
/**  
pageConfigs : [{
	name: "prjConfig", 
	path: "projects/{key}/config", 
	initiator : "Prj.Project.init",
	[Optional:]
	isDefault : true/, default false
	bodyClz : "minor projectPage projectConfigPage",
	nav : "String" or function navRefresh(){}
	...
	[user-defined page config :]
	needAuth : true/false
	}]
pageAuthCheckFn :function(name, cfg)
 *
 */
IXW.Pages.configPages = function(pageConfigs, pageAuthCheckFn){
	checkPageConfigs(pageConfigs, IX.emptyFn);
	if (IX.isFn(pageAuthCheckFn))
		pageHelper.init(pageAuthCheckFn); 
};
IXW.Pages.createPath = getPathByName;	
IXW.Pages.start = pageHelper.start;
IXW.Pages.load = pageHelper.load;
IXW.Pages.reload = pageHelper.reload;

IXW.Pages.getCurrentContext = pageHelper.getCurrentContext;
IXW.Pages.getCurrentName = pageHelper.getCurrentName;
IXW.Pages.getCurrentPath = pageHelper.getCurrentPath;
IXW.Pages.isCurrentPage = pageHelper.isCurrentPage;

IXW.Pages.jump = jumpFor;
IXW.Pages.listenOnClick = function(el){
	IX.bind(el, {click : function(e){
		var _el = $XD.ancestor(e.target, "a");
		_el && jumpFor(_el, e);
	}});
};
IXW.Pages.bindOnInput = function(inputEl, handlers){
	if ($XD.dataAttr(inputEl, "binded"))
		return;
	$XD.setDataAttr(inputEl, "binded", "true");
	IX.bind(inputEl, handlers);
};
})();