// Wrapped in an immediately invoked function expression.
(function() {
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

  $(document).on('click', '.go-to-sheet', function(evt) {
      console.log("test");
      var item = $(this).parent();
      var id = item.data('sheet-id');
      $.get(
          '/sheets/' + id
      ).done(function(response) {
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

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