var assert = require("assert");

var Note = require('../models/note');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/testdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("database connected");
});
var assert = require('chai').assert;

// Note is the module under test.
describe('Note', function() {
  before(function () {
    Note.remove().exec();
  });

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

    it('create 2 new notes with given params', function () {
      Note.find({},
        function(err, notesList) {
          if (err) {
            assert.isTrue(false);
          } else {
            console.log(notesList.length)
            // NEED TO FIX THIS
            // WHY DOES THIS WORK???
            assert.isTrue(false)
            console.log("kjsdnfkdsjnfsk")
            assert.deepEqual(notesList.length, 100);
          }
      });
      Note.createNote('testSheet', 'E5', 24, true, 
        function(err, note) {
          if (err) {
            assert.isTrue(false);
          }
      });
      Note.createNote('testSheet', 'C4', 10, true, 
        function(err, note) {
          if (err) {
            assert.isTrue(false);
          }
      });
      Note.find({},
        function(err, notesList) {
          if (err) {
            assert.isTrue(false);
          } else {
            assert.deepEqual(notesList.length, 3);
          }
      });
    });
  }); 

  describe('#updateNote()', function() {
    it('should update isNote to false for both notes', function() {
      var sheetID = 'testSheet'; 
      var pitch1 = 'C5'; 
      var time1 = 20;
      var isNote = false;
      var pitch2 = 'C4'; 
      var time2 = 10;
      Note.updateNote(sheetID, pitch1, time1, isNote,
        function(err, note) {
          // NEED TO FIX THIS, SHOULD BE FALSE
          console.log(note.isNote)
          assert.isTrue(note.isNote);
          assert.isFalse(note.isNote);
      });
      Note.updateNote(sheetID, pitch2, time2, isNote,
        function(err, note) {
          // NEED TO FIX THIS, SHOULD BE FALSE
          console.log(note.isNote)
          assert.isTrue(note.isNote);
          assert.isFalse(note.isNote);
      });
    });

    it('should update isNote to true', function() {
      var sheetID = 'testSheet'; 
      var pitch = 'C5'; 
      var time = 20;
      var isNote = true;
      Note.updateNote(sheetID, pitch, time, isNote,
        function(err, note) {
          // NEED TO FIX THIS, SHOULD BE TRUE
          console.log(note.isNote)
          assert.isTrue(note.isNote);
          assert.isFalse(note.isNote);
      });
    });
  }); 

  describe('#getAllNotes()', function () {
    it('should return all notes from the sheet where isNote is true', function () {
    	var sheetID = 'testSheet';
      Note.getAllNotes(sheetID,
        function(err, notesList) {
          if (err) {
            assert.isTrue(false);
          } else {
            console.log(notesList.length)
            // NEED TO FIX THIS
            // THIS SHOULD BE 2 NOT 3??? BUT IT'S STILL PASSING
            assert.deepEqual(notesList.length, 3);
          }
      });
    });
  }); 

}); // End describe Note.
