var typing = false;
var Bid = {
      lot_initialized:          false,
      ask_value:                0,
      ask_string:               '0',
      temp_ask:                 '',
      sell_value:               0,
      sell_string:              '0',
      is_split:                 false,
      split_count:              0,
      override_increment:       false,
      override_increment_value: 0,
      increment_focus:          false,
      increment_value:          50,
      increment_string:         '50',
      temp_increment:           '',
      random_key:               Math.floor(Math.random() * (foot.length - 5)),
      online_high_bid:          0,
      online_max_bid:           0
    };

Bid.online_high_bid = foot[Bid.random_key];
Bid.online_max_bid  = foot[Bid.random_key + 5];

initialize_footing();
reset_number();
set_increment();
display_high_and_max();

$('.square-button, .small-button, .sell-button, .wide-button, .header-button').click(function(event) {
  event.stopPropagation();
    var event    = $.Event('keyup'),
        key_code = $(this).data('keycode');

    event.keyCode = key_code;
    $(document).trigger(event);
});

$(document).keyup(function(event) {
  event.preventDefault();
  console.log('key: ', event.keyCode);
  if (event.keyCode == 27) {
    $('.overlay-wrapper').hasClass('show') ? cancel() : reset_number();
  } else if (event.keyCode == 13) {
    $('.overlay-wrapper').hasClass('show') ? confirm_sale() : set_number();
  } else if (event.keyCode == 83 && Bid.sell_value != 0) {
    sell_lot();
  } else if (event.keyCode == 80) {
    pass_lot();
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
    update_number(0);
  } else if (event.keyCode == 49) {
    update_number(1);
  } else if (event.keyCode == 50) {
    update_number(2);
  } else if (event.keyCode == 51) {
    update_number(3);
  } else if (event.keyCode == 52) {
    update_number(4);
  } else if (event.keyCode == 53) {
    update_number(5);
  } else if (event.keyCode == 54) {
    update_number(6);
  } else if (event.keyCode == 55) {
    update_number(7);
  } else if (event.keyCode == 56) {
    update_number(8);
  } else if (event.keyCode == 57) {
    update_number(9);
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

function update_number(value) {
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

function reset_number() {
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

function set_number() {
  if (Bid.increment_focus) {
    if (Bid.temp_increment !== '') {
      Bid.increment_value = Math.abs(Bid.temp_increment.replace(/,/g, ''));
      Bid.increment_string = Bid.temp_increment;
      Bid.temp_increment = '';
      $('.current-increment').removeClass('typing');
      Bid.increment_focus = false;
      Bid.override_increment = true;
      Bid.override_increment_value = Bid.increment_value;
      set_current_ask(true);
    }
  } else {
    if (Bid.temp_ask !== '') {
      set_bid_split_status();

      Bid.ask_value = Math.abs(Bid.temp_ask.replace(/,/g, ''));
      Bid.ask_string = Bid.temp_ask;
      Bid.temp_ask = '';

      set_increment();

      $('.current-ask').removeClass('typing');
      $('.console').removeClass('initializing');
    }
  }
  check_for_online_bidders();
  slide_to_foot();
  typing = false;
}

function find_increment_value() {
  if (Bid.is_split) {
    return split_increment();
  } else {
    return increment_policy_value();
  }
}

function increment_policy_value() {
  if (Bid.override_increment) {
    return Bid.override_increment_value;
  } else if (Bid.ask_value < 1000) {
    return 50;
  } else if (Bid.ask_value < 2000) {
    return 100;
  } else if (Bid.ask_value < 3000) {
    return 200;
  } else if (Bid.ask_value <= 3000) {
    return 200;
  } else if (Bid.ask_value <= 3200) {
    return 300;
  } else if (Bid.ask_value <= 3500) {
    return 300;
  } else if (Bid.ask_value <= 3800) {
    return 200;
  } else if (Bid.ask_value <= 4000) {
    return 200;
  } else if (Bid.ask_value <= 4200) {
    return 300;
  } else if (Bid.ask_value <= 4500) {
    return 300;
  } else if (Bid.ask_value <= 4800) {
    return 200;
  } else if (Bid.ask_value < 10000) {
    return 500;
  } else if (Bid.ask_value < 20000) {
    return 1000;
  } else if (Bid.ask_value < 30000) {
    return 2000;
  } else {
    return 5000;
  }
}

function set_increment() {
  Bid.increment_value = find_increment_value();
  Bid.increment_string = Bid.increment_value.toLocaleString();

  $('.increment').html(Bid.increment_string);
}

function bid(source) {
  var submittable_bid = source == 'online' && $('.online').hasClass('disabled') ? false : true,
      fixed_number    = $('.typing')[0] == undefined ? true : false,
      set_with_floor  = source == 'Floor' ? true : false;

  if (fixed_number && submittable_bid || set_with_floor) {
    set_number();
    set_sell_at();
    set_increment();
    set_current_ask(false);
    add_to_history(source);
    check_for_online_bidders();
    slide_to_foot();
  }
}

function set_current_ask(updating_increment) {
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

function set_sell_at() {
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

  $('.alert-window.confirm-sale .sale-amount').html(Bid.sell_string);
  $('.alert-window.confirm-sale .winning-bidder').html(source);
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
  } else {
    disable_online_bidding();
  }
}

function enable_online_bidding() {
  $('.square-button.online').removeClass('disabled');
}

function disable_online_bidding() {
  $('.square-button.online').addClass('disabled');
}

function max(value) {
  Bid.online_max_bid = value;
  check_for_online_bidders();
  display_high_and_max();
  initialize_footing();
}

function high(value) {
  Bid.online_high_bid = value;
  check_for_online_bidders();
  display_high_and_max();
  initialize_footing();
}

function set_bid_split_status() {
  if (Bid.ask_string != 0 && num_to_val(Bid.temp_ask) < Bid.ask_value && Bid.sell_value > 0) {
    Bid.is_split = true;
  }
}

function num_to_val(num) {
  return Math.abs(num.replace(/,/g, ''));
}

function split_increment() {
  if (Bid.split_count == 0) {
    Bid.increment_value = Bid.ask_value - Bid.sell_value;
    Bid.increment_string = Bid.increment_value.toLocaleString();
    Bid.split_count += 1;
  } else if (Bid.split_count == 1) {
    Bid.increment_value = increment_policy_value() - Bid.increment_value;
    Bid.increment_string = Bid.increment_value.toLocaleString();
    Bid.split_count += 1;
  } else {
    Bid.increment_value = increment_policy_value();
    Bid.is_split = false;
    Bid.split_count = 0;
  }
  return Bid.increment_value;
}

function sell_lot() {
  $('.overlay-wrapper').addClass('show');
  $('.alert-window.confirm-sale').addClass('show');
}

function pass_lot() {
  $('.overlay-wrapper').addClass('show');
  $('.alert-window.pass-lot').addClass('show');
}

function cancel() {
  $('.overlay-wrapper').removeClass('show');
  $('.alert-window.confirm-sale').removeClass('show');
  $('.alert-window.pass-lot').removeClass('show');
}

function confirm_sale() {
  var url = window.location;
  window.location.href = url;
}

function initialize_footing() {
  var output = '';

  for (i = 0; i < foot.length; i++) {
    var side        = i % 2 == 0 ? 'left' : 'right',
        value       = 'val' + foot[i],
        max_marker  = Bid.online_max_bid == foot[i] ? 'max' : '',
        high_marker = Bid.online_high_bid == foot[i] ? 'high' : '',
        css_classes = side + ' ' + value + ' ' + max_marker + ' ' + high_marker;

    output += '<div class="foot ' + css_classes + '">' + foot[i].toLocaleString() + '</div>';
  }

  $('.footing-wrapper').html(output);
  set_footing_highlights();
}

function display_high_and_max() {
  $('.high-max-wrapper .high .high-value').html(Bid.online_high_bid.toLocaleString());
  $('.high-max-wrapper .max .max-value').html(Bid.online_max_bid.toLocaleString());
}

function set_footing_highlights() {
  var max_bid           = '.val' + Bid.online_max_bid,
      foot_to_highlight = $(max_bid).hasClass('left') ? '.foot.left' : '.foot.right';
  $(foot_to_highlight).addClass('on');
}

function slide_to_foot() {
  var foot_to_slide_to = '.val' + Bid.ask_value,
      current_offset   = $('.footing-wrapper').scrollTop(),
      y_distance       = $(foot_to_slide_to).position().top + current_offset;

  $('.footing-wrapper').animate({ 'scrollTop': y_distance});
}
