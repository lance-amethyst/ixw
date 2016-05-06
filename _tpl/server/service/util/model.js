var dblib = require('../util/dblib.js');

function parseFieldDef(fieldDef){
	var arr = fieldDef.split(":");
	var field = {name: arr[0], type : ""};
	if (arr.length>1)
		field.type = arr[1];
	return field;
}

function isEmpty(keys){
	return keys === null || keys === undefined || keys=='' || keys.length == 0;
}

function createModel(tblName, cols, keyColName){
	var jsonColsList = [];

	var fieldHT = dblib.register(tblName, IX.map(cols, function(col){
		var field = parseFieldDef(col);
		if (field.type == "json") {
			field.isJSON = true;
			jsonColsList.push(field.name);
		}
		field.isUnique = col.indexOf(":unique")>0;
		return field;
	}));
	function formatRows(rows){
		IX.iterate(rows, function(row){
			//console.log("formatRows:", tblName, jsonColsList, row);
			IX.iterate(jsonColsList, function(colName){
				var val = row[colName];
				row[colName] = IX.isEmpty(val) ? null : JSON.parse(val);
			});
		});
		return rows;
	}
	function find(whereStmt, cbFn){
		if(!IX.isFn(cbFn)) {
			console.log("find:" , whereStmt);
			throw new Error("STCT");
		}
		var dbInst = dblib.getInstance(tblName);
		dbInst.find(whereStmt, function(err, rows){
			IX.isFn(cbFn) && cbFn(formatRows(rows));
		});
	}

	return {
		_getFieldHT : function(){
			return fieldHT;
		},
		_getInst : function(dbConn){
			return dblib.getInstance(tblName, dbConn);
		},
		_getWhereStmt : function(names, vals){
			var defs = IX.isArray(names) ? fieldHT.getByKeys(names) : fieldHT.get(names);
			return dblib.getWhereStmt(defs, vals);
		},
		_getAssignStmt : function(names, vals){
			var defs = IX.isArray(names) ? fieldHT.getByKeys(names) : fieldHT.get(names);
			return dblib.getAssignStmt(defs, vals);
		},

		find : function(whereStmt, cbFn){
			find(whereStmt, cbFn);
		},
		findAll : function(cbFn){
			find('', cbFn);
		},
		getByKeys : function(values, cbFn){
			var whereStmt = isEmpty(values) ? '' : dblib.getWhereStmt(fieldHT.get(keyColName), values);
			find(whereStmt, cbFn);
		}
	};
}

function createCache(tblName, model, keyName){
	var beanHT = null;

	function getFromHT(keys){
		var _values = isEmpty(keys) ? beanHT.getKeys() : keys;

		return IX.isArray(_values) ? IX.Array.compact(beanHT.getByKeys(_values)) : beanHT.get(_values);
	}
	function load(cbFn){
		model.findAll(function(rows){
			IX.iterate(rows, function(row){
				beanHT.register(row[keyName], row);
			});
			IX.isFn(cbFn) && cbFn();
		});
	}
	function tryHT(cbFn){
		if(beanHT)
			return cbFn();
		beanHT = new IX.IListManager();
		load(cbFn);
	}

	return {
		getModel : function(){
			return model;
		},
		reload : function(cbFn){
			if (!beanHT)
				beanHT = new IX.IListManager();
			else beanHT.clear();
			load(cbFn);
		},
		getByKeys : function(keys, cbFn){
			tryHT(function(){
				cbFn(getFromHT(keys));
			});
		},
		getKeys : function(cbFn){
			tryHT(function(){
				cbFn(beanHT.getKeys());
			});
		}
	};
}

exports.createModel = function(tblName, cols, keyColName){
	return createModel(tblName, cols, keyColName);
};
exports.createCache = function(tblName, cols, keyColName){
	var model = createModel(tblName, cols, keyColName);
	return createCache(tblName, model, keyColName);
};
