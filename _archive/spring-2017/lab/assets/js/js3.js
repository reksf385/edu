var banana = '<div class="fruit banana"></div>';
var grapes = '<div class="fruit grapes"></div>';
var apple = '<div class="fruit apple"></div>';
var everything = '<div class="fruit banana"></div><div class="fruit grapes"></div><div class="fruit apple"></div>';

$('.button').click(function() {
  var fruit = $(this).data('fruit');

  if (fruit == 'banana') {
    $('.wrapper').append(banana);
  } else if (fruit == 'grapes') {
    $('.wrapper').append(grapes);
  } else if (fruit == 'apple') {
    $('.wrapper').append(apple);
  } else {
    $('.wrapper').append(everything);
  }
});

$(window).keypress(function(event) {
  console.log(event.which);
  if (event.which == 98) {
    $('.wrapper').append(banana);
  } else if (event.which == 103) {
    $('.wrapper').append(grapes);
  } else if (event.which == 97) {
    $('.wrapper').append(apple);
  } else if (event.which == 101) {
    $('.wrapper').append(everything);
  }
});


// append => adds to end of target html element
// preppend => adds to beginning of target html element
// html => replaces target html contents