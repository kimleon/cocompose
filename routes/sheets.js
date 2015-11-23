var express = require('express');
var router = express.Router();
var Sheet = require('../models/sheet');
var utils = require('../utils/utils');

router.param('sheet', function(req, res, next, sheetId) {
  Sheet.getSheet(sheetId, function(err, sheet) {
    if (sheet) {
      req.sheet = sheet;
      next();
    } else {
      utils.sendErrResponse(res, 404, 'Resource not found.');
    }
  });
});

router.get('/', function(req, res, next) {
	Sheet.getSheets(req.currentUser.username, function(err, sheets) {
		if (err) {
		utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
		utils.sendSuccessResponse(res, { sheets: sheets.sheets });
		}
    });
});

router.get('/:sheet', function(req, res, next) {
  console.log(req.sheet);
  res.render('composer');
  utils.sendSuccessResponse(res, req.sheet);
});

router.post('/', function(req, res) {
    Sheet.createSheet(req.currentUser.username, req.body.content, function(err, sheet) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
        utils.sendSuccessResponse(res);
      }
    });
});

module.exports = router;