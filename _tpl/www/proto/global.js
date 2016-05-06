(function(){
var nsGlobal = IXW.ns("Global");

var baseUrl = IXW_BaseUrl + "/sim";
var imgUrl = IXW_BaseUrl + "/src/images";

IXW.ajaxEngine.init({
	ajaxFn : jQuery.ajax,
	baseUrl : baseUrl,
	imgUrl : imgUrl
});

IXW.urlEngine.mappingUrls([
["uploadImg", "/uploadImg.html"]
]);
nsGlobal.filUploadUrl = IXW.urlEngine.genUrl("uploadImg"); // or baseUrl + "/uploadImg.html"

IXW.ajaxEngine.mappingUrls("common", [
["session", "/sessionData.json", "", "GET", "form"]
]);

nsGlobal.entryCaller = function(name, params, cbFn, failFn){
	var remotefile = null;
	switch(name){
	case "login"://params : {username, password}
		if (params.username == "admin" && params.password == "123456")
			remotefile = baseUrl + "/sessionData.json";
		else
			remotefile = baseUrl + "/failLogin.json";
		break;
	case "logout":
		return cbFn();
	}
	IX.Net.loadFile(remotefile, function(txt){
		var ret = JSON.parse(txt);
		if (ret.retCode != 1)
			IX.isFn(failFn)?failFn(ret) : alert(ret.err);
		else
			cbFn(ret.data);
	});
};

nsGlobal.commonCaller = IXW.ajaxEngine.createCaller("common",[
"common-session"
]);

nsGlobal.serviceCaller = function(name, params, cbFn, failFn){
	switch(name){
	case "getModule":
		setTimeout(function(){
			cbFn({name : params.name, desc : "desc for " + params.name});
		}, 1000);
		break;
	}
};

})();