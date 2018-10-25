var express = require('express');
var router = express.Router();
var FetchForStock = require("../service/fetch/fetchForStock");
let growth144_55 = require('../service/fetch/fetchMethod/day144_55_向上');
var FetchGood = require("../service/fetch/fetchBasicInformation");


let ChainTask = require('task-chain').ChainTask;
let ChainTaskRunner = require('task-chain').ChainTaskRunner;

var jsonfile = require('jsonfile');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/fetchMoney', function (req, res, next) {
  let fetch = new FetchGood();
  fetch.fetch();
  res.end("finished");
});

router.get('/fetchMoneyShort', function (req, res, next) {
  let fetch = new FetchGood();
  fetch.fetchBigRed();
  res.end("finished");
});
router.get('/fetchMoneyGrowth', function (req, res, next) {
  let fetch = new FetchGood();
  let daygrowth = require("../service/fetch/fetchMethod/day144");
  fetch.fetchGrowth(daygrowth);
  res.end("finished");
});

router.get('/fetchpianli', function (req, res, next) {
  let fetch = new FetchGood();
  let daygrowth = require("../service/fetch/fetchMethod/144向上偏离144十个点");
  fetch.fetchGrowth(daygrowth);
  res.end("finished");
});

router.get('/fetchMoneyShortResult', function (req, res, next) {
  let result = jsonfile.readFileSync(__dirname+"/../service/fetch/goodSshort.json");
  res.json(result);
  res.end();
});

router.get('/trigger', function (req, res, next) {

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

  res.send("analysis is processing");
  res.end();

});

module.exports = router;
