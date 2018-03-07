$('.flag').delay(1500).queue(function() {
  $(this).removeClass('hide');
});

$('.flag').click(function() {
  $(this).addClass('hide');
})