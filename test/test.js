var assert = require("assert");
var Note = require('../models/note');
var User = require('../models/user');
var Sheet = require('../models/sheet');
var mongoose = require("mongoose");
var assert = require('chai').assert;

before(function() {
  mongoose.connect('mongodb://localhost/testdb');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function (callback) {
    console.log("database connected");
  });
  }
)

// Testing the User model
describe('User', function() {
  before(function (done) {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
      }
      return done();
  });

  describe('#userExists()', function() {
    it('should show no such user error when user does not exist', function(done) {
      User.userExists("user", function(err) {
        assert.equal('No such user!',err.message);
        done();
      })
    })

    it('should return user dictionary when user does exist', function(done) {
      var user = new User({username:'user', password: '1234'});
      user.save();
      User.userExists("user", function(err,the_user) {
        assert.equal("user",the_user.username);
        assert.equal("1234",the_user.password);
        done();
      })
    })
  })

  describe('#verifyPassword()', function() {
    it('should return true if password matches username', function(done) {
      User.verifyPassword("user","1234",function(err,bool) {
        assert.equal(true,bool);
        done();
      })
    })

    it('should return false if password does not match username', function(done) {
      User.verifyPassword("user","1",function(err,bool) {
        assert.equal(false,bool);
        done();
      })
    })
  })

  describe('#findByUsername()', function() {
    it('should return no such user error when user does not exist', function(done) {
      User.findByUsername("use", function(err) {
        assert.equal('No such user!',err.msg);
        done();
      })
    })

    it('should return user dictionary when user does exist', function(done) {
      User.findByUsername("user", function(err,the_user) {
        assert.equal("user",the_user.username);
        assert.equal("1234",the_user.password);
        done();
      })
    }) 
  })

  describe('#createNewUser()', function() {
    it('should set taken equal to true if username already exists', function(done) {
      User.createNewUser("user", "1234", function(err) {
        assert.equal(true,err.taken);
        done();
      })
    })

    it('should add new user to database if user does not exist', function(done) {
      User.createNewUser("use", "1234", function(err) {
        User.userExists("use",function(err,the_user) {
          assert.equal("use",the_user.username);
          assert.equal("1234",the_user.password);
          done();
        })
      })
    })
  })
}); // End describe User

// Testing the Sheet model
describe('Sheet', function() {
  before(function (done) {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
      }
      return done();
  });

  describe('#getSheets()', function() {
    it('should return all sheets associated with a username as a dictionary of two arrays', function(done) {
      Sheet.getSheets("user",function(err,dict) {
        assert.deepEqual([],dict.own_sheets);
        assert.deepEqual([],dict.collab_sheets);
      })
      Sheet.create({name:"sheet1",creator:"user",collaborators:[]});
      Sheet.create({name:"sheet2",creator:"use",collaborators:["user"]});
      Sheet.getSheets("user",function(err,dict) {
        assert.equal(["sheet1"],dict.own_sheets[0].name);
        assert.equal(["sheet2"],dict.collab_sheets[0].name);
        done();
      })
    })
  })

  describe('#getSheet()', function() {
    it('should return all notes associated with the sheet with the given ID', function(done) {
      Sheet.create({name:"sheet3",creator:"user",collaborators:[],_id:"507f191e810c19729de860ea"});
      Sheet.getSheet("507f191e810c19729de860ea",function(err,sheet) {
        assert.deepEqual([],sheet);
      })
      Note.create({sheetID:"507f191e810c19729de860ea",pitch:"C#4",time:20,isNote:true});
      Sheet.getSheet("507f191e810c19729de860ea",function(err,sheet) {
        assert.equal("C#4",sheet[0].pitch);
        assert.equal(20,sheet[0].time);
        assert.equal(true,sheet[0].isNote);
      })
      Note.create({sheetID:"507f191e810c19729de860ea",pitch:"D#4",time:200,isNote:true});
      Sheet.getSheet("507f191e810c19729de860ea",function(err,sheet) {
        assert.equal("D#4",sheet[1].pitch);
        assert.equal(200,sheet[1].time);
        assert.equal(true,sheet[1].isNote);
        done();
      })
    })
  })

  describe('#getSheetInfo()', function() {
    it('should return the name, creator, and list of collaborators of the sheet with the given ID', function(done) {
      Sheet.getSheetInfo("507f191e810c19729de860ea", function(err,sheet) {
        assert.equal("sheet3",sheet.name);
        assert.equal("user",sheet.creator);
        assert.equal(0,sheet.collaborators.length);
        done();
      })
    })
  })

  describe('#createSheet()', function() {
    it('should create a sheet with given creator and name', function(done) {
      Sheet.createSheet("user2","sheet4",function(){});
      Sheet.getSheets("user2",function(err,dict) {
        assert.equal("sheet4",dict.own_sheets[0].name);
        done();
      })
    })
  })

  describe('#deleteSheet()', function() {
    it('should remove a sheet from the database if the given username is the creator', function(done) {
      Sheet.deleteSheet("507f191e810c19729de860ea","user",function() {
        Sheet.getSheets("user",function(err,dict) {
          assert.equal(["sheet1"],dict.own_sheets[0].name);
          assert.equal(["sheet2"],dict.collab_sheets[0].name);
          done();
        })
      })
    })

    it('should remove a user from the list of collaborators for a sheet if the given username is in the list of collaborators', function(done) {
      var sheet = new Sheet({name:"sheet3",creator:"user3",collaborators:["use"],_id:"507f191e810c19729de860ea"});
      sheet.save();
      Sheet.deleteSheet("507f191e810c19729de860ea","use",function() {
        Sheet.getSheetInfo("507f191e810c19729de860ea",function(err,sheet) {
          assert.equal("sheet3",sheet.name);
          assert.equal("user3",sheet.creator);
          assert.equal(0,sheet.collaborators.length);
          done();
        })
      })
    })
  })

  describe('#addCollaborator()', function() {
    it('should add a username to the list of collaborators for the sheet if the username does not already have access', function(done) {
      var user = new User({username:'use', password: '1234'});
      user.save();
      Sheet.addCollaborator("use","507f191e810c19729de860ea",function() {
        Sheet.getSheetInfo("507f191e810c19729de860ea",function(err,sheet) {
          assert.equal("sheet3",sheet.name);
          assert.equal("user3",sheet.creator);
          assert.equal("use",sheet.collaborators[0]);
          done();
        })
      });
    })

    it('should give error message that user already has access if trying to add a username that already has access', function(done) {
      Sheet.addCollaborator("use","507f191e810c19729de860ea",function(err) {
        assert.equal("use already has access to this sheet!",err.message);
        done();
      });
    })
  })

  describe('#deleteCollaborator()', function() {
    it('should give error message that creator of sheet cannot be deleted if trying to delete creator\'s username', function(done) {
      var user = new User({username:'user3', password: '1234'});
      user.save();
      Sheet.deleteCollaborator("user3","507f191e810c19729de860ea",function(err) {
        assert.equal('You cannot delete the creator of the sheet!',err.message);
        done();
      });
    })

    it('should give error message that a username cannot be deleted from list of collaborators if it is not a collaborator', function(done) {
      var user = new User({username:'user4', password: '1234'});
      user.save();
      Sheet.deleteCollaborator("user4","507f191e810c19729de860ea",function(err) {
        assert.equal('user4 is not a collaborator!',err.message);
        done();
      });
    })

    it('should delete given username from list of collaborators if it is a valid username to be deleted', function(done) {
      Sheet.deleteCollaborator("use","507f191e810c19729de860ea",function(err) {
        Sheet.getSheetInfo("507f191e810c19729de860ea",function(err,sheet) {
          assert.equal("sheet3",sheet.name);
          assert.equal("user3",sheet.creator);
          assert.equal(0,sheet.collaborators.length);
          done();
        })
      });
    })
  })
}); // End describe Sheet

