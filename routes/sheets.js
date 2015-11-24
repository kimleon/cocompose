var express = require('express');
var router = express.Router();
var Sheet = require('../models/sheet');
var utils = require('../utils/utils');

/*
  Require authentication on ALL access to /sheets/*
  Clients which are not logged in will receive a 403 error code.
*/
var requireAuthentication = function(req, res, next) {
  if (!req.currentUser) {
    utils.sendErrResponse(res, 403, 'Must be logged in to use this feature.');
  } else {
    next();
  }
};

/*
  Require ownership whenever accessing a particular sheet
  This means that the client accessing the resource must be logged in
  as the user that originally created the sheet. Clients who are not owners 
  of this particular resource will receive a 404.
  Why 404? We don't want to distinguish between sheets that don't exist at all
  and sheets that exist but don't belong to the client. This way a malicious client
  that is brute-forcing urls should not gain any information.
*/
var requireOwnership = function(req, res, next) {
  if (!(req.currentUser.username === req.sheet.creator)) {
    utils.sendErrResponse(res, 404, 'Resource not found.');
  } else {
    next();
  }
};

// Register the middleware handlers above.
router.all('/:sheet', requireAuthentication);
// router.all('/:freet', requireOwnership);

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
  console.log("routes for individual res")
  // res.render('composer', function(err, html) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log("no error");
  //     console.log(html);
  //     res.send(html);
  //   }
  // });
  res.render('composer');
  // res.sendFile('../views/composer.ejs', {root: __dirname});
  console.log("Made it");
  // console.log(req.sheet);
  // console.log(req);
  // console.log(res);
  // res.render('composer');
  // utils.sendSuccessResponse(res, req.sheet);
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