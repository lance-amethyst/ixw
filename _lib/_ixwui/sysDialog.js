(function () {var t_alert = new IX.ITemplate({tpl: [
	'<div>',
		'<div class="ixw-bg"></div>',
		'<span class="content">{content}</span>',
		'<span class="ixw-close"><a data-href="$ixw.alert.close">&times;</a></span>',
	'</div>',
'']});
var t_info = new IX.ITemplate({tpl: [
	'<span class="content">{content}</span>',
'']});

IXW.Actions.configActions([["ixw.alert.close", function(params, el){
	$X("IXW-alert").style.display = "none";
}]]);

IX.ns("IXW.Lib");

var AlertId = "IXW-alert";
IXW.Lib.alert = function(content){
	var divEl = $X(AlertId);
	if (!divEl) 
		divEl = IX.createDiv(AlertId, "ixw-alert");
	divEl.innerHTML = t_alert.renderData("", {content: content});
	divEl.style.display = "block";
	return divEl;
};

var InfoId = "IXW-info";
IXW.Lib.info = function(content, clz, speed){
	var _id = "IXW-info-" + IX.id();
	var divEl = IX.createDiv(_id, "ixw-info " + (clz ? clz : ""));
	divEl.innerHTML = t_info.renderData("", {content: content});
	if(speed !== -1){
		window.setTimeout(function(){
			if($X(_id)) $XD.remove($X(_id));
		}, speed > 0? speed: 3500);
	}
	return divEl;
};
})();