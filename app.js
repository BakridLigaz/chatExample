var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var socket_io    = require( "socket.io" );
var routes = require('./routes/index');
var app = express();
app.io = require('socket.io')();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'bower_components')));
app.use(require('express-session')({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//passport config
var User = require('./models').User;
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({
    where: {
      'username': username
    }
  }).then(function (user) {
    if (user == null) {
      return done(null, false, { message: 'Incorrect credentials.' })
    }
    if (password==user.dataValues.password) {
      return done(null, user)
    }
    return done(null, false, { message: 'Incorrect credentials.' })
  })
}));
passport.serializeUser(function(user, done){
  done(null, user);
});
passport.deserializeUser(function(obj, done){
  done(null, obj);
});
var users = require('./routes/users')(app.io);
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
