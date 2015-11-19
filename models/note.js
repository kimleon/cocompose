var mongoose = require("mongoose");

var noteSchema = mongoose.Schema({
  sheetID: [{ type: Schema.Types.ObjectId, ref: 'Sheet' }],
  pitch: String,
  start: Number,
  end: Number,
  locked: Boolean,
  lockedBy: String
}); 

/*
  creates a new note with the given params
*/
noteSchema.statics.createNote = function(sheetID, pitch, start, end) {
  Note.create({ sheetID: sheetID, 
                    pitch: pitch,
                    start: start,
                    end: end,
                    locked: false,
                    lockedBy: undefined });
  callback(null);
}

/*
  deletes the note corresponding to the given id
*/
noteSchema.statics.deleteNote = function(id, callback) {
  Note.findOneAndRemove({'_id' : id},
    function(err, record) {
      if (err) {
        callback({msg: err.message});
      } else {
        callback(null, record);
      } 
  });
}

/*
  updates the note's start and end times
*/
noteSchema.statics.updateTimes = function(id, start, end, callback) {
  Note.findOneAndUpdate({'_id': id}, 
    {$set: { start: start,
    				 end: end }},
    {safe: true, upsert: true},
    function(err, foundNote) {
      if (err) {
        callback({msg: err.message});
      } else{
        callback(null, foundNote);
      } 
    });
}

/*
  locks the note and sets lockedBy
*/
noteSchema.statics.lockNote = function(id, username, callback) {
  Note.findOneAndUpdate({'_id': id}, 
    {$set: { locked: true,
    				 lockedBy: username }},
    {safe: true, upsert: true},
    function(err, foundNote) {
      if (err) {
        callback({msg: err.message});
      } else{
        callback(null, foundNote);
      } 
    });
}

/*
  unlocks the note
*/
noteSchema.statics.unlockNote = function(id, callback) {
  Note.findOneAndUpdate({'_id': id}, 
    {$set: { locked: false,
    				 lockedBy: undefined }},
    {safe: true, upsert: true},
    function(err, foundNote) {
      if (err) {
        callback({msg: err.message});
      } else{
        callback(null, foundNote);
      } 
    });
}

/*
  returns all notes
*/
noteSchema.statics.getAllNotes = function(callback) {
  Note.find(function(err, allNotes) {
      if (err) {
        callback({msg: err.message});
      } else {
        callback(null, allNotes);
      } 
  });
}

// When we 'require' this model in another file (e.g. routes),
// we specify what we are importing form this file via module.exports.
// Here, we are 'exporting' the mongoose model object created from
// the specified schema.
var Note = mongoose.model("Note", noteSchema);
module.exports = mongoose.model("Note", noteSchema);