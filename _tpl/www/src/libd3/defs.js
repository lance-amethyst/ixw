(function(){
var defsHT = {};
var currentDefsHTML = "";

function getDefSvg(){
	var svg = d3.select("svg#svg-defs");
	if (!svg[0][0])
		svg = d3.select("body").append("svg").attr("id", "svg-defs")
			.attr("width", 0).attr("height", 0);
	return svg;
}

IX.ns('IXW.LibD3');
var nsD3 = IXW.LibD3;
function load(svg){
	var dummy = document.createElement('div');
		dummy.innerHTML = '<svg>' + currentDefsHTML + '</svg>';
	var svgChildNodes = dummy.childNodes[0].childNodes;
	while(svgChildNodes.length){
		svg.node(0).appendChild(svgChildNodes[0]);
	}
}
nsD3.loadDefs = function(defsUrl){
	if (defsUrl in defsHT)
		return;
	d3.text(defsUrl, function(xml){
		defsHT[defsUrl] = true;
		currentDefsHTML += xml;
		load(getDefSvg());
	});
};
nsD3.restoreDefs = function(){
	var svg = getDefSvg();
	svg.selectAll("*").remove();
	load(svg);
};
nsD3.getSelfDefinedDefs = function(key){
	var svg = getDefSvg();
	var defsEl = svg.select("defs#" + key);
	if (!defsEl[0][0])
		defsEl = svg.append("defs").attr("id", key);
	return defsEl;
};

})();