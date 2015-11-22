var mongoose = require("mongoose");

var noteSchema = mongoose.Schema({
  sheetID: String,
  pitch: String,
  time: Number,
  isNote: Boolean
}); 

/*
  creates a new note with the given params
*/
noteSchema.statics.createNote = function(sheetID, pitch, time, isNote, callback) {
  Note.create({ sheetID: sheetID, 
                    pitch: pitch,
                    time: time,
                    isNote: isNote });
  callback(null);
}

/*
  updates the note's start and end times
*/
noteSchema.statics.updateTimes = function(sheetID, pitch, time, isNote, callback) {
  Note.findOneAndUpdate({'sheetID': sheetID, 'time' : time, 'pitch': pitch}, 
    {$set: { isNote: isNote }},
    {safe: true, upsert: true},
    function(err, foundNote) {
      if (err) {
        callback({msg: err.message});
      } else{
        callback(null, foundNote);
      } 
    });
}

//NOT USED IN MVP
// /*
//   locks the note and sets lockedBy
// */
// noteSchema.statics.lockNote = function(id, username, callback) {
//   Note.findOneAndUpdate({'_id': id}, 
//     {$set: { locked: true,
//     				 lockedBy: username }},
//     {safe: true, upsert: true},
//     function(err, foundNote) {
//       if (err) {
//         callback({msg: err.message});
//       } else{
//         callback(null, foundNote);
//       } 
//     });
// }

// /*
//   unlocks the note
// */
// noteSchema.statics.unlockNote = function(id, callback) {
//   Note.findOneAndUpdate({'_id': id}, 
//     {$set: { locked: false,
//     				 lockedBy: undefined }},
//     {safe: true, upsert: true},
//     function(err, foundNote) {
//       if (err) {
//         callback({msg: err.message});
//       } else{
//         callback(null, foundNote);
//       } 
//     });
// }

/*
  returns all notes
*/
noteSchema.statics.getAllNotes = function(sheetID, callback) {
  Note.find({
    isNote: true,
    sheetID: sheetID }, 
    function(err, allNotes) {
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