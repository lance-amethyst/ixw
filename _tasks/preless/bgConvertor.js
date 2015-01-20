var fs = require('fs');
var util = require('util');

var lessTpl = Preless.lessTpl;

function getFileInfoList(srcPath, clzPrefix){
	function base64_encode(filename) {
		return new Buffer(fs.readFileSync(srcPath + "/" + filename)).toString('base64');
	}
	var files = fs.readdirSync(srcPath);
	//console.info("background list :\n\t" + util.inspect(files));
	var list = [];
	files.forEach(function (fname) {
		// get style info by filename: h_22_name.png/v_18_name.png
		var arr = fname.split(".");
		if (arr.length!=2 || arr.pop().toLowerCase()!="png")
			return;
		//console.info("background  :\n\t" + fname);
		var clzName = arr[0]; 
		var arr1 = clzName.split("_");
		var isH = arr1[0].toLowerCase() == 'h';
		list.push({
			prefix : clzPrefix,
			name : clzName,
			info : (isH?"height:":"width:") + arr1[1] + "px;",
			data : base64_encode(fname),
			direct : isH ? 'repeat-x' : 'repeat-y'
		});
	});
	return list;
}
/** cfg :{
 *		path : the filename for generated less file
 *		classPrefix : prefix for all background in src folder
 * 		src : the direction contain origin background images
 * 		dest : directoy to contain less file
 * 		demoDest : directory to contain demo files
 * } 
 */
exports.merge = function(cfg, cb) {
	var clzPrefix = cfg.classPrefix || "bg";
	var list = getFileInfoList(cfg.src, clzPrefix);
	if (list.length==0)
		return cb(null);
	//console.info("backgrounds : " + clzPrefix + "::" + util.inspect(list));
	
	var lessStr = lessTpl.renderData("", {
		bg : list,
		pic : []
	});
	//console.info("backgrounds : " + lessStr);
	var bgPath = cfg.path;
	var destFile = "/less/" + bgPath + ".less";
	var demoDest = cfg.demoDest; 

	IX.safeWriteFileSync(cfg.dest + destFile, lessStr);
	console.log("Output background css to " + destFile);
	if (!demoDest)
		return cb(null);
	IX.safeWriteFileSync(demoDest + destFile, lessStr);
	cb({
		type : "bg",
		path : bgPath,
		prefix : clzPrefix,
		list : list
	});
};