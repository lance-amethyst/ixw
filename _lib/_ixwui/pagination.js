(function () {var t_pagination = new IX.ITemplate({tpl: [
	'<div id="{id}" class="ixw-pg {clz}">',
		'<div class="pg">','<tpl id="pages">',
			'<a class="{clz}" data-href="$ixw.pg.jump" data-key="{key}"><span class="{extra}">{text}</span></a>',
		'</tpl>','</div>',
		'<div class="go" ><input data-max="{total}" id="pgInput" /><a data-href="$ixw.pg.go">GO</a></div>		',
	'</div>',
'']});

var paginCmp = IXW.Lib.createComponent([
["ixw.pg.jump", pgJump],
["ixw.pg.go", pgGo]
], t_pagination);

function getArrowData(arrow, ifDisable){return {
	clz : (ifDisable? " disabled" : ""),
	extra : "pg-"+ arrow,
	key : arrow,
	text : ""
};}
function getNumData(idx, ifActive){return {
	clz : (ifActive? " disabled actived" : ""),
	extra : "",
	key : idx,
	text : idx
};}
function getDotted(){return {
	clz : "dotted disabled",
	"extra " : "",
	key : "",
	text : "..."
};}

function getTplData(id, totalPages, curPageNo){
	if (totalPages <= 1 )
		return {
			id : id,
			clz : "invisible",
			total : totalPages,
			pages : []
		};
	var arr = [];

	var curIdx = curPageNo + 1, 
		isFirst = curIdx == 1, isLast = curIdx == totalPages;

	arr.push(getArrowData("prev", isFirst));
	arr.push(getNumData(1, isFirst));
	if (curIdx >= 4)
		arr.push(getDotted());
	for (var i=Math.max(2, curIdx-1); i<=Math.min(curIdx + 1, totalPages-1); i++)
		arr.push(getNumData(i, i==curIdx));
	if (curIdx <= totalPages - 3)
		arr.push(getDotted());
	arr.push(getNumData(totalPages, isLast));
	arr.push(getArrowData("next", isLast));

	return {
		id : id,
		clz :"",
		pages : arr,
		total : totalPages
	};
}
function showErrMsg(err){
	IXW.alert(err || "请输入正确的页码数字。");
}
function getCurPageIdx(pgEl){
	var el = $XH.first($XH.first(pgEl, "pg"), "actived");
	return $XD.dataAttr(el, "key");
}
function onPageChanged(pgEl, idx){
	var onchange = paginCmp.get((IX.isString(pgEl) || !isNaN(pgEl))?pgEl : pgEl.id);
	IX.isFn(onchange) && onchange(idx -1);
}
function pgGo(params, aEl){
	var inputEl = $XD.first(aEl.parentNode, "input");
	var idx = inputEl.value;
	if (isNaN(idx) || idx <1 )
		return showErrMsg();
	idx = idx - 0;
	var pgEl = $XH.ancestor(inputEl, "ixw-pg");
	if (idx==getCurPageIdx(pgEl))
		return showErrMsg("当前已经是第" + idx + "页，请重新输入。");
	var max = $XD.dataAttr(inputEl, "max") - 0;
	if (idx>max)
		return showErrMsg();
	onPageChanged(pgEl, idx);
	inputEl.value = "";
}
function pgJump(params, aEl){
	if ($XH.hasClass(aEl, "disabled"))
		return;
	var pgEl = $XH.ancestor(aEl, "ixw-pg");
	var key = params.key;
	var idx = key;
	if (key == "next" || key == "prev")
		idx = getCurPageIdx(pgEl) - (key == "next"? -1 : 1);
	onPageChanged(pgEl, idx);
}

//////////////////////////////
function inputOnKeyDown(inputEl, e){
	if (e.which != 13) return;
	e.preventDefault();
	pgGo(null, inputEl);
}
function Pagination(cfg){
	var tpldata = null;
	var inst = new paginCmp.ClzBase(cfg, function(){return tpldata;});
	var id = inst.getId(), total = $XP(cfg, "total", 0), 
		current = Math.min($XP(cfg, "current", 0), total-1);
	tpldata = getTplData(id, total, current);

	function _apply(){
		var containerEl = $X(id);
		if (!containerEl)
			return;
		if (!IX.isEmpty(tpldata.clz))
			return $XH.addClass(containerEl, "invisible");

		var inputEl =$XD.first($XH.first(containerEl, "go"), "input");
		$XD.setDataAttr(inputEl, "max", tpldata.total);
		IXW.Pages.bindOnInput(inputEl, { 
			keydown : function(e){inputOnKeyDown(inputEl, e);}
		});
		var el = $XH.first(containerEl, "pg");
		el.innerHTML = IX.map(tpldata.pages, function(page){
			return t_pagination.renderData("pages", page);
		}).join("");
		$XH.removeClass(containerEl, "invisible");
	}

	return {
		getHTML : inst.getHTML,
		getCurrentPageNo : function(){return current;},
		bind : inst.bind,
		apply : function(_current, _total, onlyData){
			var isChanged = false;
			if (!isNaN(_total) && _total >= 0 && _total != total){
				total = _total - 0;
				isChanged = true;
			}
			if (!isNaN(_current) && _current >= 0 && _current != current){
				current = Math.max(0, Math.min(total-1, _current - 0));
				isChanged = true;
			}
			if (isChanged)
				tpldata = getTplData(id, total, current);
			if (!onlyData) _apply();
		},
		jump : function(pageNo){
			onPageChanged(id, Math.max(0, pageNo===undefined?current:pageNo) + 1);
		}
	};
}
IX.ns("IXW.Lib");
/**	cfg {
	id : used to mark the unique;
	total : 4
	current : 0 ( from 0 to 3)
	onchange 
 * }
 * return obj : {
	getHTML (),
	bind(onchange(current))
	apply(total, current)
	jump(pageNo) : force to jump pageNo(or current PageNo), no matter if PageNo existed!
 * }	
 */
IXW.Lib.Pagination = Pagination;
IXW.Lib.clearPaginations = paginCmp.clear;
})();