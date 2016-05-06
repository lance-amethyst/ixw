/**	
 * 	Date : 2016-04-15 
 *  Author : Lance, GE
 *  Interface :
 		exports.init = function(dbCfg);
		exports.register = function(tableName, cols){};
		exports.getInstance = function(tableName);
		exports.getAssignStmt = function(fields, vals);
		exports.getWhereStmt = function(fields, vals);
		exports.getTransaction = function(isolevel)
 *  		
 */

var util = require('util');
var mysql = require('mysql');

var sqlStrLib = require("../../node_modules/mysql/lib/protocol/SqlString.js");
var digest = require("./digest.js");

function toSqlHash(value){return sqlStrLib.escape(digest.digestOnce(value || ''));}
function toSqlJSON(obj){return sqlStrLib.escape(JSON.stringify(obj || {}));}
function toSqlStr(str){return sqlStrLib.escape(""+str);}
function toSqlDate(value){return value?("'" + IX.Date.format4Tag(value) + "'" ): "now()";}

function toDTName(name){return '`' + name + '`';}

function getFn4SqlData(fieldType){
	switch(fieldType){
	case "hash" :
		return toSqlHash;
	case "json" :
		return toSqlJSON;
	case "string": 
		return toSqlStr;
	case "date" :
	case "datetime" : 
		return toSqlDate; 

	case '_TBL' :
	case '_COL' :
		return toDTName;

	default : 
		return function(v){return v || 0;};
	}
}

function getPartStmt(field, val){
	var fn4SqlData = getFn4SqlData(field.type);
	var s = [toDTName(field.name)];
	if (IX.isArray(val)){
		s.push("IN (");
		s.push(IX.map(val, fn4SqlData).join(', '));
		s.push(")");
	} else {
		s.push("=");
		s.push(fn4SqlData(val));
	}
	return s.join(" ");
}

var getDBConn = null;
var ErrorSqlPath = "/tmp/error_sql";

var SetIsoLevelSql = "SET SESSION TRANSACTION ISOLATION LEVEL {level}";
var defaultIsoLevel = "REPEATABLE READ";

var StartTransactionSql = "START TRANSACTION";
var CommitSql = "COMMIT";
var RollbackSql = "ROLLBACK";
var LockSql = "LOCK TABLES {tbls}";
var UnlockSql = "UNLOCK TABLES";

