$('.nav-item').click(function() {
  var button_name = $(this).data('button');

  if (button_name == 'beyonce') {
    $('.slay').removeClass('hide');
  } else {
    $('.content').attr('class', 'column content');
    $('.content').addClass(button_name);

    $('.nav-item').removeClass('active');
    $(this).addClass('active');
  }
});

$('.close').click(function() {
  $('.slay').addClass('hide');
});