require("../_lib/ix.js");

var premap = require("./index.js");

premap({}, {
	premap: {
		src:"../../_mapdata", 
		dest : "../../src/topojson"
	}
}, IX.emptyFn);

