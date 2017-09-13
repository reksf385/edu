var artworks_page = true;

$('.header-button').click(function() {
  if (artworks_page == true) {
    $('.content').attr('class', 'content about');
    $(this).addClass('about');
    $('.sidebar-button').removeClass('active');
    $('.sidebar-button.about').addClass('active');
    $('.sidebar').removeClass('hide');
  } else {
    $('.content').attr('class', 'content artist');
    $(this).removeClass('about');
    $('.sidebar').addClass('hide');
  }
  artworks_page = artworks_page == true ? false : true;

});

$('.sidebar-button').click(function() {
  $('.sidebar-button').removeClass('active');
  $('html, body').scrollTop(0);
  $(this).addClass('active');
  if ($(this).hasClass('about')) {
    $('.content').attr('class', 'content about');
  } else if ($(this).hasClass('auction-results')) {
    $('.content').attr('class', 'content auction-results');
  } else if ($(this).hasClass('shows')) {
    $('.content').attr('class', 'content shows');
  } else if ($(this).hasClass('articles')) {
    $('.content').attr('class', 'content articles');
  } else if ($(this).hasClass('related-artists')) {
    $('.content').attr('class', 'content related-artists');
  } else if ($(this).hasClass('artworks')) {
    $('.content').attr('class', 'content artist');
    $('.sidebar').addClass('hide');
    $('.header-button').removeClass('about');
    artworks_page = artworks_page == true ? false : true;
  }
});

$('.sidebar').waypoint('sticky', {
  offset: 100
});
