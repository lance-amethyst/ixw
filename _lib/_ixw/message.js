(function(){
var fnHT = {};

window.onmessage=function(e){
	var data = e.data;
	//console.log("on messge:", e);
	var name = $XP(data, "name");
	if (name in fnHT)
		fnHT[name](data.message);
};
//window.addEventListener("message", onmessage, false ); 

IX.ns("IXW");
IXW.listenOnMessage = function(name, fn){
	fnHT[name] = fn;
};
IXW.postMessage = function(acceptor, name, message){
	var w = acceptor || window;
	console.log("IXW:", w);
	w.postMessage({
		name: name,
		message: message
	},"*");
};
}());