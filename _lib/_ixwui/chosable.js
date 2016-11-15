(function () {
function _tpldataFn(id, items, ifSelectFn){return  {
	id : id,
	clz : items.length===0?"invisible":"",
	items : IX.map(items, function(item){return {
		clz : ifSelectFn(item.id) ? "selected" : "",
		id : item.id,
		title : item.name.replace(/\'|\"/g, '“'),
		text : IX.encodeTXT(item.name || "")
	};})
};}

var MultiChosableCmpCfg = {
	choseFn : function(params, aEl){ 
		$XH.toggleClass(aEl, "selected");
		return aEl.parentNode;
	}, 
	tpldataFn : function(id, items, value){
		var valuedHT = {};
		IX.iterate(value, function(sid){valuedHT[sid] = sid;});
		return _tpldataFn(id, items, function(itemId){
			return valuedHT[itemId] == itemId;
		});
	}, 
	valueFn : function(el){
		if (!el) return [];
		var ids = [];
		var aEl = $XH.first(el, "selected");
		while(aEl){
			ids.push($XD.dataAttr(aEl, "key"));
			aEl = $XH.next(aEl, "selected");
		}
		return ids;
	}
};
var SingleChosableCmpCfg = {
	choseFn : function(params, aEl){
		if ($XH.hasClass(aEl, "selected"))
			return null;
		var el =  aEl.parentNode;
		$XH.removeClass($XH.first(el, "selected"), "selected");
		$XH.addClass(aEl, "selected");
		return el;
	}, 
	tpldataFn : function(id, items, value){
		var _value = (value===null || value === undefined)?$XP(items, "0.id") : value;
		return _tpldataFn(id, items, function(itemId){
			return _value == itemId;
		});
	}, 
	valueFn : function(el, aEl){
		if (!el && !aEl) return null;
		aEl = aEl || $XH.first(el, "selected");
		return $XD.dataAttr(aEl, "key");
	}
};

var t_checkboxs = new IX.ITemplate({tpl: [
	'<div id="{id}" class="ixw-chks {clz}">','<tpl id="items">',
		'<a class="{clz}" data-key="{id}" title="{title}" data-href="$ixw.chk.check">',
			'<span class="ixpic-"></span><span>{text}</span>',
		'</a>',
	'</tpl>','</div>',
'']});

//IX.ns("IXW.Lib");
/**	cfg {
	id : used to mark the groups;
	items : [{id, name}]
	value : [selectedId]
	onchange(selectedIds) :
 * }
 * return obj : {
	getHTML (),
	bind(onchange(selectedIds))
	apply(items, [selectedId])
	getValue ()
 * }
 */
//IXW.Lib.Checkboxs = function(cfg){};
//IXW.Lib.clearCheckboxs = function(){};
IXW.Lib.createChosableComponent("Checkboxs", "chk", MultiChosableCmpCfg.choseFn, 
	t_checkboxs, MultiChosableCmpCfg.tpldataFn, 
	MultiChosableCmpCfg.valueFn
);

var t_radios = new IX.ITemplate({tpl: [
	'<div id="{id}" class="ixw-radios {clz}">','<tpl id="items">',
		'<a class="{clz}" data-key="{id}" title="{title}" data-href="$ixw.radio.check">',
			'<span class="ixpic-"></span><span>{text}</span>',
		'</a>',
	'</tpl>','</div>',
'']});
var t_opts = new IX.ITemplate({tpl: [
	'<div id="{id}" class="ixw-opts {clz}">','<tpl id="items">',
		'<a class="{clz}" data-key="{id}" title="{title}" data-href="$ixw.opt.check">{text}</a>',
	'</tpl>','</div>',
'']});

//IX.ns("IXW.Lib");
/**	cfg {
	id : used to mark the groups;
	items : [{id, name}]
	value : selectedId
	onchange(selectedId) :
 * }
 * return obj : {
	getHTML (),
	bind(onchange(selectedId))
	apply(selectedId)
	getValue ()
 * }
 */
//IXW.Lib.Radios = function(cfg){};
//IXW.Lib.clearRadios = function(){};
//IXW.Lib.Options = function(cfg){};
//IXW.Lib.clearOptions = function(){};
IXW.Lib.createChosableComponent("Radios", "radio", SingleChosableCmpCfg.choseFn, 
	t_radios, SingleChosableCmpCfg.tpldataFn, 
	SingleChosableCmpCfg.valueFn
);
IXW.Lib.createChosableComponent("Options", "opt", SingleChosableCmpCfg.choseFn, 
	t_opts, SingleChosableCmpCfg.tpldataFn, 
	SingleChosableCmpCfg.valueFn
);
})();