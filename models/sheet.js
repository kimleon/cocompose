var mongoose = require("mongoose");
var Note = require("./note");
var User = require("./user");

var sheetSchema = mongoose.Schema({
  name: String,
  creator: String,
  collaborators: [String]
}); 

/*
  creates a new sheet with the given params
*/
sheetSchema.statics.createSheet = function(creator, name, callback) {
  Sheet.create({ creator: creator, 
                  name: name,
                  collaborators: [] });
  callback(null);
}

/*
  Given a sheetID and username, if the username is the creator of the sheet 
  associated with the sheetID, removes the sheet from the database. If the username 
  is a collaborator on the sheet associated with the sheetID, removes the username 
  from the list of collaborators for the sheet.
*/
sheetSchema.statics.deleteSheet = function(sheetID, username, callback) {
  Sheet.findById(sheetID, function(err, sheet) {
    if (err) {
      callback({msg: err.message});
    }
    else {
      if (username===sheet.creator) {
        Sheet.findOneAndRemove({'_id' : sheetID},
          function(err, record) {
            if (err) {
              callback({msg: err.message});
            } else {
              callback(null);
            } 
        });
      }
      else {
        new_collaborators=[];
        sheet.collaborators.forEach(function(collaborator) {
          if (collaborator!=username) {
            new_collaborators.push(collaborator);
          }
        })
        sheet.collaborators=new_collaborators;
        sheet.save();
        callback(null);
      }
    }
  });
}

/**
  Given an ID, returns the notes attached to that sheet and sheetID from the database
*/
sheetSchema.statics.getSheet = function(sheetId, callback) {
  Note.getAllNotes(sheetId, function(err, notes) {
    if (err) {
      callback({msg: err.message});
    }
    else {
      callback(null, notes);
    }
  })
}

/**
  Given a sheetID, returns the sheet's key information, such as its
  name, creator, and list of collaborators
*/
sheetSchema.statics.getSheetInfo = function(sheetID, callback) {
  Sheet.findById(sheetID, function(err, sheet) {
    if (err) {
      callback({msg: err.message});
    }
    else {
      callback(null, sheet);
    }
  });
}

/**
  Given a username, returns all sheets that user has access to (i.e. sheets that
  user has created and sheets that user is a collaborator on)
*/
sheetSchema.statics.getSheets = function(username, callback) {
  own_sheets=[];
  collab_sheets=[];
  Sheet.find({},function(err,sheets) {
      if (err) {
        callback({msg: err.message});
      }
      else {
        sheets.forEach(function(sheet) {
          if (sheet.creator===username) {
            own_sheets.push(sheet);
          }
          else if (contains(sheet.collaborators,username)) {
            collab_sheets.push(sheet);
          }
        })
        callback(null, {own_sheets: own_sheets, collab_sheets: collab_sheets})
      }
  });
}

/**
  Given a username, adds the username to the list of collaborators for the sheet 
  associated with the given sheetID under the following conditions:

  - username must exist
  - username must not already have access to the sheet
*/
sheetSchema.statics.addCollaborator = function(username, sheetID, callback) {
  User.userExists(username,function(err,user) {
    if (err) {
      callback({message: err.message});
    }
    else {
      Sheet.findById(sheetID, function(err, sheet) {
        if (err) {
          callback({message: err.message});
        }
        else if (username===sheet.creator || contains(sheet.collaborators,username)) {
          callback({message: username+' already has access to this sheet!'});
        }
        else {
          Sheet.findByIdAndUpdate(sheetID, {$push: {collaborators: username}}, function(err, sheet) {
            if (err) {
              callback({message: err.message});
            }
            else {
              callback(null);
            }
          });
        }
      })
    }
  })
}

/**
  Given a username, deletes the username from the list of collaborators for the sheet 
  associated with the given sheetID under the following conditions:

  - username must exist
  - username must have access to the sheet
  - username must not be creator of the sheet
*/
sheetSchema.statics.deleteCollaborator = function(username, sheetID, callback) {
  console.log(username);
  console.log(sheetID);
  User.userExists(username,function(err,user) {
    if (err) {
      callback({message: err.message});
    }
    else {
      Sheet.findById(sheetID, function(err, sheet) {
        if (err) {
          callback({message: err.message});
        }
        else if (username===sheet.creator) {
          callback({message: 'You cannot delete the creator of the sheet!'});
        }
        else if (!contains(sheet.collaborators,username)) {
          callback({message: username + ' is not a collaborator!'});
        }
        else {
          Sheet.findById(sheetID, function(err, sheet) {
            if (err) {
              callback({message: err.message});
            }
            else {
              new_collaborators=[];
              sheet.collaborators.forEach(function(collaborator) {
                if (collaborator!=username) {
                  new_collaborators.push(collaborator);
                }
              })
              sheet.collaborators=new_collaborators;
              sheet.save();
              callback(null);
            }
          });
        }
      })
    }
  })
}

/**
  Helper function to check if the "obj" is in the array "a".
*/
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

// When we 'require' this model in another file (e.g. routes),
// we specify what we are importing form this file via module.exports.
// Here, we are 'exporting' the mongoose model object created from
// the specified schema.
var Sheet = mongoose.model("Sheet", sheetSchema);
module.exports = mongoose.model("Sheet", sheetSchema);