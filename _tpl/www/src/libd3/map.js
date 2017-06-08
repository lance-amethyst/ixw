(function(){
IX.ns('IXW.LibD3');
var nsD3 = IXW.LibD3;

/*  mapData : {
		root: topojson,
		center:  [longtitude, latitude],
		scale : 0.021
	}
	return {
		getXY4Site: geoproject,
		getGeoPath: function(){ return geopath; },
		getGeoBound: function(){ return merged; },
		getGeoData: function(){ return geodata; }
	}	
 */
nsD3.GeoModel = function(mapData){
	var toporoot = mapData.root;
	var geoproject = d3.geo.mercator()
			.center(mapData.center)
			.scale(mapData.scale)
			.translate([0, 0]);
	var geopath = d3.geo.path();
	var topoCollection = toporoot.objects.collection;
	var georoot = topojson.feature(toporoot, topoCollection);
	var geodata = georoot.features;
	var merged = topojson.merge(toporoot, topoCollection.geometries);

	geopath.projection(geoproject);
	return {
		getXY4Site: geoproject,
		getGeoPath: function(){ return geopath; },
		getGeoBound: function(){ return merged; },
		getGeoData: function(){ return geodata; }
	};
};
/** 
	reserved layer names : map, over;
	default layers : map
	extraLayerNames: ["bound", "data", "over", "alarm"];

 */
nsD3.LayerMap = function(gEl, model, extraLayerNames){
	var geopath = model.getGeoPath();
	var geoData = model.getGeoData();
	var layerNames = ["map"].concat(extraLayerNames);
	var layerHT = {}, mapLayer = null;

	var focusedCb = IX.emptyFn;
	
	function getPart(d){ return mapLayer.select(".p" + d.properties.id); }
	function hover(d, isOn){ getPart(d).classed("hover", isOn); }
	function clickOn(d){
		var partEls = getPart(d);
		var isFocused = partEls.classed("focused");
		mapLayer.selectAll(".focused").classed("focused", false);
		focusedCb(d, !isFocused)
		if (!isFocused)
			partEls.classed("focused", true);
	}

	IX.iterate(layerNames, function(layerName){
		var layer = gEl.append("g").attr("class", layerName + "-layer");
		var layerData = null;

		layerHT[layerName] = layer;
		if (layerName != "map" && layerName != "over")
			return;
		layer.selectAll(".part").data(geoData).enter().append("path")
				.attr("d", geopath)
				.attr("class", function(d){ return "p" + d.properties.id + " part"; });
	});
	mapLayer = layerHT.map;
	if ("over" in layerHT)
		layerHT.over.selectAll("path")
				.on("click", clickOn)
				.on("mouseover", function(d){hover(d, true);})
				.on("mouseout", function(d){hover(d, false);});

	return {
		getModel : function(){return model;},
		getLayerByName : function(name){return layerHT[name];},
		onfocus : function(fn){if(IX.isFn(fn)) focusedCb = fn;},

		focus : function(id){
			var data =  mapLayer.select(".p" + id).data();
			clickOn(data[0]);
		},

		resize : function(w, h, viewbox){},
		scale : function(r){}
	};
};
})();