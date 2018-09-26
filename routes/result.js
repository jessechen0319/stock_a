var express = require('express');
var router = express.Router();
let jsonfile = require("jsonfile");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.router();
});

router.get('/day144', function(req, res, next) {
    let result = jsonfile.readFileSync(__dirname+"/../service/result/day144.json");
    res.json(result);
    
});

module.exports = router;