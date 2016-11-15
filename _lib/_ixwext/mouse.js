(function(){
var params = {
	flag : false,
	currentX : 0, currentY : 0,
	moveFn : IX.emptyFn
};
IX.bind(document, {
	mouseup : function(){params.flag = false;},
	mousemove : function(e){
		if(!params.flag)
			return;
		var dx =params.currentX - e.clientX, dy = params.currentY - e.clientY;
		params.currentX = e.clientX;
		params.currentY = e.clientY;
		params.moveFn({dx:dx, dy:dy});
	}
});
IXW.draggable = function(el, exptFn, fn){
	el.onselectstart = function(){return false;};
	IX.bind(el, {
		mousedown : function(e){
			if (exptFn(e)) return;
			params.moveFn = fn;
			params.currentX = e.clientX;
			params.currentY = e.clientY;
			params.flag = true;
		}
	});
};

IXW.onmousewheel = function(el, fn){
	if (el.addEventListener)
		el.addEventListener('DOMMouseScroll', function(evt){
			//var deltaY = evt.detail * 10;
			fn({dx:0, dy : evt.detail * 10 });
		}, false);
    el.onmousewheel = function(event) {
		var evt = event || window.event;
		fn({dx : evt.wheelDeltaX/10, dy : evt.wheelDeltaY/10});
    };
};
})();