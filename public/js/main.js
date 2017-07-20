$(document).ready(()=> {

  $('.rateButton').click(function() {
    var id=$(this).data('id');
    $.ajax({
      data: { "id": id},
      type: 'POST',
      url: "./rate",
      success: function () {
        $('#'+id).html(function(i, val) { return +val+1; });
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

  $('#signUp').click(function() {
    $(this).hide();
    $('#form-container').fadeIn(300);
  });

});
