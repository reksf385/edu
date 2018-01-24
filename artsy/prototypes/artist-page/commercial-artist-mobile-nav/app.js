var context = 'a';

$('.switcher').click(function() {
  context == 'a' ? context = 'b' : context = 'a';
  $('.wrapper').attr('class', 'wrapper landing ' + context);
});

$('.about-link').click(function() {
  $('.wrapper').attr('class', 'wrapper about ' + context);
});

$('.back').click(function() {
  $('.wrapper').attr('class', 'wrapper landing ' + context);
});
