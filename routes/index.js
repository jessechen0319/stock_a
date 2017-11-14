var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getCalculateResultList', function(req, res, next) {

  let results = require('fs').readdirSync(__dirname + "/../service/result");

  console.log(results);
  res.append("Content-Type", 'text/html; charset=utf-8');
  res.json(results);
});

module.exports = router;
