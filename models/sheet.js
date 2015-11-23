var mongoose = require("mongoose");

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
  deletes the sheet corresponding to the given id
  NOT USED IN MVP
*/
sheetSchema.statics.deleteSheet = function(id, callback) {
  Sheet.findOneAndRemove({'_id' : id},
    function(err, record) {
      if (err) {
        callback({msg: err.message});
      } else {
        callback(null, record);
      } 
  });
}

/**
  Given an ID, returns the unique freet attached to that ID from the database.
*/
sheetSchema.statics.getSheet = function(sheetId,callback) {
  Sheet.findById(sheetId,function(err,sheet) {
    if (err) {
      callback({msg: err.message});
    }
    else {
      callback(null, sheet);
    }
  })
}

/**
  Given a username and list of that user's following list, returns a dictionary of 
  the user's freets and refreets, as well as those he/she is following, and all others.
*/
sheetSchema.statics.getSheets = function(username,callback) {
  sheets=[];
  Sheet.find({},function(err,sheets) {
      console.log(sheets);
      if (err) {
        callback({msg: err.message});
      }
      else {
        callback(null, {sheets: sheets})
      }
  })
}

// When we 'require' this model in another file (e.g. routes),
// we specify what we are importing form this file via module.exports.
// Here, we are 'exporting' the mongoose model object created from
// the specified schema.
var Sheet = mongoose.model("Sheet", sheetSchema);
module.exports = mongoose.model("Sheet", sheetSchema);