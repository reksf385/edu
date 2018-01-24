var context = 'a';

$('.switcher').click(function() {
  if (context == 'a') {
    context = 'b';
  } else if (context == 'b') {
    context = 'c';
  } else if (context == 'c') {
    context = 'd';
  } else {
    context = 'a';
  }
  $('.wrapper').attr('class', 'wrapper ' + context);
});
