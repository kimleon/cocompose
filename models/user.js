var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  username: String,
  password: String
}); 

/**
  Creates a new user with the given params (username and password). If the username
  already exists, sets taken to true.
*/
userSchema.statics.createNewUser = function(username, password, callback) {
  this.userExists(username, function(err,user) {
    if (err) {
      User.create({username: username, password: password});
      callback(null);
    }
    else {
      callback({ taken: true });
    }
  });
}

/**
  Checks to see if the given username matches to a user in the database. If not, 
  returns 'No such user!'. Otherwise, returns the user in the database.
*/
userSchema.statics.userExists = function(username, callback) {
  User.findOne({'username': username},function(err,user) {
    if (err || !user) {
      callback({message: 'No such user!'});
    }
    else {
      callback(null, user);
    }
  });
}

/**
  Accepts a username and possible password. If the username in the database has the same
  password, then returns true, otherwise false.
*/
userSchema.statics.verifyPassword = function(username,candidatepw,callback) {
  this.userExists(username,function(err,user) {
    if (err) {
      callback({msg: 'No such user!'});
    }
    else {
      if (candidatepw === user.password) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });
}

/**
  Accepts a username and if it exists in the database, returns the dictionary
  of username and password. If it does not exist in the database,
  return error message of "No such user!".
*/
userSchema.statics.findByUsername = function(username,callback) {
  this.userExists(username,function(err,user) {
    if (err) {
      callback({ msg : 'No such user!' });
    }
    else {
      callback(null, user);
    }
  })
}

// When we 'require' this model in another file (e.g. routes),
// we specify what we are importing form this file via module.exports.
// Here, we are 'exporting' the mongoose model object created from
// the specified schema.
var User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);