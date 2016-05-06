var model = require('../util/model.js');

var userCache = model.createCache('users', [
	"id::unique",
	"name:string:unique",
	"password:hash",
	"type",
	"desc:json",
	"createdAt:date",
	"updatedAt:date"
], 'name');

exports.getByName = function(name, cbFn){
	userCache.getByKeys(name, cbFn);
};
