var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var User = require('../models/user');
var Tweet = require('../models/sheet');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
