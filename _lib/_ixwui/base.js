(function(){
var ixwActionsConfig = IXW.Actions.configActions;
// <tpl id="cmpTpl">
// 	<div id="{id}" class="ixw-cmp {clz}">....</div>
// </tpl>

function createComponent(actionsCfg, tpl){
	var fnHT = new IX.IListManager(), isInitialized = false;
	function bindCmpTrigger(id, fn){
		fnHT.register(id, fn);
		if(isInitialized)
			return;
		ixwActionsConfig(actionsCfg);
		isInitialized = true;
	}
	/** cfg :{
		id : used to mark the groups;
		onchange(...) :
	 * }
	 * return obj : {
		getHTML (),
		bind(onchange(...))

		getId()
 	 * }
	 */
	function ClzBase(cfg, tpldataFn){
		var id = $XP(cfg, "id") || IX.id();
		bindCmpTrigger(id, $XF(cfg, "onchange"));
		return {
			getHTML : function(){return tpl.renderData("", tpldataFn());},
			bind : function(onchange){bindCmpTrigger(id, onchange);},

			getId : function(){return id;}
		};
	}
	return {
		ClzBase : ClzBase,

		clear : function(){
			fnHT.iterate(function(dpt, dptId){!$X(dptId) && fnHT.remove(dptId);});
		},
		get : function(id){return fnHT.get(id);}
	};
}
function createChosableComponent(name, abbrName, choseFn, tpl, tpldataFn, valueFn) {
	var cmp = createComponent([["ixw." + abbrName + ".check", function(params, aEl){
		var el = choseFn(params, aEl);
		if (!el)
			return;
		var onchange = cmp.get(el.id);
		IX.isFn(onchange) && onchange(valueFn(el, aEl));
	}]], tpl);
	IXW.Lib[name] = function(cfg){
		var tpldata = null;
		var inst = new cmp.ClzBase(cfg, function(){return tpldata;});
		var id = inst.getId(), items = $XP(cfg, "items", []), value = $XP(cfg, "value");
		tpldata = tpldataFn(id, items, value);

		function _apply(){
			var containerEl = $X(id);
			if (!containerEl)
				return;
			if (!IX.isEmpty(tpldata.clz))
				return $XH.addClass(containerEl, "invisible");
			containerEl.innerHTML = IX.map(tpldata.items, function(item){
				return tpl.renderData("items", item);
			}).join("");
			$XH.removeClass(containerEl, "invisible");
		}
		return {
			getHTML : inst.getHTML,
			bind : inst.bind,
			apply : function(_items, _value){
				if (_items || _value)
					tpldata = tpldataFn(id, _items || items, _value || value);
				_apply();
			},
			getValue : function(){return valueFn($X(id));}
		};
	};
	IXW.Lib["clear" + name] = cmp.clear;
}

IX.ns("IXW.Lib");
// function(actionsCfg, tpl)
// return {
//		ClzBase(cfg, tpldataFn()),
//		get(id),
//		clear()
//}
IXW.Lib.createComponent = createComponent; 
// function("Checkboxs", "chk", choseFn(params, aEl), tpl, tpldataFn(id, items, value), valueFn(el, aEl))
// return undefined; 
IXW.Lib.createChosableComponent = createChosableComponent;
})();
