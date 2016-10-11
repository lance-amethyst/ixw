(function(){
var nsGlobal = IXW.ns("Global"); // <PKGName>.Global

var urlEngine = IXW.urlEngine;
var ajaxEngine = IXW.ajaxEngine;
var ajaxMapping = ajaxEngine.mappingUrls;
var ixwCreateCaller = ajaxEngine.createCaller;
var ixwSession = IXW.Session;

var baseUrl = IXW_BaseUrl;
var imgUrl = IXW_BaseUrl + "/images";

ajaxEngine.init({
	ajaxFn : jQuery.ajax,
	baseUrl : baseUrl
});

nsGlobal.fileUploadUrl = baseUrl + "/upload";
nsGlobal.getFileUrl = function(filename){
	return baseUrl + "/api/download/" + filename;
};
function commonInformation(msg, btnName){
	alert(msg);
	ixwSession.reload();
}
function commonAlert(msg){
	alert(msg);
}
function createCaller(base, list){
	return ixwCreateCaller(base, IX.map(list, function(name){
		if (IX.isString(name))
			return base + "-" + name;
		return name;
	}));
}
ajaxEngine.resetSetting({
	onfail : function(data, failFn){
		if(data.retCode == -2){
			if(IX.isFn(failFn) && !failFn(data))
				return;
			return commonInformation("网络中断，请检查网络或者服务器是否正常！", "重试");
		}
		if(data.retCode === 0){
			if(IX.isFn(failFn))
				return failFn(data);
			return commonAlert(data.err);
		}
		if(data.retCode == -1){
			//if(TNM.Env.getLocalStroage() != "undefined-null")
				return commonInformation("与服务器失去联系，请重新登录!", "确定");
		}
	}
});

ajaxEngine.mappingUrls("common", [
	["session",		"/session/check"],
	["login",		"/session/login",	"base",	"POST"],
	["logout",		"/session/logout",	"base",	"POST"]
]);

nsGlobal.entryCaller = createCaller("common", ["login","logout"]);
nsGlobal.commonCaller = createCaller("common",[{
	name : "session",
	onfail : function(){ixwSession.clear();}
}]);

ajaxEngine.mappingUrls("service", [
	["getModule",	"/api/module/{name}"]
]);

nsGlobal.serviceCaller = createCaller("service",[
	"getModule"
]);

})();