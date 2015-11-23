// Wrapped in an immediately invoked function expression.
(function() {
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
          {id: id}
      ).done(function(response) {
          loadSheetPage();
          // response.render('composer');
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });
})();