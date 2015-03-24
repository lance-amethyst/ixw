(function(){
var uploadedCbHT = new IX.IListManager(); 
var FileUploadURL = null;
var AjaxUploaderHtml = [
'<form action="{url}" id="{id}_form" name="{id}_form" enctype="multipart/form-data" method="post" target="{id}_frame">',
	'<input type="hidden" name="tkey" id="{id}_key"/>',
	'<input type="hidden" id="{id}_rnd" name="rnd"/>', // random time stamp
	'<input type="file" id="{id}_file" name="file" title="{title}"/>',
	'<iframe name="{id}_frame" id="{id}_frame" style="display:none" src = "about:blank"></iframe>',
'</form>'].join("");

function adjustForBrowsers(fileEl){
	var ml = 0;
	if (IX.isMSWin){ // as font-size: 30px
		if (IX.isFirefox) // 330-440
			ml = 330;
		else if (IX.isChrome)//140-578
			ml=140;
		else if (IX.isMSIE)//330-530
			ml = 330;
	}else{
		if (IX.isFirefox) //410-425
			ml = 420;
		else if (IX.isChrome) //153-580
			ml=160;
	}
	ml>0 && (fileEl.style.marginLeft = (0-ml) + "px");
}

function refreshContainer(config, id, trigger){
	var url = $XP(config, "fileUploadURL", FileUploadURL) +"?" + id;
	var container = IX.createDiv(id, "ixw-fileUploader");
	trigger.parentNode.insertBefore(container, trigger && trigger.nextSibling);
	container.innerHTML = AjaxUploaderHtml.replaceAll("{id}", id).replace("{url}", url)
			.replace("{title}", $XP(config, "title", "文件"));


	var width = $XP(config, "width", trigger.offsetWidth);
	var height = $XP(config, "height", trigger.offsetHeight); 

	container.style.zIndex = $XH.getZIndex(trigger)+2;
	container.style.marginLeft = (0-width) + "px";
	container.style.width = width + "px";
	container.style.height = height + "px";
	if(config.isHide)
		container.style.visibility = 'hidden';

	return container;
}

function listenOnFile(config, id, trigger){
	var fileEl = $X(id + "_file");
	adjustForBrowsers(fileEl);

	var focusFn = $XF(config, "onfocus");
	var changeFn = $XF(config, "onchange");
	fileEl.onfocus = function(){focusFn(fileEl);};
	fileEl.onchange = function(){changeFn(fileEl);};
	fileEl.onmouseover = function(){$XH.addClass(trigger, "hover");};
	fileEl.onmouseout = function(){$XH.removeClass(trigger, "hover");};
	return fileEl;
}

IX.ns("IXW.Lib");

/**	
 *  config : {
 *  	fileUploadURL  //optional
 *		trigger : "el", //required 
 *		title : '' //optional
 *		width : //optional
 *		height : //optional
 *		onfocus : function(fileEl){} //optional
 *		onchange : function(fileEl){} //optional
 *  }
 *  return {
 *		submit : function(cbFn){}
 *	}
 *	cbFn : function(info){}
 *	info : {
 		"id" : 
		"file" : "http://s.img/pf13",
		"size : [100, 100]
		"area" : [0,0, 100,100]
 *	}	
 */
IXW.Lib.FileUploader = function(config){
	var trigger = $X($XP(config, "trigger"));
	if (!trigger)
		return;
	var id = IX.id();
	var container = refreshContainer(config, id, trigger);
	if(!container)
		return; 

	var fileEl = listenOnFile(config, id, trigger);
	var formEl = $X(id + "_form");
	function submitForm(cbFn) {
		if (IX.isEmpty(fileEl.value))
			return alert("没有选择文件,请选择文件再提交!");
		$X(id + "_rnd").value = IX.getTimeInMS();
		$X(id + "_key").value = id;
		uploadedCbHT.register(id, function(retData){
		retData.fileEl = window.ActiveXObject ? fileEl : {
			value : fileEl.value,
			files : [fileEl.files[0]]
		};
		IX.isFn(cbFn) && cbFn(retData);
		formEl.reset();
	});
		formEl.submit();
	};

	return {
		// getId : function(){return id;},
		// clear : function(){formEl.reset();},
		submit : submitForm,
		// destroy : function(){
		// 	var divEl = $X(id);
		// 	divEl && divEl.parentNode.removeChild(divEl);
		// },
		click : function(e){
			if(!config.isHide)
				return;
			$X(id).querySelectorAll('input[type="file"]')[0].click();
			e.stopPropagation();
		}
	};
};

/** it is used to be called by iframe page: like parent.IXW.Lib.FileUploadedCB(data);
 *	data : {
 *		tkey : submit form id :
 *		size : [w,h],
 *		area : [sx,px, ex, ey]
 *		id : id in server 
 *		file : url based on fsURL  	 
 *	}
 */
IXW.Lib.FileUploadedCB = function(data, error){
	var fn = uploadedCbHT.get(data.tkey); 
	if(error && error.code == 0)
		return alert(error.msg);
	fn(data);
};

IXW.Lib.FileUploader.init = function(url){ 
	FileUploadURL = url;
};
})();
