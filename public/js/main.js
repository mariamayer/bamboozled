$(document).ready(()=> {
  $('#buttonID').click(function() {
    $.ajax({
      data: { "id": $('#buttonID').data('id')},
      type: 'POST',
      url: "./rate",
      success: function () {
        $('#'+$('#buttonID').data('id')).html(function(i, val) { return +val+1; });
      },
      error: function (errorThrown) {
        console.log('error', errorThrown);
      }
    });
  });
  $('#subscribe').click(function() {
    $.ajax({
      data: { "id": $('#subscribe').data('id')},
      type: 'POST',
      url: "./subscribe",
      success: function () {
        //$('#'+$('#subscribe').data('id')).html(function(i, val) { return +val+1; });
      },
      error: function (errorThrown) {
        console.log('error', errorThrown);
      }
    });
  });
});
