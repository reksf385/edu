var typing = false;
var Bid = {
      lot_initialized:  false,
      ask_value:        0,
      ask_string:       '0',
      temp_ask:         '',
      sell_value:       0,
      sell_string:      '0',
      increment_focus: false,
      increment_value:  500,
      increment_string: '500',
      temp_increment:   '',
      footing:          false,
      online_max_bid:   4700
    };

reset_current_number();
set_increment();
display_online_max_bid();

$('.square-button').click(function(event) {
    var event    = $.Event('keyup'),
        key_code = $(this).data('keycode');

    event.keyCode = key_code;
    $(document).trigger(event);
});

$(document).keyup(function(event) {
  event.preventDefault();
  console.log(event.keyCode);
  if (event.keyCode == 27) {
    reset_current_number();
  } else if (event.keyCode == 13) {
    set_current_number();
  } else if (event.keyCode == 73) {
    focus_increment();
  } else if (event.keyCode == 79) {
    bid('online');
    active_state('.online');
  } else if (event.keyCode == 70) {
    bid('Floor');
    active_state('.floor');
  } else if (event.keyCode == 87) {
    message('Fair warning', 'yellow');
    active_state('.warning');
  } else if (event.keyCode == 76) {
    message('Last call', 'red');
    active_state('.last-call');
  } else if (event.keyCode == 8) {
    del_char();
  } else if (event.keyCode == 48) {
    update_number_field(0);
  } else if (event.keyCode == 49) {
    update_number_field(1);
  } else if (event.keyCode == 50) {
    update_number_field(2);
  } else if (event.keyCode == 51) {
    update_number_field(3);
  } else if (event.keyCode == 52) {
    update_number_field(4);
  } else if (event.keyCode == 53) {
    update_number_field(5);
  } else if (event.keyCode == 54) {
    update_number_field(6);
  } else if (event.keyCode == 55) {
    update_number_field(7);
  } else if (event.keyCode == 56) {
    update_number_field(8);
  } else if (event.keyCode == 57) {
    update_number_field(9);
  }
});

function del_char() {
  if (Bid.increment_focus) {
    Bid.temp_increment = Bid.temp_increment.replace(/,/g, '');
    Bid.temp_increment = Bid.temp_increment.slice(0,-1);
    Bid.temp_increment = Math.abs(Bid.temp_increment);
    Bid.temp_increment = Bid.temp_increment.toLocaleString();
    $('.current-increment .increment').html(Bid.temp_increment);
  } else {
    Bid.temp_ask = Bid.temp_ask.replace(/,/g, '');
    Bid.temp_ask = Bid.temp_ask.slice(0,-1);
    Bid.temp_ask = Math.abs(Bid.temp_ask);
    Bid.temp_ask = Bid.temp_ask.toLocaleString();
    $('.current-ask .button-value').html(Bid.temp_ask);
  }
}

function focus_increment() {
  Bid.increment_focus = true;
  $('.wide-button.current-increment').addClass('typing');
  $('.current-increment .increment').html('0');
}

function update_number_field(value) {
  if (Bid.increment_focus) {
    Bid.temp_increment = Bid.temp_increment.replace(/,/g, '');
    Bid.temp_increment += value;
    Bid.temp_increment = Math.abs(Bid.temp_increment);
    Bid.temp_increment = Bid.temp_increment.toLocaleString();
    $('.current-increment .increment').html(Bid.temp_increment);
  } else {
    $('.wide-button.current-ask').addClass('typing');
    Bid.temp_ask = Bid.temp_ask.replace(/,/g, '');
    Bid.temp_ask += value;
    Bid.temp_ask = Math.abs(Bid.temp_ask);
    Bid.temp_ask = Bid.temp_ask.toLocaleString();
    $('.current-ask .button-value').html(Bid.temp_ask);
  }
}

function reset_current_number() {
  if (Bid.increment_focus) {
    Bid.temp_increment = '';
    $('.current-increment .increment').html(Bid.increment_string);
    $('.current-increment').removeClass('typing');
    Bid.increment_focus = false;
    typing = false;
  } else if (Bid.lot_initialized) {
    Bid.temp_ask = '';
    $('.current-ask .button-value').html(Bid.ask_string);
    $('.current-ask').removeClass('typing');
    typing = false;
  } else {
    typing = true;
    Bid.lot_initialized = true;
  }
}

