/*
 * IXW library  
 * https://github.com/lance-amethyst/IXW
 *
 * Copyright (c) 2015 Lance GE, contributors
 * Licensed under the MIT license.
 */
(function(){
IX.ns("IXW");

IXW.ready = function(_fname, fn){
	var fname = _fname;
	IX.checkReady(function(){
		if (IX.isString(fname) && IX.nsExisted(fname))
			fname = IX.getNS(fname);
		return IX.isFn(fname);
	}, function(){
		fn(fname);
	}, 40, {
		maxAge : 15000, //15 seconds
		expire : function(){fn(fname);}
	});
};

IXW.openUrl = function openUrl(url) {
	window.open(url);
};

function CmpManager(){
	var ht = {};
	return {
		register : function(name, cmpClz){ht[name] = cmpClz;},
		getInstance : function(name){return ht[name];}
	};
}

IXW.Popups = new CmpManager();
IXW.Popups.defInstance = {
	setOffset :function(el){},
	show : function(el){},
	hide : function(){},
	toggle : function(){},
	destory : function(){}
};
IXW.Navs = new CmpManager();
IXW.Navs.AbsNavRefresh = function(cfg, pageParams){};

/**  
actionConfigs : [
	["name", function()], ...
]
*/
var actionsHT = new IX.IListManager();
function newAction(cfg){
	var name = cfg[0], handler = cfg[1];
	if (IX.isEmpty(name))
		return;
	if (IX.isString(handler))
		handler = IX.getNS(handler);
	if (!IX.isFn(handler)) {
		if (actionsHT.hasKey(name))
			return;
		handler = IX.emptyFn;
	}
	actionsHT.register(name, handler);
}
IXW.Actions = {
	configActions : function(actionConfigs){
		IX.iterate(actionConfigs, newAction);
	},
	doAction : function(name, params, el, evt){
		var fn = actionsHT.get(name);
		if (IX.isFn(fn))
			fn(params, el, evt);
	}
};
})();