function DBTransaction(isolevel){//isolevel :"READ COMMITTED", default : "REPEATABLE READ"
	var db = null;
	var tid =  null;
	var isLocked = false;
	
	function _query(_db, sql, txInfo, fn){
		if (!_db)
			return fn(null);
		debugIsAllow("db-trans") && IX.log(txInfo + " for " + tid);
		_db.query(sql, function(err, result){
			if (err) {
				IX.safeWriteFileSync(ErrorSqlPath + "/err_" + (IX.getTimeInMS()) + ".sql", sql);
				IX.err(txInfo + " failed:" + util.inspect(err));
			}
			debugIsAllow("db-trans") && IX.log("done for " +  tid);
			fn(err, result);
		});
	}

	function lock(_db, tnames, fn){
		var sql = LockSql.replaceAll("{tbls}",  IX.map(tnames, function(tname){
			return '`' + tname + '` write';
		}).join(", "));
		debugIsAllow("db-lock") && IX.log("lock table : [" + tnames  + "] for " + tid);
		_query(_db, sql, "lock tables", function(err, result){
			if (!err) isLocked = true;
			fn(err, result);
		});
	}

	function tryUnlock(_db, fn){
		if (!isLocked)
			return fn(null);
		debugIsAllow("db-lock") && IX.log("unlock table for " + tid);
		_query(_db, UnlockSql, "unlock tables", function(err, result){
			isLocked = false;
			fn(err, result);
		});
	}

	function _setIsoLevel(_db, level, cbFn) {
		if (!isolevel)
			return cbFn();
		var sql = SetIsoLevelSql.replaceAll("{level}", level);
		_query(_db, sql, "set isolation level = " + level , cbFn);
	}

	function _start(dbConn, fn){
		if (!dbConn)
			fn();
		db = dbConn;
		tid = IX.id();
		_setIsoLevel(db, isolevel, function(){
			_query(db, StartTransactionSql, "start transaction", fn);
		});
	}	

	function _end(_db){
		debugIsAllow("db_conn") && IX.log("DB_REAL close connecton.");
		_setIsoLevel(_db, defaultIsoLevel, function(){
			_db.release();
		});
	}

	return {
		start : function(fn){
			debugIsAllow("db_conn") && IX.log("DB_REAL open connecton!");
			getDBConn(function(dbConn){
				_start(dbConn, fn);
			});
		},
		query : function(sql, fn){
			var _partSql = sql.substring(0, 200);
			_query(db, sql, "query[" + _partSql + "]", function(err, result){
				if (!err || err.code != 'ER_LOCK_WAIT_TIMEOUT')
					return fn(err, result);
				// caused by transaction block, retry it!!!;
				IX.err("transaction blocked! re-execute SQL ::\n\t" + _partSql);
				return _query(db, sql, "re-query[" + _partSql + "]" , fn);
			});
		},
		phaseCommit : 	function(fn){
			_query(db, CommitSql, "transaction phase-commit", function(){
				_query(db, StartTransactionSql, "restart transaction", fn);
			});
		},
		lock : function(tnames, fn){lock(db,tnames,fn);},
		unlock : function(fn){tryUnlock(db, fn);},
		end : function(stat, fn){
			if (!db) 
				return;
			var _db = db;
			db = null;

			_query(_db, stat == "fail"? RollbackSql: CommitSql, "end transaction", function(){
				tryUnlock(_db, function(){
					_end(_db);
				});
				fn(null);
			});
		}
	};
}

var SelectSql = "SELECT * FROM `{tbl}`";
var BatchIgnorInsertSql = "INSERT IGNORE INTO `{tbl}` ({fields}) VALUES {values}";
var BatchUpdateInsertSql = "INSERT INTO `{tbl}` ({fields}) VALUES {values} ON DUPLICATE KEY UPDATE {cols}";
var UpdateSql = "UPDATE `{tbl}` SET {stmts}";
var DeleteSql = "DELETE FROM `{tbl}`";

function daoClass(dbConn, tblName, fieldHT){
	function _getDBConn(fn){
		if (dbConn)
			fn(dbConn);
		else getDBConn(function(dbc){
			fn(dbc, true);
		});
	}

	function query(sql, cbFn){
		_getDBConn(function(dbc, shouldDestroy){
			dbc.query(sql, function(err, result){
				//console.log("query:" , sql, err, result);
				cbFn(err, result);
				if (shouldDestroy)
					dbc.release();
			});
		});
	}

	function getSelectSql(whereStmt){
		return SelectSql.replaceAll("{tbl}", tblName) + (whereStmt || "");
	}

	function _getParams4InsertSql(fields, beans){
		var _fields = IX.map(fields, function(field){
			return toDTName(field.name);
		});
		var _values = IX.map(beans, function(bean){
			var fieldValues = IX.map(fields, function(field){
				var fn4SqlData = getFn4SqlData(field.type);
				return fn4SqlData(bean[field.name]);
			});
			return '('+ fieldValues.join(',') + ')';
		});
		return {
			tbl : tblName,
			fields : _fields.join(', '),
			values : _values.join(', ')
		};
	}
	function getInsertSql(beans){
		var allFields = IX.Array.remove(fieldHT.getAll(), {name:"id"}, function(a,b){
			return a.name == b.name;
		});
		var params = _getParams4InsertSql(allFields, beans);
		//console.log("insert ignore into ", tblName, beans, params);
		return BatchIgnorInsertSql.replaceByParams(params);
	}

	function getOverWriteSql(fieldNames, beans){
		var overwriteFieldNames = IX.loop(fieldNames, [], function(acc, name){
			if (name == "id") return acc;
			acc.push(toDTName(name));
			return acc;
		});
		var params = _getParams4InsertSql(fieldHT.getByKeys(fieldNames), beans);
		params.cols = overwriteFieldNames.join(', ');
		return BatchUpdateInsertSql.replaceByParams(params);
	}

	function getUpdateSql(fieldFomulas, whereStmt){
		return UpdateSql.replaceAll("{tbl}", tblName)
				.replaceAll("{stmts}", fieldFomulas) + " "  +(whereStmt || "");
	}
	function getDeleteSql(whereStmt){
		return DeleteSql.replaceAll("{tbl}", tblName) + (whereStmt || "");
	}

	return {
		find : function(whereStmt, cbFn){
			query(getSelectSql(whereStmt), cbFn);
		},
		insert : function(beans, cbFn){
			query(getInsertSql(beans), cbFn);
		},
		overwrite : function(fieldNames, beans, cbFn){
			query(getOverWriteSql(fieldNames, beans), cbFn);
		},
		update : function(fieldFomulas, whereStmt, cbFn){
			query(getUpdateSql(fieldFomulas, whereStmt), cbFn);
		},
		delete : function(whereStmt, cbFn){
			query(getDeleteSql(whereStmt), cbFn);
		},
		query : query
	};
}

