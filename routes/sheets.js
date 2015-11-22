var express = require('express');
var router = express.Router();
var Tweet = require('../models/sheet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('composer');
});

module.exports = router;