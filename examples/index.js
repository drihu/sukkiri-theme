'use strict';
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('./config/mongoose');

/*----------------------------------------------------------------------
# Require Global Middlewares
----------------------------------------------------------------------*/
let dashRedirect = require('./app/middlewares/dashRedirect');

/*----------------------------------------------------------------------
# Require Routes
----------------------------------------------------------------------*/
let index = require('./app/routes/index');
let auth = require('./app/routes/auth');
let appli = require('./app/routes/app');
let users = require('./app/routes/users');

let app = express();

// environment variables
app.set('env', process.env.APP_ENV || 'development');
app.set('key', process.env.APP_KEY || 'secret');

// view engine setup
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure and initialize Passport
require('./config/passport')(app);
require('./config/auth')(app);

/*----------------------------------------------------------------------
# Global Middlewares
----------------------------------------------------------------------*/
app.use(dashRedirect);

/*----------------------------------------------------------------------
# Use The Routes
----------------------------------------------------------------------*/
app.use('/', index);
app.use('/auth', auth);
app.use('/app', appli);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
