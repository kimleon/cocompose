var mongoose = require("mongoose");

var noteSchema = mongoose.Schema({
  start: Number,
  duration: Number,
  pitch: String
});

var sheetSchema = mongoose.Schema({
  notes: [noteSchema],
  creator: String,
  collaborators: String
});