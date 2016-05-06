var model = require('../util/model.js');

var moduleModule = model.createModel('modules', [
	"name:string:unique",
	"desc:string",
	"createdAt:date",
	"updatedAt:date"
], 'name');

exports.getByName = function(name, cbFn){
	moduleModule.getByKeys(name, cbFn);
};
