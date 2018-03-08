(function(){
IX.ns('IXW.LibD3');
var nsD3 = IXW.LibD3;

nsD3.commonCalcViewbox = function(viewportAreaW, viewportAreaH, ratio, minVisibleAreaW, minVisibleAreaH) {
	var r = Math.max(ratio, 
			minVisibleAreaW/viewportAreaW, 
			minVisibleAreaH/viewportAreaH);
	var viewW = r * viewportAreaW;
	var viewH = r * viewportAreaH;
	return [-0.5 * viewW, -0.5 * viewH, viewW, viewH];
};

})();