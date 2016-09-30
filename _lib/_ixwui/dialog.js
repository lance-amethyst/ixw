(function(){
var CommonDialogHTML = '<div class="ixw-mask"></div><div class="ixw-body">';

function BaseLayerView(id, clz){
	function _init(){
		var panelEl = IX.createDiv(id, clz);
		panelEl.innerHTML = CommonDialogHTML;
	}
	function _checkPanel(){
		if (!$X(id))
			_init();
		return $X(id);
	}

	return {
		getPanel  :function(){return _checkPanel();},
		getBodyContainer : function(){ return $XH.first(_checkPanel(), "ixw-body");},
		isVisible : function(){return $X(id) && ($X(id).style.display != "none");},
		show : function(){_checkPanel().style.display = "block";},
		hide: function(){$X(id) && ($X(id).style.display = "none");},
		destory : function(){
			var panelEl = $X(id); 
			panelEl && panelEl.parentNode.removeChild(panelEl);
		}
	};
}

function resetPos(el, wh){
	el.style.left = wh[0] + "px";
	el.style.top = wh[1] + "px";
}

function setRelativePos(panel, rect, scrnSize, isBottom){
	var panelWH = [panel.offsetWidth, panel.offsetHeight];
	var scrnArea = [scrnSize[0] - panelWH[0], scrnSize[1] - panelWH[1]];
	var borderArea = [panelWH[0] - rect[0], panelWH[1] - rect[1]];
	var pos = [rect[0], rect[1]];
	function _calPos(_idx, delta, posDelta){
		if (pos[_idx] >scrnArea[_idx] && delta > borderArea[_idx])
			pos[_idx] = delta - borderArea[_idx] + posDelta;
	}
	var idx = isBottom ? 1 : 0;
	pos[idx] = rect[idx] + rect[idx+2] - 2;
	_calPos(1-idx, rect[3-idx], 0); 
	_calPos(idx, 0, 2);

	resetPos(panel, pos);
}

// offset : {dx, dy}
function setAroundPos(el, rect, scrnSize, offset){
	var delta = [offset.dx, dy = offset.dy];
	var deltaWH = [el.offsetWidth +offset.dx , el.offsetHeight + offset.dy];
	var center = [rect[0]+ rect[2]/2, rect[1]+rect[2]/2];

	var xy = [];
	function _calc(idx, primeClz, altClz){
		var ifPrime = scrnSize[idx] > center[idx] + deltaWH[idx];

		$XH.removeClass(el, ifPrime ? altClz : primeClz);
		$XH.addClass(el, ifPrime ? primeClz : altClz);
		xy[idx] = center[idx] + (ifPrime ? delta[idx] : (0-deltaWH[idx]));
	}
	_calc(0, "atRight", "atLeft");
	_calc(1, "atDown", "atUp");

	resetPos(el, xy);
}

IX.ns("IXW.Lib");
/** only DO position by the trigger.
 * cfg {
 * 		id :
 *		zIndex : 
 * 		trigger : el,
 * 		position : around/right/bottom/offset; default "bottom"
 *		offset : { // vertical offset;
 *			left:
 *			top:
 *			height:
 *			width:
 *		}
 *		onhide : function(){}
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
	var panel = null;

	var _zIndex = $XP(cfg, "zIndex");
	var position = $XP(cfg, "position", "bottom");	
	var triggerEl = $XP(cfg, "trigger"); 
	var onhide = $XF(cfg, "onhide");

	var offset = $XP(cfg, "offset", {}); // only for position == "offset"
 
	function getZIndex(el) {return  _zIndex && !isNaN(_zIndex) ? (_zIndex - 0) : $XH.getZIndex(el);}	
	function setOffsetPosition(panel, wh){
		//console.log("popEl:",wh);
		if(wh[2] == undefined){
			resetPos(panel, [wh[0] - 30, wh[1] - 100]);
		}else{
			resetPos(panel, [wh[0]+ (offset.left||0), wh[1]+wh[3]+ (offset.top||0)]);
		}
		panel.style.maxHeight = ((offset.height || 200)-6) + "px";
		panel.style.width = (offset.width || 100) + "px";
	}

	function _show(el){
		panel = baseView.getPanel();
		triggerEl = $X(el || triggerEl);

		var zIndex = getZIndex(triggerEl);
		if (zIndex!=null)
			panel.style.zIndex = zIndex+5;
		baseView.show();

		setPos();
	}

	function setPos(){
		var isFixed = $XH.isPositionFixed(triggerEl);
		panel.style.position = isFixed?"fixed":"";
		var rect = $XH.getPosition(triggerEl, isFixed);
		if (position=="offset")
			return setOffsetPosition(panel, rect);

		var scrn = $Xw.getScreen();
		var scrnSize = isFixed? scrn.size : [scrn.scroll[0] + scrn.size[0], scrn.scroll[1] + scrn.size[1]];
		if (position=="around")
			return setAroundPos(panel, rect, scrnSize, offset);
		setRelativePos(panel, rect, scrnSize, position=="bottom");
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
		setPos : setPos,
		isVisible : baseView.isVisible,
		hide : function(){
			baseView.hide();
			onhide();
		},
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
 *		ifKeepPanel : function(target, triggerEl),
 *		bodyRefresh : function(bodyEl, triggerEl)
 *		bodyListen : function(bodyEl, triggerEl)
 * 	}
 * 
 * functions  :{
 * 		trigger: function(triggerEl)
 * }
 */
IXW.Lib.PopTrigger = function(cfg){	
	var eventName = $XP(cfg, "triggerMode", "click");
	var ifKeepPanel = $XF(cfg, "ifKeepPanel");
	var bodyRefresh = $XF(cfg, "bodyRefresh");
	var bodyListen = $XF(cfg, "bodyListen");

	var _popPanel = null;
	cfg.id = cfg.id||IX.id();

	var eventHandlers = {};
	eventHandlers[eventName] = function(e){
		if (!(_popPanel && _popPanel.isVisible()))
			return;
		var target = e.target;
			var panel = $XH.ancestor(target, "ixw-pop");
			if (panel && panel.id==_popPanel.getId())
			return;
		if (!ifKeepPanel(target, _popPanel.getTrigger()))
			_popPanel.hide();
	};
	if(!$X(cfg.id))
		$Xw.bind(eventHandlers);

	return {
		trigger : function(el) {
	 		if (!_popPanel) 
				_popPanel = new IXW.Lib.PopPanel(cfg);
			var bodyEl = _popPanel.getBodyContainer();
			bodyRefresh(bodyEl, el);
			_popPanel.show(el);
			bodyListen(bodyEl);
		},
		destroy : function(){_popPanel && _popPanel.destroy();},
		reset : function(_cfg){ _popPanel && _popPanel.reset(_cfg);},
		isVisible : function(){ return _popPanel && _popPanel.isVisible();},
		hide : function(){ _popPanel && _popPanel.hide();},
		setPos : function(){ _popPanel && _popPanel.setPos();}
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
		var scrnH = $Xw.getScreen().size[1], bodyH = bodyEl.offsetHeight;
		var posY = (scrnH - bodyH)/2;
		var marginTop = (posY < 120) ? (120 - scrnH) : Math.floor(0 - bodyH - Math.max(posY + 50, 0))
		bodyEl.style.marginTop = marginTop + "px";
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