/*
	check Base mysql setting:
 */
function checkPacketSize(conn, fn){
	conn.query("show VARIABLES like 'max_allowed_packet'", function(err, result){			
		conn.maxAllowedPacketSize = $XP(result, "0.Value", 1000000);
		if (conn.maxAllowedPacketSize < 16000000)
			IX.err("WARNING: mysql.max_allowed_packet < 16M, please reset it!!!");
		else if(debugIsAllow("db_conn"))
			IX.log("max : " + conn.maxAllowedPacketSize);
		fn(conn);
	});

}
function useDB(conn, dbname, fn){
	conn.query("use " + dbname, function(err){
		if (err){
			IX.err("open database " +dbname + " fail : " + err);
			conn.end();
			return fn(null);
		}
		debugIsAllow("db_conn") && IX.log("opened:" + dbname);
		checkPacketSize(conn, fn);
	});
}

exports.init = function(dbname, dbCfg){
	var pool = mysql.createPool(IX.inherit({
		"user" : "root", 
		"password" : "root",
		"charset": 'UTF8MB4_UNICODE_CI',
		// 给MySql Pool的配置项
		"connectionLimit" : 16
	}, dbCfg));
	getDBConn = function db_exec(fn){
		pool.getConnection(function(err, conn){
			err && IX.err("connect mysql fail : " + err);
			if (!conn)
				return fn(null);
			debugIsAllow("db_conn") && IX.log( "USE DB " + dbname);
			useDB(conn, dbname, fn);
		});
	};
};

var tblDaoHT = {}; 
/** Example : tblName : 'users', fields : [
	{name : "id", type : "" , isUnique : true},
	{name : "name", type:"string", isUnique: true},
	{name : "desc", type:"json", isJSON : true},
...
	]
 */
exports.register = function(tblName, fields){
	var fieldHT = new IX.IListManager();
	IX.iterate(fields, function(field){
		fieldHT.register(field.name, field);
	});

	tblDaoHT[tblName] = function(dbConn){
		return daoClass(dbConn, tblName, fieldHT);
	};
	return fieldHT;
};

exports.getInstance = function(tblName, dbConn){
	return (tblName in tblDaoHT) ? (new (tblDaoHT[tblName])(dbConn)) : null;
};

function _getStmt(fields, vals, connector){
	if (!IX.isArray(fields)) 
		return getPartStmt(fields, vals);

	var stmts = IX.map(fields, function(field, idx){
		return getPartStmt(field, vals[idx]);
	});

	return stmts.join(connector || ", ");
}
exports.getAssignStmt = function(fields, vals){
	return _getStmt(fields, vals);
};
exports.getWhereStmt = function(fields, vals){
	return 'WHERE ' + _getStmt(fields, vals, " AND ");
};

exports.getTransaction = function(isolevel){
	return new DBTransaction(isolevel);
};