var express = require('express');
var router = express.Router();
var fetchService = require("../service/fetch/fetchForStock");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/trigger', function(req, res, next) {

  fetchService.analysis();
  res.send("analysis is processing");
  res.end();

});

module.exports = router;
