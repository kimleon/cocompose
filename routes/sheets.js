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
  Require access whenever accessing a particular sheet
  This means that the client accessing the resource must be logged in
  as the user that originally created the sheet or be on the list of
  collaborators for that sheet. Clients who are not owners 
  of this particular resource will receive a 404.
  Why 404? We don't want to distinguish between sheets that don't exist at all
  and sheets that exist but don't belong to the client. This way a malicious client
  that is brute-forcing urls should not gain any information.
*/
var requireAccess = function(req, res, next) {
  sheetID = req.params.sheet;
  user = req.currentUser.username;
  Sheet.getSheetInfo(sheetID, function(err, sheet) {
    if (sheet) {
      console.log(sheet.collaborators.indexOf(req.currentUser.username));
      if (!(user === sheet.creator || sheet.collaborators.indexOf(user) > -1)) {
        utils.sendErrResponse(res, 404, 'Resource not found.');
      } else {
        next();
      }
    }
  });
};

var requireOwnership = function(req, res, next) {
  sheetID = req.params.sheet;
  user = req.currentUser.username;
  Sheet.getSheetInfo(sheetID, function(err, sheet) {
    if (sheet) {
      console.log(sheet.collaborators.indexOf(req.currentUser.username));
      if (!(user === sheet.creator)) {
        utils.sendErrResponse(res, 404, 'Resource not found.');
      } else {
        next();
      }
    }
  });
}

// Register the middleware handlers above.
router.all('*', requireAuthentication);
router.all('/:sheet', requireAccess);
router.all('/:sheet/addCollab', requireOwnership);

router.param('sheet', function(req, res, next, sheetId) {
  req.sheetID = sheetId;
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
    console.log("routes");
    console.log(sheets);
		if (err) {
		utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
		utils.sendSuccessResponse(res, { own_sheets: sheets.own_sheets, collab_sheets: sheets.collab_sheets });
		}
    });
});

router.get('/:sheet', function(req, res, next) {
  res.render('composer');
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

router.post('/:sheet/addCollab', function(req, res) {
    Sheet.addCollaborator(req.body.collab, req.sheetID, function() {
      console.log("here");
    });
});

/*
  If the user is a collaborator on a sheet, only deletes the sheet from their access list.
  If the user is the creator of a sheet, deletes the sheet from all users' lists.

  DELETE /sheets/:sheet
  Request parameters:
    - sheet ID: the unique ID of the sheet within the logged in user's sheet collection
  Response:
    - success: true if the server succeeded in deleting the user's sheet
    - err: on failure, an error message
*/
router.delete('/:sheet', function(req, res) {
  Sheet.deleteSheet(
    req.sheetID, req.currentUser.username, 
    function(err) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
        utils.sendSuccessResponse(res);
      }
  });
});

module.exports = router;