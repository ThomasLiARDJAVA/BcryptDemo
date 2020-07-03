var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysqlssh = require('mysql-ssh');
const fs = require('fs');
let con;
mysqlssh.connect(
    {
      host: 'ec2-54-176-174-110.us-west-1.compute.amazonaws.com',
      user: 'ubuntu',
      privateKey: fs.readFileSync('/Users/mingkaili/Documents/aws_keys/testKeyPair.pem')
    },
    {
      host:'localhost',
      user: 'root',
      password: '123456',
      database: 'demo'
    }
).then(client => {
      con = client;
    }
);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  req.con = con;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
