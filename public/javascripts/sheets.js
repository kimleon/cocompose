// Wrapped in an immediately invoked function expression.
(function() {
  /**
    Javascript action for when the user clicks on the "Add" button for new freets.
    Checks to make sure that the input is not empty, otherwise display an alert message.
    If the input is valid, it then posts the data to the server and adds a new freet
    attached to the current user. When this completes, loads the page displaying the
    new freet as an addition.
  */
  $(document).on('click', '#submit-new-sheet', function(evt) {
      var content = $('#new-sheet-input').val();
      if (content.trim().length === 0) {
          alert('Input must not be empty');
          return;
      }
      $.post(
          '/sheets',
          { content: content }
      ).done(function(response) {
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  $(document).on('click', '.go-to-sheet', function(evt) {
      var item = $(this).parent();
      var id = item.data('sheet-id');
      $.get(
          '/sheets/' + id,
          {content: content}
      ).done(function(response) {
          loadSheetPage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });
})();