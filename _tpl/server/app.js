var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var pkgName = IXS.getProjectName();

var app = express();

var cookieSecret = pkgName + "-project";
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookieSecret));
app.use(session({
	secret : cookieSecret,
	//genid : function(req){return genuuid();},
	name : pkgName,
	cookie : {maxAge : 3600000}, // 1 hour
	resave: false,
	saveUninitialized: true,
}));

var sessionChecker = require('./middleware/sessionChecker');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/session', require('./routes/session'));
app.use('/api', sessionChecker, require('./routes/api'));
app.use('/upload', sessionChecker, require('./routes/upload'));

// development checking for prototype
if (IXS.isInDevelopment()){
	app.use('/demo', express.static(path.join(__dirname, '../www')));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Request Not Found');
	err.status = 404;
	console.log("ERR:", err);
	next(err);
});

// development error handler
// will print stacktrace
if (IXS.isInDevelopment()) {
	app.use(function(err, req, res, next) {
		IXS.sendError(res, err, true);
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	IXS.sendError(res, err, false);
});

module.exports = app;
