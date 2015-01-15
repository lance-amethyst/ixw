(function(){
function getRequestFn(){
	if ("XMLHttpRequest" in window) {
		return new XMLHttpRequest();
	}
	if ("ActiveXObject" in window){
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	return null;
}
function loadFile(durl, cbFun){
	var request = getRequestFn();
	if(!request){
		$XE("unsupport AJAX. Failed");
		return;
	}
	// request.onreadystatechange = function(){
	// 	if (request.readyState == 4){
	// 		if (request.status == 200){
	// 			cbFun(request.responseText);
	// 		} else { 
	// 			$XE("There was an error: (" + request.status + ") " + request.statusText);
	// 		}
	// 	}
	// };	
	request.open("GET", durl, false);
	request.send(null);
	return request.responseText;
}

// should be implement in web view container 
var exampleFiles = "illegal noMessageIdLong subject2 subject6 subject7 subject_gb2312 subject thread_1_7 wronghtml".split(" ");
window.infobox = {
	loadEntosRenderData : function (){
		return loadFile("samples/mail_" + exampleFiles[3] + ".html");
	},
	updateEntosRenderAreaSize : function (w, h){
		console.log("updateEntosRenderAreaSize: width=" + w + ";height=" + h);
	}
};
})();