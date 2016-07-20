/*
 * IXW library  
 * https://github.com/lance-amethyst/IXW
 *
 * Copyright (c) 2015 Lance GE, contributors
 * Licensed under the MIT license.
 */
(function(){
IX.ns("IXW");
var RouteAttrDefValue = {name :"", url : "", urlType : "base", type : "GET", "dataType" : "json"};
// columns : ["name", "url", "urlType"] , // or  ["name", "url", "urlType", "type", "dataType"]
function parseRouteDef(columns, urlDef){
	return IX.loop(columns, {}, function(acc, name, idx){
		var _value = urlDef.length>idx?urlDef[idx]:null;
		acc[name] = IX.isEmpty(_value) ? RouteAttrDefValue[name] : _value;
		return acc;
	});
}
function UrlStore(columns){
	var _routes = new IX.IListManager();
	function _map(category, urlList){IX.iterate(urlList, function(urlDef){
		var name = urlDef[0];
		if (IX.isEmpty(name))
			return;
		var channelName = category + "-" + name;
		var routeDef = parseRouteDef(columns, urlDef);
		routeDef.channel =channelName;
		_routes.register(channelName, routeDef);
	});}
	return {
		map : _map,
		getAll : _routes.getAll,
		get :  _routes.get
	};
}

var urlEngine = IX.urlEngine, urlStore = new UrlStore(["name", "url", "urlType"]);
var ajaxEngine = IX.ajaxEngine, ajaxStore = new UrlStore(["name", "url", "urlType", "type", "dataType"]);

function initEngine (cfg){
	//urlEngine.init(cfg);
	ajaxEngine.init(cfg);
}

var urlGenerator = null; //function(name, params){return "";};
function _urlGenerator(name, params){
	return  IX.isFn(urlGenerator)?urlGenerator(name, params):"";
}

IXW.urlEngine = {
	init : initEngine,
	reset :initEngine,
	/**  urlList : [ [name, url, urlType], ...]  */
	mappingUrls : function(urlList){
		urlStore.map("", urlList);
		urlGenerator = urlEngine.createRouter(urlStore.getAll());
	},
	genUrls : function(names){
		return IX.map(names, function(name){return _urlGenerator(name, {});});
	},
	genUrl : _urlGenerator
};

var DefAjaxSetting= {
	preAjax : function(name, params){return params;},
	onsuccess : function(data, cbFn, params){
		cbFn(data.data);
	},
	onfail: function(data){
		switch(data.retCode){
		case -401: //无权查看的页面
			return IXW.Pages.reload("401");
		case -404: //未找到的页面
			return IXW.Pages.reload("404");
		}
	}
};
/** routeDef : "routeName" or  {
 * 		name:  "name",
 * 		channel: "",
 * 		url : function(params){},
 * 		preAjax : function(name, params){return paramsl;}, // default null;
 * 		postAjax : function(name, params, cbFn){}, //default null;
 * 		onsuccess : function(data,cbFn, params), 
 * 		onfail : function(data, failFn, params) // default null;
 *  }
 *	routeName =  category + "-" + name;
 */
function createAjaxEntries(category, routes){
	function _convert(routeDef){
		var isRef = IX.isString(routeDef);
		return IX.inherit(ajaxStore.get(isRef?routeDef:(category + "-"+ routeDef.name)), DefAjaxSetting, isRef?{}:routeDef);
	}
	return ajaxEngine.createCaller(IX.map(routes, _convert));
}

IXW.ajaxEngine = {
	init : initEngine,
	reset :initEngine,
	resetSetting : function(settings){IX.extend(DefAjaxSetting, settings);},
	/**  urlList : [ [name, url, urlType, type], ...]  */
	mappingUrls : ajaxStore.map, //function(category, urlList)
	createCaller :  createAjaxEntries //function(category, routes)
};
})();