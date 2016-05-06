var express = require('express');
var router = express.Router();

var userModel = require("../service/models/user.js");
var digest = require("../service/util/digest.js");

router.get('/check', function(req, res, next) {
	var userName = $XP(req, "session.user");
	if (IX.isEmpty(userName))
		return next(new Error("未登录系统"));
	userModel.getByName(userName, function(user){
		if (!user)
			return next(new Error("无效的登录信息"));
		IXS.sendResult(res, {
			id : user.id,
			name : user.name,
			type : user.type
		});
	});
});

router.post('/login', function(req, res, next) {
	var userName = $XP(req, "body.username");
	var password = $XP(req, "body.password");

	if (IX.isEmpty(userName)|| IX.isEmpty(password))
		return next(new Error("用户和密码不允许为空"));

	userModel.getByName(userName, function(user){
		if (!user || user.password !== digest.digestOnce(password))
			return next(new Error("用户不存在或者密码不正确"));

		req.session.user = userName;
		IXS.sendResult(res, {
			id : user.id,
			name : user.name,
			type : user.type
		});
	});
});
router.post('/logout', function(req, res, next) {
	req.session.destroy();
	IXS.sendResult(res, {});
});

module.exports = router;
