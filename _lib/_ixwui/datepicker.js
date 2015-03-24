(function() {
var ixDate = IX.Date;
var ixwActionsConfig =  IXW.Actions.configActions;
var DatePickerPopPanelID = "ixw-datePickerPanel";
var DayInMS = 24*3600*1000;
var Weeks = IX.map('日一二三四五六'.split(""), function(name, idx){
	return {clz : (idx==0 || idx==6) ? "weekend" : "", text : name};
});
var Months = '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月'.split(',');

function getLength4DateArea(timeFmt){
	if (IX.isEmpty(timeFmt))
		return 3; // [Year, Month, Day]
	var str = timeFmt.toLowerCase();
	if (str == "hh:mm") return 5;// [Year, Month, Day, Hour, minute]
	if (str == "hh:mm:ss") return 6;// [Year, Month, Day, Hour, Minute, Second]
	return 3;
}

function formatDateBySec(secTick, timeFmt){
	var len = getLength4DateArea(timeFmt);
	return ixDate.formatBySec(secTick, "time").substring(0, 1+ len * 3);
}

function getTodayYMD(){return ixDate.formatDate(new Date).split(/-|\//g);}

var t_dateTpl = new IX.ITemplate({tpl:[
'<div class="ixw-dp">',
	'<div class="dp-header">',
		'<a data-href="$ixw.dp.prevy" class="dt-prevy"></a>',
		'<a data-href="$ixw.dp.prevm" class="dt-prevm"></a>',
		'<a data-href="$ixw.dp.year" class="dp-year"><input value="{year}" type="text"></a>',
		'<a data-href="$ixw.dp.month" class="dp-month"><input value="{month}" type="text"></a>',
		'<a data-href="$ixw.dp.nextm" class="dt-nextm"></a>',
		'<a data-href="$ixw.dp.nexty" class="dt-nexty"></a>',
	'</div>',
	'<ul class="dp-weeks"><tpl id="weeks"><li class="{clz}">{text}</li></tpl></ul>',
	'<ul class="dp-days"><tpl id="days">',
		'<li class="{clz}"><a class="dp-day" data-href="$ixw.dp.day" data-value="{value}">{text}</a></li>',
	'</tpl></ul>',
	'<div class="time-area {timeClz}">',
		'<span>时间</span>',
		'<span class="areas">',
			'<a class="dp-hour" data-href="$ixw.dp.hour"><input value="{hour}" data-name="hour" type="text"></a>',
			'<b>:</b>',
			'<a class="dp-minute" data-href="$ixw.dp.minute"><input value="{minute}" data-name="minute" type="text"></a>',
			'<b class="4sec">:</b>',
			'<a class="dp-second" data-href="$ixw.dp.second" class="4sec"><input value="{second}" data-name="second" type="text"></a>',
		'</span>',
		'<span class="icons">',
			'<a data-href="$ixw.dp.next"><span class="dt-prev"></span></a>',
			'<a data-href="$ixw.dp.prev"><span class="dt-next"></span></a>',
		'</span>',
	'</div>',
	'<div class="dp-btns">',
		'<a class="dp-btn" data-href="$ixw.dp.clear">清除</a>',
		'<a class="dp-btn" data-href="$ixw.dp.today">今天</a>',	
		'<a class="dp-btn" data-href="$ixw.dp.ok">确认</a>',
	'</div>',
'</div>'
]});
// [{clz: "",value : "", text: ""}],
function getDays4Month(year, month, date){
	var d = new Date(year, month, 1);
	var dday = d.getDay(), dt = d.getTime();
	var today = getTodayYMD();
	var todayInMS = (new Date(today[0], today[1] -1, today[2])).getTime();
	var chosedDateInMS = dt  + date * DayInMS - DayInMS;
	function _getTpldate4Day(_d){
		var dInMS = _d.getTime();
		var dweek = _d.getDay();
		var clzArr = [];
		if (_d.getMonth() != month) clzArr.push("out-month");
		if (dweek ==0  ||dweek == 6) clzArr.push("weekend");
		if (dInMS == todayInMS) clzArr.push("today");
		if (dInMS == chosedDateInMS) clzArr.push("selected");
		return {
			clz : clzArr.join(" "),
			value : ixDate.formatDate(_d),
			text : _d.getDate()
		};
	}
	var arr = [];
	for (var i = 0 - dday; i < 42 - dday; i++)
		arr.push(_getTpldate4Day(new Date(dt + i * DayInMS)));
	return arr;
}

var YM_RANGE = [[1000,3000], [1,12]];
var ymdArea = (function(){
	var yearInput = null, monthInput = null, daysEl = null;
	var curYmd = null, tpldate = {};
	function resetTpldate() {
		tpldate = {
			year : (curYmd[0] + "年"),
			month : Months[curYmd[1] - 1],
			weeks : Weeks,
			days: getDays4Month(curYmd[0]-0, curYmd[1]-1, curYmd[2])
		};
	}
	function _refreshYMD(){
		resetTpldate();
		yearInput && (yearInput.value = tpldate.year);
		monthInput && (monthInput.value = tpldate.month);
		daysEl && (daysEl.innerHTML = IX.map(tpldate.days, function(day){
			return t_dateTpl.renderData("days", day);
		}).join(""));
	}
	function refreshNextYMD(deltaM){
		if (deltaM==12 || deltaM==-12)
			curYmd[0] = curYmd[0]-(deltaM>0?-1:1);
		else if(deltaM==-1 && curYmd[1]==1) {
			curYmd[0] -= 1;
			curYmd[1] = 12;
		} else if(deltaM==1 && curYmd[1]==12){
			curYmd[0] -= -1;
			curYmd[1] = 1;
		} else
			curYmd[1] = curYmd[1] - (deltaM>0?-1:1);
		_refreshYMD();
	}
	function selectDay(aEl){
		var liEl = aEl.parentNode;
		if (!liEl || $XH.hasClass(liEl, "selected"))
			return;
		$XH.removeClass($XH.first(daysEl, "selected"),"selected");
		$XH.addClass(liEl, "selected");
		curYmd = $XD.dataAttr(aEl, "value").split(/[^0-9]/);
		resetTpldate();
	}
	function _hover(e, fname){
		var aEl = $XH.ancestor(e.target, "dp-day");
		aEl && $XH[fname](aEl.parentNode, "hover");
	}
	function _bindOn(inputEl, isYear){
		var idx = isYear ? 0 : 1, range = YM_RANGE[idx];
		IX.bind(inputEl, {
			focus : function(){inputEl.value = curYmd[idx];},
			blur : function(){
				var v = inputEl.value;
				v = isNaN(v)? -1 : Math.ceil(v);
				if (v == curYmd[idx] || v >range[1] || v < range[0])
					return inputEl.value = tpldate[isYear?"year":"month"];
				curYmd[idx]  = v;
				_refreshYMD();
			},
			keydown :function(e){if (e.which == 13) inputEl.blur();}
		});
	}
	return {
		changeMonth : refreshNextYMD,
		selectDay : selectDay,

		////////////// used by popDPPanel
		getValue : function(){return curYmd;},
		setValue : function(dateArr){
			curYmd = dateArr;
			_refreshYMD();
		},
		getTplData : function(){return tpldate;},
		bind : function(dpEl){
			var dpHdr = $XH.first(dpEl, "dp-header");
			yearInput = $XD.first($XH.first(dpHdr, "dp-year"), "input");
			monthInput = $XD.first($XH.first(dpHdr, "dp-month"), "input");
			daysEl = $XH.first(dpEl, "dp-days");

			_bindOn(yearInput, "year");
			_bindOn(monthInput);
			IX.bind(daysEl, {
				mouseover: function(e){_hover(e, "addClass");},
				mouseout : function(e){_hover(e, "removeClass");},
			});
		}
	};
})();

var HMS_MAX = [24,60,60], HMS_NAMES = ["hour","minute","second"];
var hmsArea = (function HMSArea(){
	var inputs = [null, null, null], areaEl = null; 
	var focusedIdx = 0, timeClz = "", curHms= ["00","00", "00"];
	function _resetValue(idx, v){
		var value = "00"  + v;
			value = value.substring(value.length-2);
		curHms[idx] = value;
		inputs[idx] && (inputs[idx].value = value);
	}
	function _bindOn(inputEl, idx){
		var max = HMS_MAX[idx]+1;
		inputs[idx] = inputEl;
		IX.bind(inputEl, {
			focus : function(){focusedIdx = idx;},
			blur : function(){
				var v = inputEl.value;
				v = isNaN(v)? -1 : (Math.ceil(v) % max);
				if (v == curHms[idx] || v >= max || v < 0)
					return inputEl.value = curHms[idx];
				_resetValue(idx, v);
			},
			keydown :function(e){if (e.which == 13) inputEl.blur();}
		});
	}
	return {
		changeHMS : function (delta){
			if (!inputs[focusedIdx]) 
				return;
			var max = HMS_MAX[focusedIdx];
			_resetValue(focusedIdx, (curHms[focusedIdx] -0 + delta + max) % max);
			inputs[focusedIdx].focus();
		},

		////////////// used by popDPPanel
		getValue : function(){return curHms;},
		setValue : function(timeArr, dateAreaLen){
			timeClz = dateAreaLen==6?"hms":(dateAreaLen==5?"hm":"");
			areaEl && (areaEl.className = "time-area "+ timeClz);
			for (var i= 0; i<dateAreaLen-3; i++)
				_resetValue(i, timeArr[i]);
		},
		getTplData : function(){return {
			timeClz : timeClz,
			hour : curHms[0],
			minute: curHms[1],
			second: curHms[2]
		};},
		bind : function(dpEl){
			areaEl = $XH.first(dpEl, "time-area");
			var areaEl = $XH.first(areaEl, "areas");
			IX.iterate(HMS_NAMES, function(name, idx){
				_bindOn($XD.first($XH.first(areaEl, "dp-" + name), "input"), idx);
			});
		}
	};
})();

var popDPPanel = (function(){
	var dateAreaLen = 3;
	var onchangeFn = IX.emptyFn;
	var srcInputEl = null, panelEl = null;

	var popTrigger = new IXW.Lib.PopTrigger({
		id : DatePickerPopPanelID,
		position : "bottom",
		triggerMode : "click",
		ifKeepPanel : function(target, trigger){
			return (trigger && !!$XD.isAncestor(target, trigger)) || $XD.isAncestor(target, panelEl);
		},
		bodyRefresh : bodyRefresh
	});
	function _setAreas(value){
		var _str = IX.isEmpty(value) ? ixDate.format(new Date) : ixDate.formatStr(value);
		var arr = _str.split(" ");
		ymdArea.setValue(arr[0].split(/[^0-9]/));
		hmsArea.setValue(arr[1].split(/[^0-9]/), dateAreaLen);
	}
	function bodyRefresh(bodyEl){
		panelEl = $XH.first(bodyEl, "ixw-dp");
		if (panelEl) return;
		bodyEl.innerHTML = t_dateTpl.renderData("", IX.inherit(ymdArea.getTplData(), hmsArea.getTplData()));
		panelEl = $XH.first(bodyEl, "ixw-dp");
		ymdArea.bind(panelEl);
		hmsArea.bind(panelEl);
	}
	function _change(ymd, hms){
		var value = "";
		if (ymd){
			var arr = [ymd.join("-")];
			hms.length = Math.max(0, dateAreaLen-3);
			if (hms.length>0) arr.push(hms.join(":"));
			value = arr.join(" ");
		}
		srcInputEl && (srcInputEl.value = value);
		onchangeFn(value);
		popTrigger.hide();
	} 

	return {
		/** 
			timeFmt : "hh:mm", // "hh:mm:ss",  default none;
			onchange : function("YYYY-MM-DD hh:mm:ss")
			value : "YYYY-MM-DD hh:mm:ss"
		 */
		show : function(trigger, datefmt, onchange, value){
			dateAreaLen = getLength4DateArea(datefmt);
			IX.isFn(onchange) && (onchangeFn = onchange);
			srcInputEl = $XD.first(trigger, "input");
			_setAreas(srcInputEl ? srcInputEl.value : (value || ""));
			popTrigger.trigger(trigger);
		},

		refresh2Today : _setAreas,
		onclear : function(){_change();},
		onOK : function(){_change(ymdArea.getValue(), hmsArea.getValue());}
	};
})();

var ActionConfigurations =IX.map([
["prevy", function(){ymdArea.changeMonth(-12);}],
["prevm", function(){ymdArea.changeMonth(-1);}],
["year", function(params, aEl){}],
["month", function(params, aEl){}],
["nextm", function(){ymdArea.changeMonth(1);}],
["nexty", function(){ymdArea.changeMonth(12);}],
["day", function(params, aEl){ymdArea.selectDay(aEl);}],

["hour", function(params, aEl){}],
["minute", function(params, aEl){}],
["second", function(params, aEl){}],
["next", function(){hmsArea.changeHMS(-1);}],
["prev", function(){hmsArea.changeHMS(1);}],

["clear", function(){popDPPanel.onclear();}],
["today", function(){popDPPanel.refresh2Today();}],
["ok", function(){popDPPanel.onOK();}]
], function(action){return ["ixw.dp." + action[0], action[1]];});

function showDatePicker(trigger, options){
	if (!$X(DatePickerPopPanelID))
		ixwActionsConfig(ActionConfigurations);
	popDPPanel.show(trigger, $XP(options, "timeFmt", ""), $XF(options, "onchange"), $XP(options, "value", ""));
}

var t_triggerTpl = new IX.ITemplate({tpl :[
'<div class="ixw-dpt {clz}">',
	'<label>{label}：</label>',
	'<a data-href="$ixw.dpt.pick" {attrs}>',
		'<input type="text" id="{id}" value="{value}" disabled/>',
		'<span class="dt-"></span>',
	'</a>',
'</div>'
]});

var dptHT = new IX.IListManager();
var TriggerActionConfigurations = [
["ixw.dpt.pick", function(params, aEl){
	if ($XH.hasClass(aEl.parentNode, "disabled"))
		return;
	var inputEl = $XD.first(aEl, "input");
	var pickFn = dptHT.get(inputEl.id);
	IX.isFn(pickFn) && pickFn(params, aEl, inputEl);
}]];

function DatePickTrigger(cfg){
	var id = $XP(cfg, "id", IX.id()), value = $XP(cfg, "value", "");
	var onchangeFn = IX.emptyFn, fmt = $XP(cfg, "timeFmt", "hh:mm:ss"), isEnable = !$XP(cfg, "disabled");

	var html = t_triggerTpl.renderData("", {
		id : id,
		clz : $XP(cfg, "extraClz", ""),
		label : $XP(cfg, "label", ""),
		attrs : IX.map($XP(cfg, "dataAttrs", []), function(dataAttr){
			return 'data-' + dataAttr[0] + '="' + dataAttr[1] + '"';
		}).join(" "),
		value : isNaN(value)?"": formatDateBySec(value, fmt)
	});

	var inputEl = null, containerEl = null;
	function pick(params, el, inputEl){
		showDatePicker(el, {
			timeFmt : fmt, 
			onchange : function(newValue){
				onchangeFn(ixDate.getTickInSec(newValue), params);
			}
		});
	}
	function _enable(){
		$XH[isEnable?"removeClass":"addClass"](containerEl, "disabled");
	}
	function applyFn(_value){
		value = isNaN(_value)?"":formatDateBySec(_value, fmt);
		inputEl && (inputEl.value = value);
	}
	function bind(onchange, _fmt){
		if(dptHT.isEmpty())
			ixwActionsConfig(TriggerActionConfigurations);
		dptHT.register(id, pick);
		IX.isFn(onchange) && (onchangeFn = onchange);
		!IX.isEmpty(_fmt) && (fmt = _fmt);

		inputEl = $X(id);
		containerEl = $XH.ancestor(inputEl, "ixw-dpt");
		_enable();
	}
	return {
		getHTML : function(){return html;},
		enable : function(){isEnable = true;_enable();},
		disable : function(){isEnable = false;_enable();},
		bind : bind,
		apply : applyFn
	};
}
IX.ns("IXW.Lib");

/** options :{
	timeFmt : "hh:mm", // default none;
	value :"YYYY-MM-DD HH:MM:SS"
	onchange : function(dateString)
  }
 */
IXW.Lib.showDatePicker = showDatePicker; //(trigger, options)

/**	cfg {
	id : used to get value of trigger:$X('id').value;
	value : tickInSec
	disabled : true, //default false,
	extraClz :""
	label : "Text",
	dataAttrs : [["name", "value"]]
 * }
 * return obj : {
		getHTML (),
		enable (),
		disable ()
		bind (onchange(tickInSec, timeFmt)
		apply(tickInSec)
 * }	
 */
IXW.Lib.DatePickTrigger = DatePickTrigger; // (cfg)
IXW.Lib.clearDatePickTrigger = function(){
	dptHT.iterate(function(dpt, dptId){
		!$X(dptId) && dptHT.remove(dptId);
	});
};

})();