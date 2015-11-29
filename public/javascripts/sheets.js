// Wrapped in an immediately invoked function expression.
(function() {

  /**
    Javascript action for when the user clicks on the "Add" button for new sheets.
    Checks to make sure that the input is not empty, otherwise display an alert message.
    If the input is valid, it then posts the data to the server and adds a new sheet,
    marking the currentUser as the creator. When this completes, loads the page displaying the
    new sheet as an addition.
  */
  $(document).on('click', '#submit-new-sheet', function(evt) {
      var name = $('#new-sheet-input').val();
      if (name.trim().length === 0) {
          alert('Input must not be empty');
          return;
      }
      $.post(
          '/sheets',
          { name: name }
      ).done(function(response) {
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  /**
    Javascript action for when the user clicks on the delete button for a specific sheet. 
    Removes that sheet from the list of sheets displayed and if the currentUser is the 
    creator of the sheet, removes the sheet from all lists of sheets displayed for all users.
  */
  $(document).on('click', '.delete-sheet', function(evt) {
      var item = $(this).parent();
      var id = item.data('sheet-id');
      $.ajax({
          url: '/sheets/' + id,
          type: 'DELETE'
      }).done(function(response) {
          item.remove();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });
})();