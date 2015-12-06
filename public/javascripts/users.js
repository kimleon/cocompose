// Wrap in an immediately invoked function expression.
(function() {

  /**
    When the submit button is pressed on the sign-in page, posts the data to the
    server and upon successful completion, sets the currentUser to the logged in 
    user and loads the next page.
  */
  $(document).on('submit', '#signin-form', function(evt) {
      evt.preventDefault();
      $.post(
          '/users/login',
          helpers.getFormData(this)
      ).done(function(response) {
          currentUser = response.content.user;
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  /**
    When the submit button is pressed on the registration page, posts the data to 
    the server. Checks to make sure the password and confirmation password fields
    match, and upon successful completion, loads the next page.
  */
  $(document).on('submit', '#register-form', function(evt) {
      evt.preventDefault();
      var formData = helpers.getFormData(this);
      if (formData.password !== formData.confirm) {
          $('.error').text('Password and confirmation do not match!');
          return;
      }
      delete formData['confirm'];
      $.post(
          '/users',
          formData
      ).done(function(response) {
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  /**
    When the logout button is pressed, posts the data to the server and upon successful 
    completion, sets the currentUser to undefined and loads the next page.
  */
  $(document).on('click', '#logout-link', function(evt) {
      evt.preventDefault();
      $.post(
          '/users/logout'
      ).done(function(response) {
          currentUser = undefined;
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });
  
})();
