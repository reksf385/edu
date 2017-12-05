var typing = false;
var Bid = {
      ask_value:        1000,
      ask_string:       '1,000',
      temp_ask:         '',
      sell_value:       1000,
      sell_string:      '1,000',
      increment_focus: false,
      increment_value:  500,
      increment_string: '500',
      temp_increment:   '',
      online:           4,
      footing:          false
    };

reset_current_ask();
set_increment();

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
    reset_current_ask();
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

function reset_current_ask() {
  Bid.temp_ask = '';
  $('.current-ask .button-value').html(Bid.ask_string);
  $('.wide-button.current-ask').removeClass('typing');
  typing = false;
}

function set_current_number() {
  if (Bid.increment_focus) {
    if (Bid.temp_increment !== '') {
      Bid.increment_value = Math.abs(Bid.temp_increment.replace(/,/g, ''));
      Bid.increment_string = Bid.temp_increment;
      Bid.temp_increment = '';

      $('.current-increment').removeClass('typing');
      Bid.increment_focus = false;
    }
  } else {
    if (Bid.temp_ask !== '') {
      Bid.ask_value = Math.abs(Bid.temp_ask.replace(/,/g, ''));
      Bid.ask_string = Bid.temp_ask;
      Bid.temp_ask = '';

      $('.current-ask').removeClass('typing');
    }
  }
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
    decrement_max_bids();
    check_for_online_bidders();
  }
}

function increment_current_ask() {
  Bid.ask_value  = Bid.ask_value + Bid.increment_value;
  Bid.ask_string = Bid.ask_value.toLocaleString();
  $('.current-ask .button-value').html(Bid.ask_string);
}

function increment_sell_at() {
  Bid.sell_value  = Bid.ask_value;
  Bid.sell_string = Bid.ask_string;
  $('.sell-button .button-value').html(Bid.sell_string);
}

function add_to_history(source) {
  if (source == 'Floor' && Bid.online >= 1) {
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

function decrement_max_bids() {
  var class_name;

  Bid.online -=1;
  if (Bid.online >= 3) {
    class_name = 'q3';
  } else if (Bid.online == 2) {
    class_name = 'q2';
  }

  $('.large').attr('class', 'online-bidder square-button large ');
  $('.large').addClass(class_name);
}

function check_for_online_bidders() {
  if (Bid.online >= 1) {
    $('.large .square-key').html(Bid.ask_string);
    set_footing();
  } else {
    disable_online_bidding();
  }
}

function set_footing() {
  $('.footing').toggleClass('on');
}

function disable_online_bidding() {
  $('.large .square-key').html('&ndash;');
  $('.square-button.online, .square-button.large.online-bidder').addClass('disabled');
}
