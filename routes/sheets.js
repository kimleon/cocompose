var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
var express = require('express');
var router = express.Router();
var Sheet = require('../models/sheet');
var utils = require('../utils/utils');

// setup route middlewares
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

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
      if (!(user === sheet.creator || sheet.collaborators.indexOf(user) > -1)) {
        utils.sendErrResponse(res, 404, 'Resource not found.');
      } else {
        next();
      }
    }
  });
};

/*
  Require access whenever adding collaborators to a particular sheet
  This means that the client accessing the resource must be logged in
  as the user that originally created the sheet. Clients who are not owners 
  of this particular resource will receive a 404.
*/
var requireOwnership = function(req, res, next) {
  sheetID = req.params.sheet;
  user = req.currentUser.username;
  Sheet.getSheetInfo(sheetID, function(err, sheet) {
    if (sheet) {
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
router.all('/:sheet/:name', requireOwnership);

/*
  Grab a sheet from the store whenever one is referenced with an ID in the
  request path (any routes defined with :sheet as a parameter).
*/
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

/*
  GET /sheets/:sheet
  Request parameters:
    - sheet: the unique ID of the sheet within the logged in user's sheet collection
  Response:
    - success: renders the composer.ejs file to load the individual sheet webpage view with sheet info
*/
router.get('/:sheet', csrfProtection, function(req, res, next) {
  Sheet.getSheetInfo(req.sheetID, function(err, sheet) {
    if (sheet) {
      res.render('composer', { csrfToken: req.cookies["_csrf"], 'creator': sheet.creator, 'collaborators': sheet.collaborators, 'currentUser': req.currentUser.username, 'measures': sheet.measureCount, 'bpm': sheet.bpm  });
    }
  });
});

/*
  POST /sheets
  Request body:
    - username: the username of the user currently logged in
    - name: the name of the sheet
  Response:
    - success: true if the server succeeded in recording the user's sheet
    - err: on failure, an error message
*/
router.post('/', function(req, res) {
    Sheet.createSheet(req.currentUser.username, req.body.name, function(err, sheet) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
        utils.sendSuccessResponse(res);
      }
    });
});

/*
  POST /sheets/:sheet/addCollab
  Request body:
    - collab: username to be added to the list of collaborators
    - sheetID: the unique ID of the sheet
  Response:
    - success: true if the server succeeded in recording the user's sheet
    - err: on failure, an error message
*/
router.post('/:sheet/addCollab', function(req, res) {
    Sheet.addCollaborator(req.body.collab, req.sheetID, function(err) {
      if (err) {
        utils.sendErrResponse(res, 403, err.message);
      } else {
        utils.sendSuccessResponse(res);
      }
    });
});

router.post('/:sheet/updateMeasures', function(req, res) {
    Sheet.updateMeasureCount(req.body.mCount, req.sheetID, function(err) {
      if (err) {
        utils.sendErrResponse(res, 403, err.message);
      } else {
        utils.sendSuccessResponse(res);
      }
    });
});

router.post('/:sheet/updateBPM', function(req, res) {
    Sheet.updateBPM(req.body.bpm, req.sheetID, function(err) {
      if (err) {
        utils.sendErrResponse(res, 403, err.message);
      } else {
        utils.sendSuccessResponse(res);
      }
    });
});


/*
  If the user is a collaborator on a sheet, only deletes the sheet from their access list.
  If the user is the creator of a sheet, deletes the sheet from all users' lists.

  DELETE /sheets/:sheet
  Request parameters:
    - sheetID: the unique ID of the sheet within the logged in user's sheet collection
    - username: the username of the user currently logged in
  Response:
    - success: true if the server succeeded in deleting the user's sheet
    - err: on failure, an error message
*/
router.delete('/:sheet', function(req, res) {
  Sheet.deleteSheet(req.sheetID, req.currentUser.username, function(err) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
        utils.sendSuccessResponse(res);
      }
  });
});

/*
  Deletes the collaborator from the list of collaborators for the sheet.

  DELETE /sheets/:sheet/:name
  Request parameters:
    - sheet: the unique ID of the sheet within the logged in user's sheet collection
    - name: the username of the collaborator to be deleted
  Response:
    - success: true if the server succeeded in deleting the collaborator from the sheet
    - err: on failure, an error message
*/
router.delete('/:sheet/:name', function(req, res) {
  Sheet.deleteCollaborator(req.params.name, req.params.sheet, function(err) {
      if (err) {
        utils.sendErrResponse(res, 500, 'An unknown error occurred.');
      } else {
        utils.sendSuccessResponse(res);
      }
  });
});

module.exports = router;