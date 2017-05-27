(function(){
function getAttrTween(vb, viewbox){
	var vb0 = viewbox[0] - vb[0],
		vb1 = viewbox[1] - vb[1],
		vb2 = viewbox[2] - vb[2],
		vb3 = viewbox[3] - vb[3];
	return function(){
		return function(t){ return [
			vb[0] + t*vb0, 
			vb[1] + t*vb1, 
			vb[2] + t*vb2, 
			vb[3] + t*vb3, 
		].join(" ");};
	};
}
function commonCalcViewbox(viewportAreaW, viewportAreaH, ratio, minVisibleAreaW, minVisibleAreaH) {
	var r = Math.max(ratio, minVisibleAreaW/viewportAreaW, minVisibleAreaH/viewportAreaH);
	var viewW = r * viewportAreaW;
	var viewH = r * viewportAreaH;
	return [-0.5 * viewW, -0.5 * viewH, viewW, viewH];
}
/** graphClz : function(svg){ // svg = d3.select('SVG')
		return {
			resize : function(visibleW, visibleH)
			scale : function(r)
		}
	}

	options : {
		minVisibleArea : [], //optional, [minWidth, minHeight]
		calViewbox : function(
				viewportAreaW, viewportAreaH,
				ratio, 
				minVisibleAreaW, minVisibleAreaH) {
			return [viewboxX, viewboxY, viewboxW, viewboxH];
		}
	}
	return IX.inherit(graph(svg), {
		resize : function()
		move : function(dx, dy)
		scale : function(r)
	})
 */
function Wrapper(container, graphClz, options){
	var ratio = 1, dx = 0, dy = 0, baseX = 0, baseY = 0
	var minAreaW = $XP(options, "minVisibleArea.0", 0),
		minAreaH = $XP(options, "minVisibleArea.1", 0);
	var viewbox = null;

	var calcFn = $XP(options, "calcViewbox", commonCalcViewbox);	

	container.innerHTML = "";
	var svg = d3.select(container).append("svg");
	var _graph = graphClz(svg);

	function _resize(){
		var w = container.offsetWidth, h = container.offsetHeight;
		var vb = viewbox || [0 - w / 2, 0 - h / 2, w, h];
		
		viewbox = calcFn(w, h, ratio, minAreaW, minAreaH);
		baseX = viewbox[0]; baseY = viewbox[1];
		viewbox[0] = baseX + dx; viewbox[1] = baseY + dy;
		svg.transition().duration(1000).attr("width", w).attr("height", h)
				.attrTween("viewBox", getAttrTween(vb, viewbox));

		_graph.resize(viewbox[2], viewbox[3]);
	}
	_resize();
	return IX.inherit(_graph, {
		resize: _resize,
		move : function(_dx, _dy){
			dx += _dx; dy += _dy;
			viewbox[0] = baseX + dx; viewbox[1] = baseY + dy;
			svg.attr("viewBox", viewbox.join(" "));
		},
		getCenter: function(){return [dx, dy]; },
		setCenter: function(xy){
			dx = xy[0]; dy = xy[1];
			viewbox[0] = baseX + dx; viewbox[1] = baseY + dy;
			svg.attr("viewBox", viewbox.join(" "));
		},
		scale : function(r){
			ratio = 1/r;
			_graph.scale(ratio);
			_resize();
		}
	});
}

IX.ns('IXW.LibD3');
var nsD3 = IXW.LibD3;
/** 以坐标(0,0)为中心；可放大缩小，拖放；	

	options : {
		draggable : true /false, //default: true,
		dragExptFn : function(target){return true/false; }// if true, don't drag;
		calViewbox : function(
				viewportAreaW, viewportAreaH,
				ratio, 
				minVisibleAreaW, minVisibleAreaH) {
			return [viewboxX, viewboxY, viewboxW, viewboxH];
		}
	}
	return IX.inherit(graph(svg), {
		resize : function()
		move : function(dx, dy)
		scale : function(r)
	})
 */
nsD3.GraphWrapper = function(container, graphClz, options){
	var _graph = new Wrapper(container, graphClz, options);
	var draggable = (options && "draggable" in options) ? options.draggable : true;
	var dragExptFn = $XP(options, "dragExptFn");
	var _dragExptFn = IX.isFn(dragExptFn)? function(e){
		return dragExptFn(e.target);
	} : function(e){return false;};

	if (draggable)
		IXW.draggable(container, _dragExptFn, function(evt){
			_graph.move(evt.dx, evt.dy);
		});
	return _graph;
};

/** 以坐标(0,0)为左上顶点；不改变比例，最大化展示，不放大，自动缩小，不可拖放;

	return IX.inherit(graph(svg), {
		resize : function()
		move : function(dx, dy)
	})
 */
nsD3.AreaWrapper = function(container, graphClz, minWidth, minHeight){
	return IX.inherit(new Wrapper(container, graphClz, {
		minVisibleArea : [minWidth || 0, minHeight || 0],
		calcViewbox : function(w, h, r, minW, minH){
			var vb = commonCalcViewbox(w, h, r, minW, minH);
			return [vb[0] + minW/2, vb[1] + minH/2, vb[2], vb[3]];
		}
	}), {scale : function(){}});
};
/** 以坐标(0,0)为左上顶点；不改变比例，按指定尺寸尽可能铺满容器，不可拖放；

	return IX.inherit(graph(svg), {
		resize : function()
	})
 */
nsD3.FullfillWrapper = function(container, graphClz, width, height){
	return IX.inherit(new Wrapper(container, graphClz, {
		minVisibleArea : [width, height],
		calcViewbox : function(w, h, r, minW, minH){
			var vb = commonCalcViewbox(w, h, 0, minW, minH);
			return [vb[0] + minW/2, vb[1] + minH/2, vb[2], vb[3]];
		}
	}), {scale : function(){}});
};
})();