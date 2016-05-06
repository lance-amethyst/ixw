var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var upload =  multer({dest : 'upload_files/'}).any();

var tplStr = [
"<html><script>parent.IXW.Lib.FileUploadedCB({",
	"tkey : '{tkey}',",
	"name : '{name}',",
	"err  : '{msg}'", 
"});</script></html>"].join("\n");

function uploadRsp(res, tkey, err, name){
	res.type('html');
	res.send(tplStr.replaceByParams({
		tkey : tkey,
		name : name || "",
		msg : err || ""
	}));
}

/* Upload file. */
router.post('/', function(req, res, next) {
	upload(req, res, function(err){
		var file = req.files[0];
		var tkey = req.body.tkey;
		if (file.mimetype != "text/csv")
			return uploadRsp(res, tkey, "目前只接受CSV文件格式，请转换后再行提交。");

		var fname = IX.UUID.generate();
		IX.safeRenameAsSync(file.path, path.join(__dirname, "../files"), "tmp", fname);
		uploadRsp(res, tkey, null, fname);
	});
});

module.exports = router;