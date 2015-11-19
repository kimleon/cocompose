var mongoose = require("mongoose");

var sheetSchema = mongoose.Schema({
  notes: [String],
  creator: String,
  collaborators: [String]
});