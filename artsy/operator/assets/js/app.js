var current_ask = 30000,
    increment   = 5000,
    typing      = false;

$(document).keyup(function(event) {
  event.preventDefault();
  console.log(event.keyCode);
  if (event.keyCode == 27) {
    // esc
    $('.current-ask .button-value').html(current_ask);
    $('.wide-button.current-ask').removeClass('typing');
    typing = false;
  } else if (event.keyCode == 13) {
    // enter
    current_ask = Math.abs($('.current-ask .button-value').html());
    $('.wide-button.current-ask').removeClass('typing');
    typing = false;
  } else if (event.keyCode == 79) {
    bid('online', current_ask);
  } else if (event.keyCode == 70) {
    bid('Floor', current_ask);
  } else if (event.keyCode == 48) {
    update_current_ask(0);
  } else if (event.keyCode == 49) {
    update_current_ask(1);
  } else if (event.keyCode == 50) {
    update_current_ask(2);
  } else if (event.keyCode == 51) {
    update_current_ask(3);
  } else if (event.keyCode == 52) {
    update_current_ask(4);
  } else if (event.keyCode == 53) {
    update_current_ask(5);
  } else if (event.keyCode == 54) {
    update_current_ask(6);
  } else if (event.keyCode == 55) {
    update_current_ask(7);
  } else if (event.keyCode == 56) {
    update_current_ask(8);
  } else if (event.keyCode == 57) {
    update_current_ask(9);
  }
});

function update_current_ask(value) {
  var $current_ask = $('.current-ask .button-value');
  typing == true ? $current_ask.append(value) : $current_ask.html(value);
  typing = true;
  $('.wide-button.current-ask').addClass('typing');
}

function bid(source, value) {
  increment_current_ask(value);
  increment_sell_at(value);
  add_to_history(source, value);
}

function increment_current_ask(value) {
  current_ask = value + increment;
  $('.current-ask .button-value').html(current_ask);
}

function increment_sell_at(value) {
  $('.sell-at .button-value').html(value);
}

function add_to_history(source, value) {
  if (source == 'online') {
    source = '#' + Math.floor(Math.random() * 1000000);
  }
  var line_item = '<div class="line-item"><span class="description">' + source + '</span><span class="value">' + value + '</span></div>'
  $('.history').prepend(line_item);
}
