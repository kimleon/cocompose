var assert = require("assert");

var Note = require('../models/note');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/testdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("database connected");
});

before(function () {
  Note.remove().exec();
});


// Note is the module under test.
describe('Note', function() {

  describe('#createNote()', function () {
    it('create new note with given params', function () {
      Note.find({},
        function(err, notesList) {
          assert.deepEqual(notesList.length, 0);
      });
      Note.createNote('testSheet', 'C5', 20, true, 
        function(err, note) {
          if (err) {
            assert.isTrue(false);
          }
      });
      Note.find({},
        function(err, notesList) {
          assert.deepEqual(notesList.length, 1);
      });
    });
  }); 

  describe('#updateNote()', function() {
    it('should update isNote to false', function() {
      var sheetID = 'testSheet'; 
      var pitch = 'C5'; 
      var time = 20;
      var isNote = false;
      Note.updateNote(sheetID, pitch, time, isNote,
        function(err, note) {
          assert.isFalse(note.isNote);
      });
    });
  }); 

  describe('#getAllNotes()', function () {
    it('should return all notes from the sheet where isNote is true', function () {
    	var sheetID = 'testSheet';
      Note.getAllNotes(sheetID,
        function(err, record) {
          assert.isTrue(record);
      });
    });
  }); 

}); // End describe Note.
