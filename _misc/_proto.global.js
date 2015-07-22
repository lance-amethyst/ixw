(function(){
IX.ns("{NS}.Global");

var baseUrl = {NS}_BaseUrl + "/sim";
var imgUrl = {NS}_BaseUrl + "/src/images";

IXW.ajaxEngine.init({
	ajaxFn : jQuery.ajax,
	baseUrl : baseUrl,
	imgUrl : imgUrl
});

IXW.urlEngine.mappingUrls([
["uploadImg", "/uploadImg.html"]
]);
{NS}.Global.filUploadUrl = IXW.urlEngine.genUrl("uploadImg"); // or baseUrl + "/uploadImg.html"

IXW.ajaxEngine.mappingUrls("common", [
["session", "/sessionData.json", "", "GET", "form"]
]);

{NS}.Global.entryCaller = function(name, params, cbFn, failFn){
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

{NS}.Global.commonCaller = IXW.ajaxEngine.createCaller("common",[
"common-session"
]);

})();