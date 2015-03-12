(function(){
IX.ns("IXW.Lib");

var CommonDialogHTML = '<div class="ixw-mask"></div><div class="ixw-body">';

function BaseLayerView(id, clz){
	var panelEl = null, bodyEl = null;
	function _init(){
		panelEl = IX.createDiv(id, clz);
		panelEl.innerHTML = CommonDialogHTML;
		bodyEl = $XH.first(panelEl, "ixw-body");
	}

	return {
		getPanel  :function(){
			if (!panelEl)
				_init();
			return panelEl;
		},
		getBodyContainer : function(){
			if (!panelEl)
				_init();
			return bodyEl;
		},
		isVisible : function(){return panelEl && (panelEl.style.display != "none");},
		show : function (){ panelEl && (panelEl.style.display = "block");},
		hide: function (){ panelEl && (panelEl.style.display = "none");},
		destory : function(){
			panelEl && panelEl.parentNode.removeChild(panel);
			panelEl = null;
			bodyEl = null;
		}
	};
};

function resetPos(el, wh){
	el.style.left = wh[0] + "px";
	el.style.top = wh[1] + "px";
}


/** only DO position by the trigger.
 * cfg {
 * 		id :
 *		zIndex : 
 * 		trigger : el,
 * 		position : right/bottom/offset; default "bottom"
 *		offset : { // vertical offset;
 *			left:
 *			top:
 * 			height:	
 *			width:
 *		}
 * 	}
 * 
 * functions  :{
 		getId : function(){return id;},
		destroy : function() { panel && panel.parentNode.removeChild(panel);},
		reset : function(newCfg),
		isVisible : function(){return true;},
		hide : function(){},
		show : function(triggerEl)
 * }
 */
IXW.Lib.PopPanel = function (cfg){
	var id = $XP(cfg, "id");	
	if (IX.isEmpty(id))
		id = IX.id();
	var baseView = new BaseLayerView(id, "ixw-pop");

	var _zIndex = $XP(cfg, "zIndex");
	var position = $XP(cfg, "position", "bottom");	
	var triggerEl = $XP(cfg, "trigger"); 

	var offset = $XP(cfg, "offset", {}); // only for position == "offset"
 
	function getZIndex(el) {return  _zIndex && !isNaN(_zIndex) ? (_zIndex - 0) : $XH.getZIndex(el);}	
	function setOffsetPosition(panel, wh){
		resetPos(panel, [wh[0]+ (offset.left||0), wh[1]+wh[3]+ (offset.top||0)]);
		panel.style.maxHeight = ((offset.height || 200)-6) + "px";
		panel.style.width = (offset.width || 100) + "px";
	}
	function setRelativePosition(panel, wh, elem){
		var isTriggerToBottom = position=="bottom";
		if (isTriggerToBottom)
			wh[1] = wh[1] + wh[3];
		else 
			wh[0] = wh[0] + wh[2];
		var panelWidth =panel.offsetWidth;
			
		var scrnSize = $Xw.getScreen().size;			
		if (wh[0] + panelWidth>scrnSize[0]){
			wh[0] = wh[0] - panelWidth;
			wh[0] = isTriggerToBottom? (wh[0]+elem.offsetWidth-5) : (wh[0]-wh[2]+5);
		}
		var h= panel.offsetHeight + elem.offsetHeight;
		if (wh[1] + h >scrnSize[1]+ $Xw.getScrollY() && wh[1]-h>0)
			wh[1] = wh[1]-h;
		
		resetPos(panel,wh);
	}
	function _show(el){
		var panel = baseView.getPanel();
		triggerEl = $X(el || triggerEl);

		var zIndex = getZIndex(triggerEl);
		if (zIndex!=null)
			panel.style.zIndex = zIndex+5;

		var wh = $XH.getPosition(triggerEl, cfg.isFixed), top = wh[1], h = panel.offsetHeight;
		if(window.screen.height - top < h)
			wh[1] = top - h - triggerEl.offsetHeight;
		
		baseView.show();
		if (position=="offset")
			setOffsetPosition(panel, wh);
		else
			setRelativePosition(panel, wh, triggerEl);
	}
	
	return {
		getId : function(){return id;},
		getBodyContainer : baseView.getBodyContainer,
		destroy : baseView.destory,
		getTrigger : function(){return triggerEl;},

		reset : function(newCfg){
			position = $XP(newCfg, "position", position);
			if (position == "offset")
				offset = $XP(newCfg, "offset", {});
			_show($XP(newCfg, "trigger"));
		},
		
		isVisible : baseView.isVisible,
		hide : baseView.hide,
		show : _show
	};
};
/** TO trigger panel position to trigger if action("triggerMode") on trigger or its icon("triggerIcon")
 * cfg {
 * 		id :
 *		triggerMode : "mouseover" // default "click";
 * 		position : right/bottom/offset; default "bottom"
 *		offset : { // vertical offset;
 * 			height:	
 *			width:
 *		},
 *		ifKeepPanel : function(target),
 *		bodyRefresh : function(bodyEl)
 * 	}
 * 
 * functions  :{
 * 		trigger:
 * 		listen:
 * }
 */
IXW.Lib.PopTrigger = function(cfg){	
	var eventName = $XP(cfg, "triggerMode", "click");
	var ifKeepPanel = $XF(cfg, "ifKeepPanel");
	var bodyRefresh = $XF(cfg, "bodyRefresh");

	var _popPanel = null;
	cfg.id = cfg.id||IX.id();

 	if(!$X(cfg.id)){
 		var eventHandlers = {};
	 	eventHandlers[eventName] = function(e){
	 		if (!(_popPanel && _popPanel.isVisible()))
	 			return;
			var target = e.target;
	 		var panel = $XH.ancestor(target, "ixw_pop");
	 		if (panel && panel.id==_popPanel.getId())
				return;
			if (!ifKeepPanel(target))
				_popPanel.hide();
		};

		$Xw.bind(eventHandlers);
	}

	return {
		trigger : function(el) {
	 		if (!_popPanel) 
				_popPanel = new IXW.Lib.PopPanel(cfg);
			_popPanel.show(el);
			bodyRefresh(_popPanel.getBodyContainer(), el);
		},
		destroy : function(){_popPanel && _popPanel.destroy();},
		reset : function(_cfg){ _popPanel && _popPanel.reset(_cfg);},
		isVisible : function(){ return _popPanel && _popPanel.isVisible();},
		hide : function(){ _popPanel && _popPanel.hide();}
	};
};

/** cfg : {
	id:
	bodyRefresh : function(el)
 * }
 */
IXW.Lib.ModalDialog = function(cfg){
	var id = cfg.id || IX.id();
	var baseView = new BaseLayerView(id, "ixw-modal-dialog");
	var bodyRefreshFn = $XF(cfg, "bodyRefresh");

	function _resize(){
		if (!baseView.isVisible())
			return;
		var bodyEl = baseView.getBodyContainer();
		var posY = ($Xw.getScreen().size[1]- bodyEl.offsetHeight)/2;
		posY = posY > 300? (posY-100): Math.max(posY, 0);
		bodyEl.style.marginTop = (0- bodyEl.offsetHeight- posY) + "px";
	}
	$Xw.bind({resize : _resize});

	return {
		show : function (){
			baseView.show();
			bodyRefreshFn(baseView.getBodyContainer());
			_resize();
		},
		hide: baseView.hide,
		destory : baseView.destory
	};
};

})();