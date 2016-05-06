/*
 * IXW Session  
 * https://github.com/lance-amethyst/IXW
 *
 * Copyright (c) 2015 Lance GE, contributors
 * Licensed under the MIT license.
 */
(function(){
IX.ns("IXW");
var isFoundInArray = IX.Array.isFound;
var smClass = function DefaultSessionManager(data){
	var sessionData = data;
	var userName = $XP(data, "name", "");
	var userId = $XP(data, "id", null);
	var enabledModules = $XP(data, "modules", []);

	return {
		hasAuth : function(){return userId !== null;},
		getUserName : function(){return userName;},
		getUserId : function(){return userId;},
		checkIfModuleEnabled : function(module){
			return enabledModules == "all"   || isFoundInArray(module, enabledModules);
		}
	};
};

var sessionMgr = new smClass();
var clearSessionFn = null;
var startSessionFn = null;
var loadSessionFn = null;

/** cfg : {
		load : //MUST: function(cbFn)
		managerClass : //optional: function(data)
		onstart: // optional : function()
		onclear: // optional : function()
	}
 */
function configSession(cfg){
	if (!IX.isFn(cfg.load)){
		alert("Session loader must be applied to IXW.Session!");
		return;
	}
	loadSessionFn = cfg.load;

	if (IX.isFn(cfg.managerClass)){
		smClass = cfg.managerClass;
		sessionMgr = new smClass();
	}
	if (IX.isFn(cfg.onclear))
		clearSessionFn = cfg.onclear;
	if (IX.isFn(cfg.onstart))
		startSessionFn = cfg.onstart;
}
function resetSession(data){
	sessionMgr = new smClass(data);
	IX.isFn(startSessionFn) && startSessionFn(data);
}
function clearSession(){
	sessionMgr = new smClass();
	IX.isFn(clearSessionFn) && clearSessionFn();
}
function loadSession(cbFn){
	loadSessionFn(function(data){
		if (!data || !data.id)
			return clearSession();
		resetSession(data);
		cbFn();
	});
}

IXW.Session = {
	config : configSession,
	get : function(){return sessionMgr;},
	clear : clearSession,
	reset : resetSession,
	load : loadSession,
	reload : function(){
		loadSession(function(){
			IXW.Pages.reload();
		});
	},
	isValid : function(){return sessionMgr.hasAuth();}
};

})();