function set_current_number() {
  if (Bid.increment_focus) {
    if (Bid.temp_increment !== '') {
      Bid.increment_value = Math.abs(Bid.temp_increment.replace(/,/g, ''));
      Bid.increment_string = Bid.temp_increment;
      Bid.temp_increment = '';
      $('.current-increment').removeClass('typing');
      Bid.increment_focus = false;
      increment_current_ask(true);
    }
  } else {
    if (Bid.temp_ask !== '') {
      Bid.ask_value = Math.abs(Bid.temp_ask.replace(/,/g, ''));
      Bid.ask_string = Bid.temp_ask;
      Bid.temp_ask = '';

      $('.current-ask').removeClass('typing');
      $('.wrapper').removeClass('initializing');
    }
  }
  check_for_online_bidders();
  typing = false;
}

function set_increment() {
  $('.increment').html(Bid.increment_string);
}

function bid(source) {
  var submittable_bid = source == 'online' && $('.online').hasClass('disabled') ? false : true;

  if (submittable_bid) {
    increment_sell_at();
    increment_current_ask();
    add_to_history(source);
    check_for_online_bidders();
  }
}

function increment_current_ask(updating_increment) {
  if (updating_increment) {
    if (Bid.sell_value != 0) {
      Bid.ask_value  = Bid.sell_value + Bid.increment_value;
      Bid.ask_string = Bid.ask_value.toLocaleString();
    }
  } else {
    Bid.ask_value  = Bid.ask_value + Bid.increment_value;
    Bid.ask_string = Bid.ask_value.toLocaleString();
  }
  $('.current-ask .button-value').html(Bid.ask_string);
}

function increment_sell_at() {
  Bid.sell_value  = Bid.ask_value;
  Bid.sell_string = Bid.ask_string;
  $('.sell-button .button-value').html(Bid.sell_string);
}

function add_to_history(source) {
  if (source == 'Floor' && Bid.online_max_bid >= Bid.sell_value) {
    var online_bidder_id = '#' + Math.floor(Math.random() * 1000000);
    var line_item = '<div class="line-item"><span class="description">' + source + '</span><span class="value">' + Bid.sell_string + '</span></div>' +
                    '<div class="line-item rejected"><span class="description">' + online_bidder_id + '</span><span class="value">' + Bid.sell_string + '</span></div>';
  } else {
    source = source == 'online' ? '#' + Math.floor(Math.random() * 1000000) : source;
    var line_item = '<div class="line-item"><span class="description">' + source + '</span><span class="value">' + Bid.sell_string + '</span></div>';
  }

  $('.history').prepend(line_item);
  $('.line-item').removeClass('highest-bid');
  $($('.line-item')[0]).addClass('highest-bid');
}

function message(message, class_name) {
  var line_item = '<div class="line-item"><span class="description ' + class_name + '">' + message + '</span></div>'
  $('.history').prepend(line_item);
}

function active_state(class_name) {
  $(class_name).addClass('active');
  setTimeout(function() { $(class_name).removeClass('active') }, 50);
}

function check_for_online_bidders() {
  if (Bid.online_max_bid >= Bid.ask_value) {
    enable_online_bidding();
    set_footing();
  } else {
    disable_online_bidding();
  }
}

function set_footing() {
  var remainder = Math.floor((Bid.online_max_bid - Bid.ask_value) / Bid.increment_value);
  console.log(remainder);
  if (remainder % 2 === 0) {
    $('.footing').addClass('on'); // even
  } else {
    $('.footing').removeClass('on'); // odd
  }
}

function enable_online_bidding() {
  $('.square-button.online').removeClass('disabled');
}

function disable_online_bidding() {
  $('.square-button.online').addClass('disabled');
}

function display_online_max_bid() {
  $('.online-max-bid').html(Bid.online_max_bid.toLocaleString());
}

function max(value) {
  Bid.online_max_bid = value;
  check_for_online_bidders();
  display_online_max_bid();
}
