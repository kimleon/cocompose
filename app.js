var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

var mongoose = require('mongoose');
// Connect to either the MONGOLAB_URI or to the local database.
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mymongodb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("database connected");
});

// Import routes
var routes = require('./routes/index');
var users = require('./routes/users');

// Import User model
var User = require('./models/user');
// Import Note model
var Note = require('./models/note');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware. This function
// is called on every request and populates
// the req.currentUser field with the logged-in
// user object based off the username provided
// in the session variable (accessed by the
// encrypted cookied).
app.use(function(req, res, next) {
  if (req.session.username) {
    User.findByUsername(req.session.username, 
      function(err, user) {
        if (user) {
          req.currentUser = user;
        } else {
          req.session.destroy();
        }
        next();
      });
  } else {
      next();
  }
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

io.on('connection', function (socket) {
  socket.on('note', function (data) {
    Note.updateTimes(data.user, data.note.pitch, data.note.time, data.note.isNote,
      function(err, note) {
        if (err) {
          Note.createNote(data.user, data.note.pitch, data.note.time, data.note.isNote,
            function(err, newNote) {
              if (err) {
                console.log(err.msg)
                // res.send({success: false, message: err.msg});
              } 
          });   
          console.log("created new note")       
          // res.send({success: true, note: newNote});
        } else {
          console.log("updated note")
          // res.send({success: true, note: note});
        }
    });
    console.log(data);
  });
});

module.exports = app;
