(function(){
IX.ns('IXW.LibD3');
var nsD3 = IXW.LibD3;

var d3BubbleFactory = nsD3.bubbleFactory;
function registerBubbleWorker(svg, model, h, cbFn){
	setTimeout(function(){
		var workerId = IX.id();
		d3BubbleFactory.register(workerId, svg, model.getArea(), h, model.getDesity());
		if(IX.isFn(cbFn)) cbFn(workerId);
	}, 1000);
}
function enableBubbleWorker(workerId, isEnabled){
	d3BubbleFactory.enableWorker(workerId, isEnabled);
}

function calcPolygon4Viewbox(viewbox, rect, polygon){
	var baseCX = viewbox[0] + viewbox[2]/2,
		baseCY = viewbox[1] + viewbox[3]; //底面中心坐标

	var ratio = viewbox[2] / rect[2];
	var _rect = IX.map(rect, function(v){return v * ratio;});
	var dx0 = baseCX - _rect[2]/2, dy0 = baseCY - _rect[3];//底面RECT左上坐标
	var dx = dx0 - _rect[0], dy = dy0 - _rect[1];
	return {
		polygon : IX.map(polygon, function(v){
			return [v[0] * ratio + dx, v[1] * ratio + dy];
		}),
		rect : [dx0, dy0, _rect[2], _rect[3] ],
		center : [baseCX, baseCY - _rect[3] / 2],
		maxH : viewbox[3] - _rect[3] 
	};
}

function RGBAColor(rgb, opacity){
	var _rgb = d3.rgb(rgb);
	return ["RGBA(" + _rgb.r, _rgb.g,_rgb.b,opacity+")"].join(","); 
}
/* item :{
		offset, //控制点0~100%,开始0，最后一个100%, 不指定则为idx/total
		color,   
		opacity //缺省为1
	}
 */		
function createStop(item, idx, total){
	var color = IX.isString(item) ? item : item.color;
	var offset = item.offset || (idx===0? "0%" : (Math.floor(100 * idx / total) + "%"));
	return {
		offset : offset,
		color :color
	};
}
/** lgItem :{
		name : 必须，将被加上prefix前缀	
		vector : [fromX, fromY, toX, toY] // 缺省为 [0,0,0,1]
		stops : [stopItem,...]
	}
 */
function createLinearGradientFilterData(prefix, lgItem){
	var vector = lgItem.vector || [0,0,0,1];
	var stops = lgItem.stops, total = stops.length-1; 
	return {
		name : prefix + "-" + lgItem.name,
		x1 : vector[0], y1 : vector[1], 
		x2 : vector[2], y2 : vector[3],
		stops : IX.map(stops, function(item, idx){
			return createStop(item, idx, total);
		})
	};
}
function tryCreateDefs(namePrefix, linearGradients){
	var defEls = nsD3.getSelfDefinedDefs(namePrefix);
	if (defEls.select("linearGradient").size()==linearGradients.length)
		return;
	var lgEls = defEls.selectAll("linearGradient").data(linearGradients);
	var filters = lgEls.enter().append("linearGradient")
			.attr("id", function(d){return d.name;})
			.attr("x1", function(d){return d.x1;})
			.attr("y1", function(d){return d.y1;})
			.attr("x2", function(d){return d.x2;})
			.attr("y2", function(d){return d.y2;});

	filters.each(function(d){
		d3.select(this).selectAll("stop").data(d.stops).enter().append("stop")
				.attr("offset", function(dd){return dd.offset;})
				.attr("stop-color", function(dd){return dd.color;})
				.attr("stop-opacity", function(dd){return dd.opacity;});
	});
	lgEls.exit().remove();
}
function DefPolygonSchemes(){
	var PolygonSchemeNamePrefix = "polygon-cube4";
	function FilterUrl(name){
		return "url(#" + PolygonSchemeNamePrefix + "-" + name + ")";
	}
	var CubePolygon = [ //缺省立方体的底面顶点坐标
		[0,13],  //[0, 16], // point 0
		[35,0],  //[41, 0], // point 1
		[72, 4],  //[90, 5]  // point 2
		[41,16] //[61,23], // point 3
	];
	var PolygonRect = [0, 0, 72, 16];//包含多边形的最小长方形:[x,y,w,h]
	var linearGradients = IX.map([
		//默认 x1="0" y1="0" x2="0" y2="1" 线性渐变
		{name : "l-front", stops : ["#46c4ff", RGBAColor("#3bedf9", 0.3)]},
		{name : "l-back", stops : [RGBAColor("#46c4ff", 0.3),RGBAColor("#3bedf9", 0.1)]},
		{name : "f-3-0", stops : [RGBAColor("#25c4e1", 0.9),RGBAColor("#25c4e1", 0.1)]},
		{name : "f-3-0-hover", stops : [RGBAColor("#34e0ff", 0.95),RGBAColor("#34e0ff", 0.4)]},
		{name : "f-2-3", stops : [
			RGBAColor("#25c4e1", 0.65),
			{offset:"40%", color : RGBAColor("#25c4e1", 0.3)},
			RGBAColor("#25c4e1", 0.1)
		]},
		{name : "f-2-3-hover", stops : [RGBAColor("#3ee1ff", 0.85),RGBAColor("#3ee1ff", 0.4)]}
	], function(lgItem){
		return createLinearGradientFilterData(PolygonSchemeNamePrefix, lgItem);
	});
	var schemes = {
		"f-top" : RGBAColor("#17e4ff",0.95),
		"f-top-stroke" : "#46c4ff",
		"f-top-hover" : "#1ee5ff",
		"f-0-1-stroke" : FilterUrl("l-back"),
		"f-1-2-stroke" : FilterUrl("l-back"),
		"f-2-3" : FilterUrl("f-2-3"),
		"f-2-3-stroke" : FilterUrl("l-front"),
		"f-2-3-hover" : FilterUrl("f-2-3-hover"),
		"f-3-0" : FilterUrl("f-3-0"),
		"f-3-0-stroke" : FilterUrl("l-front"),
		"f-3-0-hover" : FilterUrl("f-3-0-hover")
	};

	tryCreateDefs(PolygonSchemeNamePrefix, linearGradients);
	return {
		polygon : CubePolygon,
		rect : PolygonRect,
		getSchemeByName : function(segIdx, name){
			var arr = name.split("-"), _name = name;
			if ((segIdx==-1 || segIdx%2 == 1) && arr[arr.length-1] !== "stroke")
				return "RGBA(0,0,0,0)";
			while(arr.length>=1){
				if (_name in schemes) return schemes[_name];
				arr.pop();
				 _name = arr.join("-");
			}
			return "RGBA(0,0,0,0)";
		}
	};
}
var defSchemes = null;

function FrustumBaseModel(viewbox, options, createPtsCalculator){
	var schemes = $XP(options, "schemes");
	if (!schemes){
		if (!defSchemes) 
			defSchemes = new DefPolygonSchemes();
		schemes = defSchemes;
	}
	var base = calcPolygon4Viewbox(viewbox, schemes.rect, schemes.polygon);
	var getSchemeByName = schemes.getSchemeByName;
	var polygon = base.polygon;
	var N_polygon = polygon.length;

	function calcFace(segIdx, name, pts){
		return {
			name : name,
			points : IX.map(pts, function(p){return p.join(" ");}).join(","),
			fill : getSchemeByName(segIdx, name),
			stroke : getSchemeByName(segIdx, name + "-stroke"),
			hover : getSchemeByName(segIdx, name + "-hover")
		};
	}
	function calcFaces(segIdx, pointCalcFn, ifNeedBotFace){
		var faces = [];
		var botPolygon = [], topPolygon = [];
		for (var idx=0; idx<N_polygon; idx++){
			var nextIdx = (idx+1) % N_polygon;
			var pts = pointCalcFn(idx, nextIdx);
			botPolygon.push(pts[0]);
			if (pts.length>3)
				topPolygon.push(pts[3]);
			faces.push(calcFace(segIdx, "f-" + idx + "-" + nextIdx, pts));
		}
		if (ifNeedBotFace)
			faces.unshift(calcFace(segIdx, "f-bot", botPolygon));
		if (topPolygon.length>0)
			faces.push(calcFace(segIdx, "f-top", topPolygon));

		return faces;
	}

	var density = $XP(options, "density", base.rect[2] * base.rect[3] / 400);
	var baseH = $XP(options, "baseH", 5);
	var numOfSegments = $XP(options, "numOfSegments", 1);
	var maxH = base.maxH;
	var unitH = (maxH - numOfSegments * baseH) / options.max;
	var ifShowAvail = $XP(options, "showAvail", false);
	var ptsCalculator = createPtsCalculator(base);

	var data = null, height = 0;
	function pushData(segIdx, fromH, toH){
		var ptsCalcFn = ptsCalculator(fromH, toH, maxH);
		var faces = calcFaces(segIdx, ptsCalcFn, segIdx===0);
		data = data.concat(faces);
	}
	function _calc(values){
		var prevH = 0, nextH = 0;
		data = [];
		for (var i=0; i<numOfSegments; i++){
			nextH = prevH + $XP(values, i+"", 0) * unitH + baseH;
			pushData(i, prevH, nextH);
			prevH = nextH;
		}
		height = prevH;
		if (ifShowAvail && prevH < maxH)
			pushData(-1, prevH, maxH);
	}
	_calc([]);
	return {
		getArea : function(){return polygon;},
		getDesity : function(){return density;},
		getHeight : function(){return height;},
		getData : function(){return data;},
		setValue : function(value){
			_calc((numOfSegments === 1 && !isNaN(value)) ? [].concat(value) : value);
			return data;
		}
	};
}

function FrustumBaseView(gEl, model){
	var facesEl = gEl.selectAll('.polygon').data(model.getData());
	facesEl.enter().append('polygon')
			.attr("class", function(d){return "polygon " + d.name;})
			.attr("fill", function(d){return d.fill;})
			.attr("stroke", function(d){return d.stroke;})
			.attr("points", function(d){return d.points;});

	var mouseoverFn = IX.emptyFn, mouseoutFn = IX.emptyFn;
	gEl.on("mouseover", function(){
		facesEl.attr("fill", function(d){return d.hover;});
		mouseoverFn();
	}).on("mouseout", function(){
		facesEl.attr("fill", function(d){return d.fill;});
		mouseoutFn();
	});

	return {
		setValue : function setValue(v){
			facesEl.data(model.setValue(v)).transition().duration(2000)
					.attr("points", function(d){return d.points;});
		},
		hover : function(fn1, fn2){
			mouseoverFn = IX.isFn(fn1)?fn1 : IX.emptyFn;
			mouseoutFn = IX.isFn(fn2)?fn2 : IX.emptyFn;
		}
	};
}

function createPrismCalculator(base){
	var polygon = base.polygon;

	function getFacePts(idx, nextIdx, dh1, dh2){
		var p = polygon[idx];
		var nextP = polygon[nextIdx];
		return [
			[p[0],     p[1] - dh1], 
			[nextP[0], nextP[1] - dh1],
			[nextP[0], nextP[1] - dh2], 
			[p[0],     p[1] - dh2]
		];
	}
	return function(dh1, dh2, maxH){
		return function(idx, nextIdx){
			return getFacePts(idx, nextIdx, dh1, dh2);
		};
	};
}

function _createPyramidCalculator(base, r){
	var polygon = base.polygon;
	var centerP = base.center;
	var topPt = [centerP[0], centerP[1] - r * base.maxH];
	var shadowPolygon = IX.map(polygon, function(p){
		return [(topPt[0]-p[0])/r, (topPt[1] - p[1])/r];
	});

	function getPtInSegment(p, shadowP, t){
		return [p[0] + shadowP[0] * t, p[1] + shadowP[1] * t];
	}
	function getFacePts(idx, nextIdx, t1, t2){
		var p = polygon[idx];
		var nextP = polygon[nextIdx],
			showdowP = shadowPolygon[idx], 
			nextShowdowP = shadowPolygon[nextIdx];
		var pts = [
			getPtInSegment(p, showdowP, t1),
			getPtInSegment(nextP, nextShowdowP, t1),
			getPtInSegment(nextP, nextShowdowP, t2)
		];
		var pts3 = getPtInSegment(p, showdowP, t2);
		if (pts3[0] != pts[2][0] || pts3[1] != pts[2][1])
			pts.push(pts3);
			
		return pts;
	}
	return function(dh1, dh2, maxH){
		var t1 = dh1 / maxH, t2 = dh2 / maxH;
		return function(idx, nextIdx){
			return getFacePts(idx, nextIdx, t1, t2);
		};
	};
}

var PtsCalculators = {
	"prism" : createPrismCalculator,
	"pyramid" : function(base){
		return _createPyramidCalculator(base, 1);
	},
	"truncated" : function(base){
		return _createPyramidCalculator(base, 5);
	}
};

function FrustumView(svg, viewbox, options){
	var type = $XP(options, "type", "prism");
	var model = new FrustumBaseModel(viewbox, options, PtsCalculators[type]);

	var useBubbles = $XP(options, "useBubbles");
	var values = options.value || [];

	var workerId = null;
	var bubbleEl = useBubbles ? svg.append('g').attr("class", "bubbles") : null;

	var gEl = svg.append('g').attr("class", type);
	var view = new FrustumBaseView(gEl, model);
	view.setValue(values);
	if (useBubbles) {
		registerBubbleWorker(bubbleEl, model, model.getHeight(), function(_id){
			workerId = _id;
		});
	}

	return IX.inherit(view, {
		setVisible : function(visible){
			if (useBubbles) enableBubbleWorker(workerId, visible);
		},
	});
}

/** 在指定显示区域viewbox内显示棱柱/棱锥/棱台
	viewbox : [x,y,w,h]
	options : {
		type : "prism" / "pyramid" / "truncated", 缺省: prism
		schemes : 棱柱配色集,参考DefPolygonSchemes
		max : 最大显示数值 必须为正数
		value : 当前显示数值
		baseH : 最小柱体高度，即当前数值为0时高度
		showAvail : 是否显示剩余数值的柱体
		useBubbles : 是否使用bubbles组件,
		density : 每秒释放的气泡数量
	}
	return {
		setValue : function(v)
		setVisible : function(visible)
		hover : function(overFn, outFn)
	}
 */
nsD3.createFrustum = function(svg, viewbox, options){
	return new FrustumView(svg, viewbox, IX.inherit(options, {
		value : [options.value || 0]
	}));
};
/** 在指定显示区域viewbox内显示多段棱柱/棱锥/棱台
	viewbox : ...
	options : {
		...
		value : [], 当前显示数值集合
		numOfSegments : 总和段数,必须提供
	}
	return {
		...
		setValue : function([v])
	}
 */
nsD3.createFrustumSegments = function(svg, viewbox, options){
	return new FrustumView(svg, viewbox, options)
};
})();