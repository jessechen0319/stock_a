var express = require('express');
var router = express.Router();
var FetchForStock = require("../service/fetch/fetchForStock");
let growth144_55 = require('../service/fetch/fetchMethod/day144_55_向上');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
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
