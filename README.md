CoCompose
=======================================

Overview
--------

http://52.34.56.119:3000/

To write music: left-click to add notes, right-click to delete notes

Implementation
--------------
3 models: note, sheet, user

Security:
    - requires account and login to access any page
    - requires authentication to view specific sheet music pages
    - requires ownership to share/delete pages
    - protected against:
        - XSS
        - CSRF


* Lead Authors:  
  - app.js: Kim  
  - midiConv.js: Lisandro  
  - test  
    + test.js: Stuart  
  - templates  
    + index.handlebars: Stuart  
    + register.handlebars: Stuart  
    + sheet.handlebars: Stuart  
    + sheets.handlebars: Jessica  
    + signin.handlebars: Stuart  
  - views  
    + composer.ejs: Lisandro  
    + error.ejs: Lisandro  
    + index.ejs: Lisandro  
  - routes  
    + index.js: Stuart  
    + sheets.js: Stuart  
    + users.js: Jessica  
  - models  
    + note.js: Kim  
    + sheet.js: Jessica  
    + user.js: Stuart  
  - public  
    + javascripts  
      * model.js: Lisandro  
      * view.js: Lisandro  
      * controller.js: Lisandro  
      * piano.js: Kim  
      * index.js: Stuart  
      * sheets.js: Stuart  
      * users.js: Stuart  
      * inc: Imported from midi.js module  
      * midijs: Imported from midi.js module  
      * soundfont: Imported from midi.js module  
    + stylesheets:  
      * ark.js: Adapted from around25: https://around25.com/  
