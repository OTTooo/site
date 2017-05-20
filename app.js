var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('underscore');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var app = express();

//database setup
var dbUrl = 'mongodb://localhost/mysite'; //数据库的名字为mysite
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl)


//view engine setup
app.set('views','./views/pages');
app.set('view engine','jade');

app.use(logger('dev'));
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'mysite',
  resave: false,
  saveUninitialized: true,
  store:new MongoStore({
    url:dbUrl
  })
}));
if ('development' === app.get('env')) {
  app.set('showStackError',true);
  app.locals.pretty = true;
  mongoose.set('debug',true);
}
app.locals.moment = require('moment');

//pre handle user 预处理user
app.use(function(req,res,next) {
  var _user = req.session.user;
  //如果有user就把它挂到app.locals上
  if (_user) {
    res.locals.user = _user;
  }
  next();
})



app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));
app.use('/admin',require('./routes/admin'));
app.use('/movie',require('./routes/movie'));




app.use(function(req,res,next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use(function(err,req,res,next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
})
module.exports = app;
