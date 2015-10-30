var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/user');
var volume = require('./routes/volume');
var util = require('./lib/hubutils');
var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/volume', volume);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

util.initCommands();
//console.log(util.getActivityId('Watch Tivo'));
//var vd = util.getCommand('Watch Tivo', 'Volume', 'VolumeDown');
//console.log(JSON.stringify(vd));
//var encodedAction = JSON.stringify(vd).replace(/\:/g, '::');
//util.sendCommand('Watch Tivo', 'Volume', 'VolumeDown', "pressAction");

//console.log(JSON.stringify(vd.action, null, 4));
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
