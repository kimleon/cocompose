var express = require('express');
var router = express.Router();
var Sheet = require('../models/sheet');
var utils = require('../utils/utils');

/*
  Grab a freet from the store whenever one is referenced with an ID in the
  request path (any routes defined with :freet as a paramter).
*/
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

/* GET home page. */
router.get('/', function(req, res, next) {
	Sheet.getSheets(req.currentUser.username, function(err, sheets) {
		if (err) {
		utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
		utils.sendSuccessResponse(res, { sheets: sheets.sheets });
		}
    });
});

/*
  GET /freets/:freet
  Request parameters:
    - freet: the unique ID of the freet within the logged in user's freet collection
  Response:
    - success: true if the server succeeded in getting the user's freets
    - content: on success, the freet object with ID equal to the freet referenced in the URL
    - err: on failure, an error message
*/
router.get('/:sheet', function(req, res) {
  console.log(req.sheet);
  utils.sendSuccessResponse(res, req.sheet);
});

/*
  POST /freets
  Request body:
    - content: the content of the freet
    - _id: id of the freet to be refreeted
  Response:
    - success: true if the server succeeded in recording the user's freet
    - err: on failure, an error message
*/
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