// Testing the Note model
describe('Note', function() {
  before(function (done) {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
      }
      return done();
  });

  describe('#getAllNotes()', function() {
    it('should return all notes from the sheet where isNote is true', function(done) {
      Note.getAllNotes("507f191e810c19729de860ea", function(err,notes) {
        assert.equal(0,notes.length);
      })
      Note.create({sheetID:"507f191e810c19729de860ea",pitch:"C#4",time:20,isNote:true});
      Note.getAllNotes("507f191e810c19729de860ea", function(err,notes) {
        assert.equal(1,notes.length);
        assert.equal("C#4",notes[0].pitch);
        assert.equal(20,notes[0].time);
      })
      Note.create({sheetID:"507f191e810c19729de860ea",pitch:"D#4",time:200,isNote:true});
      Note.getAllNotes("507f191e810c19729de860ea", function(err,notes) {
        assert.equal(2,notes.length);
        assert.equal("C#4",notes[0].pitch);
        assert.equal(20,notes[0].time);
        assert.equal("D#4",notes[1].pitch);
        assert.equal(200,notes[1].time);
      })
      Note.create({sheetID:"507f191e810c19729de860ea",pitch:"E#4",time:2000,isNote:false});
      Note.getAllNotes("507f191e810c19729de860ea", function(err,notes) {
        assert.equal(2,notes.length);
        assert.equal("C#4",notes[0].pitch);
        assert.equal(20,notes[0].time);
        assert.equal("D#4",notes[1].pitch);
        assert.equal(200,notes[1].time);
        done();
      })
    })
  })

  describe('#createNote()', function () {
    it('create new note with given sheetID, pitch, time, and isNote boolean', function(done) {
      Note.createNote("507f191e810c19729de860ea","F#4",2000,true,function(err,note) {});
      Note.getAllNotes("507f191e810c19729de860ea", function(err,notes) {
        assert.equal(3,notes.length);
        assert.equal("F#4",notes[2].pitch);
        assert.equal(2000,notes[2].time);
      })
      Note.createNote("507f191e810c19729de860ea","G#4",20000,false,function(err,note) {});
      Note.find({sheetID:"507f191e810c19729de860ea",pitch:"G#4",time:20000}, function(err,notes) {
        assert.equal(false,notes[0].isNote);
        done();
      })
    });
  }); 

  describe('#updateNote()', function() {
    it('should update a note\'s isNote to false given a note\'s information and parameter isNote=false', function(done) {
      Note.updateNote("507f191e810c19729de860ea","F#4",2000,false,function(err, note) {
        Note.find({sheetID:"507f191e810c19729de860ea",pitch:"F#4",time:2000}, function(err,notes) {
          assert.equal(false,notes[0].isNote);
          done();
        })
      });
    });

    it('should update a note\'s isNote to true given a note\'s information and parameter isNote=true', function(done) {
      Note.updateNote("507f191e810c19729de860ea","F#4",2000,true,function(err, note) {
        Note.find({sheetID:"507f191e810c19729de860ea",pitch:"F#4",time:2000}, function(err,notes) {
          assert.equal(true,notes[0].isNote);
          done();
        })
      });
    });
  }); 

}); // End describe Note.