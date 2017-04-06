$('.logo').click(function() {
  $('.content').attr('class', 'content home');
  $('.nav-item').removeClass('active');
  $('body, html').scrollTop(0);
  $('body').addClass('home');
});

$('.nav-item').click(function() {
  var classes = $(this).data('classes');
  $('.content').attr('class', classes);
  $('.nav-item').removeClass('active');
  $(this).addClass('active');

  $('.sub-nav-item').removeClass('active');
  $('.sub-nav').each(function() {
    $(this).children().first().addClass('active');
  });
  $('body, html').scrollTop(0);
  $('body').removeClass('home');
});

$('.sub-nav-item').click(function() {
  var classes = $(this).data('classes');

  $('.content').attr('class', classes);
  $('.sub-nav-item').removeClass('active');
  $(this).addClass('active');
  $('body, html').scrollTop(0);
  $('body').removeClass('home');
});
