var util = require('util');
var encodinglib = require("encoding");

function detectCharset(buf){
	var idx = 0, n=0, len = buf.length;
	//IX.log("detectchars: " + util.inspect(buf));
	while(idx<len){
		//IX.log("detect :" + idx);
		var byte = buf[idx];
		if(byte<0x80) n=1;		// 0XXX XXXX
		else if (byte<0xc0) return "gbk";// 1000 0000 -- 1011 1111
		else if (byte<0xe0) n=2;		// 1100 0000 -- 1101 1111
		else if (byte<0xf0) n=3;	// 1110 0000 -- 1110 1111
		else if (byte<0xf8) n=4;	// 1111 0000 -- 1111 0111
		else if (byte<0xfc) n=5;	// 1111 1000 -- 1111 1011
		else if (byte<0xfe) n=6;	// 1111 1100 -- 1111 1101
		else  return "gbk";			// 1111 1110 -- 1111 1111
		//IX.log("n  " + n);
		for (var i=1; i<n; i++){
			byte = buf[idx + i];
			if (byte<0x80 || byte>=0xC0) // 1000 0000 -- 1011 1111
				return "gbk";
		}
		idx += n;
	}
	return "utf-8";
}

exports.covet2UTF8 = function (buf){
	var charset = detectCharset(buf);
	//console.log("detected: ", charset);
	return charset == "utf-8" ? buf : encodinglib.convert(buf, "utf-8", charset);
};
