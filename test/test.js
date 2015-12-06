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



// Note is the module under test.
// describe('Note', function() {
//   before(function () {
//     Note.remove().exec();
//   });

//   describe('#createNote()', function () {
//     it('create new note with given params', function (done) {
//       Note.find({},
//         function(err, notesList) {
//           assert.deepEqual(notesList.length, 0);
//       }).then(function(err) {
//         Note.createNote('testSheet', 'C5', 20, true, 
//           function(err, note) {
//             if (err) {
//               assert.isTrue(false);
//             }
//         });
//       }).then(function(err) {
//         Note.find({},
//           function(err, notesList) {
//             assert.deepEqual(notesList.length, 1);
//             assert.isTrue(false);
//             done();
//         });
//       })
//     });

//     it('create 2 new notes with given params', function (done) {
//       Note.find({},
//         function(err, notesList) {
//           if (err) {
//             console.log("error");
//             assert.isTrue(false);
//           } else {
//             console.log("no error");
//             console.log(notesList.length)
//             // NEED TO FIX THIS
//             // WHY DOES THIS WORK???
//             assert.isTrue(false)
//             console.log("kjsdnfkdsjnfsk")
//             assert.deepEqual(notesList.length, 100);
//           }
//           done();
//       });
//       // Note.createNote('testSheet', 'E5', 24, true, 
//       //   function(err, note) {
//       //     if (err) {
//       //       assert.isTrue(false);
//       //     }
//       // });
//       // Note.createNote('testSheet', 'C4', 10, true, 
//       //   function(err, note) {
//       //     if (err) {
//       //       assert.isTrue(false);
//       //     }
//       // });
//       // Note.find({},
//       //   function(err, notesList) {
//       //     if (err) {
//       //       assert.isTrue(false);
//       //     } else {
//       //       assert.deepEqual(notesList.length, 3);
//       //     }
//       // });
//     });
//   }); 

//   describe('#updateNote()', function() {
//     it('should update isNote to false for both notes', function() {
//       var sheetID = 'testSheet'; 
//       var pitch1 = 'C5'; 
//       var time1 = 20;
//       var isNote = false;
//       var pitch2 = 'C4'; 
//       var time2 = 10;
//       Note.updateNote(sheetID, pitch1, time1, isNote,
//         function(err, note) {
//           // NEED TO FIX THIS, SHOULD BE FALSE
//           console.log(note.isNote)
//           assert.isTrue(note.isNote);
//           assert.isFalse(note.isNote);
//       });
//       Note.updateNote(sheetID, pitch2, time2, isNote,
//         function(err, note) {
//           // NEED TO FIX THIS, SHOULD BE FALSE
//           console.log(note.isNote)
//           assert.isTrue(note.isNote);
//           assert.isFalse(note.isNote);
//       });
//     });

//     it('should update isNote to true', function() {
//       var sheetID = 'testSheet'; 
//       var pitch = 'C5'; 
//       var time = 20;
//       var isNote = true;
//       Note.updateNote(sheetID, pitch, time, isNote,
//         function(err, note) {
//           // NEED TO FIX THIS, SHOULD BE TRUE
//           console.log(note.isNote)
//           assert.isTrue(note.isNote);
//           assert.isFalse(note.isNote);
//       });
//     });
//   }); 

//   describe('#getAllNotes()', function () {
//     it('should return all notes from the sheet where isNote is true', function () {
//     	var sheetID = 'testSheet';
//       Note.getAllNotes(sheetID,
//         function(err, notesList) {
//           if (err) {
//             assert.isTrue(false);
//           } else {
//             console.log(notesList.length)
//             // NEED TO FIX THIS
//             // THIS SHOULD BE 2 NOT 3??? BUT IT'S STILL PASSING
//             assert.deepEqual(notesList.length, 3);
//           }
//       });
//     });
//   }); 

// }); // End describe Note.

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

  describe('#deleteFreet()', function() {
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
      Sheet.create({name:"sheet3",creator:"user3",collaborators:["use"],_id:"507f191e810c19729de860ea"});
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
});
