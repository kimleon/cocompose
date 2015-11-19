var mongoose = require("mongoose");

var sheetSchema = mongoose.Schema({
  creator: String,
  collaborators: [String]
}); 

/*
  creates a new sheet with the given params
*/
sheetSchema.statics.createSheet = function(creator, callback) {
  Sheet.create({ creator: reator, 
                    collaborators: [] });
  callback(null);
}

/*
  deletes the sheet corresponding to the given id
  NOT USED IN MVP
*/
noteSchema.statics.deleteSheet = function(id, callback) {
  Sheet.findOneAndRemove({'_id' : id},
    function(err, record) {
      if (err) {
        callback({msg: err.message});
      } else {
        callback(null, record);
      } 
  });
}


// When we 'require' this model in another file (e.g. routes),
// we specify what we are importing form this file via module.exports.
// Here, we are 'exporting' the mongoose model object created from
// the specified schema.
var Sheet = mongoose.model("Sheet", sheetSchema);
module.exports = mongoose.model("Sheet", sheetSchema);