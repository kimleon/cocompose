var mongoose = require("mongoose");

var noteSchema = mongoose.Schema({
  sheetID: String,
  pitch: String,
  time: Number,
  isNote: Boolean
}); 

/*
  Creates a new note with the given params (sheetID, pitch, time, and isNote).
  sheetID is the unique ID of the sheet the note belongs to. The pitch and time describe 
  the characteristics of the note, and isNote is a boolean to determine if the note is a note 
  or a rest.
*/
noteSchema.statics.createNote = function(sheetID, pitch, time, isNote, callback) {
  Note.create({ sheetID: sheetID, 
                    pitch: pitch,
                    time: time,
                    isNote: isNote });
  callback(null);
}

/*
  Updates the note's start and end times
*/
noteSchema.statics.updateNote = function(sheetID, pitch, time, isNote, callback) {
  Note.findOneAndUpdate({'sheetID': sheetID, 'time' : time, 'pitch': pitch}, 
    {$set: { isNote: isNote }},
    {safe: true, upsert: true},
    function(err, foundNote) {
      if (err) {
        callback({message: err.message});
      } else{
        callback(null, foundNote);
      } 
    });
}

/*
  Given a sheetID, gets all the notes belonging to that sheet.
*/
noteSchema.statics.getAllNotes = function(sheetID, callback) {
  Note.find({
    isNote: true,
    sheetID: sheetID }, 
    function(err, allNotes) {
      if (err) {
        callback({message: err.message});
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