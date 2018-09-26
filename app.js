var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var result = require("./routes/result");

var FetchForStock = require("./service/fetch/fetchForStock");
let growth144_55 = require('./service/fetch/fetchMethod/day144_55_向上');


let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/result', result);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var CronJob = require('cron').CronJob;

new CronJob('00 20 15 * * 1-5', function() {
  let fetchForStock = new FetchForStock();
  fetchForStock.setAnalysis([growth144_55.calculate]);
  let chainRunner = new ChainTaskRunner();
  let stockNameTask = new ChainTask(() => {
    fetchForStock.fetchStockName(() => {
      stockNameTask.end();
    });
  });

  let stockAnalysisTask = new ChainTask(() => {
    fetchForStock.fetchStockDetail(() => {
      stockAnalysisTask.end();
    });
  });

  chainRunner.addTask(stockNameTask);
  chainRunner.addTask(stockAnalysisTask);
}, null, true, 'Asia/Shanghai');


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
