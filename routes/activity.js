var express = require('express');
var router = express.Router();
var util = require('../lib/hubutils');

/* GET users listing. */
//router.get('/', function(req, res) {
//  res.send('respond with a resource');
//});

var harmony = require('harmonyhubjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  util.volumeMute();
  res.send('Ok');
});

router.get('/start', function(req, res, next) {
  util.startActivity("Watch Tivo");
  res.send('Ok');
});

router.get('/stop', function(req, res, next) {
  util.stopActivity();
  res.send('Ok');
});

module.exports = router;
