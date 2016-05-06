require('./service/util/ix.js');
require('./service/lib/consts.js');
var dblib = require('./service/util/dblib.js');

var pkg = require('./package.json');
var cfg = require('./config.js');

var pkgName = pkg.name;
var isInDevelopment = cfg.env == "development";
var mysqlCfg = cfg.mysql;
dblib.init(mysqlCfg.db || pkgName, mysqlCfg);

var appCfg = cfg.service;

global.debugIsAllow = function(){
	return true;
};

global.IXS = {
	getProjectName : function(){return pkgName;},
	isInDevelopment : function(){return isInDevelopment;},
	sendResult : function(res, data){
		res.json({
			retCode : 1,
			data : data
		});
	},
	sendError : function errHandler(res, err, ifStackTrace){
		console.log(err);
		res.status(err.status || 200);
		res.json({
			retCode: 0,
			err : err.message,
			error: ifStackTrace ? err : {}
		});
	}
};

exports.getPort = function(){
	return $XP(appCfg, "port", 3000);
};

exports.useHTTPS = function(){
	return !!appCfg.useHTTPS;
};

exports.getOptions = function(){
	return appCfg.credentials;
};

