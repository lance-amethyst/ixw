module.exports = function checkSession(req, res, next){
	console.log("checkSession:", req.baseUrl);
	if (req.baseUrl == '/'  || req.session.user)
		next();
	else
		next(new Error('未登录系统'));
};