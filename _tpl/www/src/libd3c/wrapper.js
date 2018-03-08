(function(){
IX.ns('IXW.LibD3');
var nsD3 = IXW.LibD3;
var commonCalcViewbox =  nsD3.commonCalcViewbox;

/** graphClz : function(ctx, canvasEl){ // ctx = canvas.context
		return {
			paint: function()
			pickAt: function(x, y){retun node;} // 判断(x, y)是否对应某个目标
			resize : function(visibleW, visibleH)
			scale : function(r)
		}
	}

	options : {
		minVisibleArea : [], //optional, [minWidth, minHeight]
		calcViewbox : function(
				viewportAreaW, viewportAreaH,
				ratio, 
				minVisibleAreaW, minVisibleAreaH) {
			return [viewboxX, viewboxY, viewboxW, viewboxH];
		}
	}
	return IX.inherit(graph(ctx), {
		paint : function()
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

	var canvasEl = d3.select(container).append("canvas")
			.style("width", "100%")
			.style("height", "100%");
	var canvas = canvasEl.node();
	var ctx = canvas.getContext("2d");

	var _graph = graphClz(ctx, canvas);

	function _paint(){
		var width = viewbox[2], height = viewbox[3];

		canvas.width=width;
		canvas.height=height;
		ctx.clearRect(0 - dx, 0 - dy, width, height);
		ctx.save();
		ctx.translate(width / 2 - dx, height / 2 - dy);

		_graph.paint();

		ctx.restore();
	}

	function _resize(){
		var w = container.offsetWidth, h = container.offsetHeight;
		var vb = viewbox || calcFn(w, h, ratio, minAreaW, minAreaH); //[0 - w / 2, 0 - h / 2, w, h];
		
		viewbox = calcFn(w, h, ratio, minAreaW, minAreaH);
		baseX = viewbox[0]; baseY = viewbox[1];
		viewbox[0] = baseX + dx; viewbox[1] = baseY + dy;

		_graph.resize(viewbox[2], viewbox[3]);

		_paint();
	}
	_resize();

	return IX.inherit(_graph, {
		resize: _resize,
		paint: _paint,
		pickAt: function(x, y){
			//console.log("pick:", viewbox, x, y);
			return _graph.pickAt(viewbox[0] + x, viewbox[1] + y);
		},
		move : function(_dx, _dy){
			//console.log("move: ", _dx, _dy);
			dx += _dx; dy += _dy;
			viewbox[0] = baseX + dx; viewbox[1] = baseY + dy;
			_paint();
		},
		getCenter: function(){return [dx, dy]; },
		setCenter: function(xy){
			dx = xy[0]; dy = xy[1];
			viewbox[0] = baseX + dx; viewbox[1] = baseY + dy;
			_paint();
		},
		scale : function(r){
			ratio = 1/r;
			_graph.scale(ratio);
			_resize();
		}
	});
}

IX.ns('IXW.LibD3c');
var nsD3c = IXW.LibD3c;
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
	return IX.inherit(graph(ctx), {
		resize : function()
		move : function(dx, dy)
		scale : function(r)
	})
 */
nsD3c.GraphWrapper = function(container, graphClz, options){
	var _graph = new Wrapper(container, graphClz, options);
	var draggable = (options && "draggable" in options) ? options.draggable : true;
	var dragExptFn = $XP(options, "dragExptFn");
	if (!IX.isFn(dragExptFn))
		dragExptFn = function(){return false;};

	function dragSubject(){
		var evtX = d3.event.x, evtY = d3.event.y;
		var node =  _graph.pickAt(evtX, evtY);
		return dragExptFn(node) ? node : {type: null, x: evtX, y: evtY};
	}
	function dragHandler(){
		var subject = d3.event.subject;
		var evtDx = d3.event.dx, evtDy = d3.event.dy;
		if (!subject.type) // drag on the canvas
			return _graph.move(0 - evtDx, 0 - evtDy );
		subject.x += evtDx;
		subject.y += evtDx;
		_graph.paint();
	}

	if (draggable) {
		var canvas = $XD.first(container, "canvas");
		d3.select(canvas).call(d3.drag().container(canvas)
	        .subject(dragSubject)
	        .on("drag", dragHandler));
	}
	return _graph;
};

})();