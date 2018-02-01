var typing = false;
var Bid = {
      override_start_price:     false,
      ask_value:                1000,
      ask_string:               '1,000',
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
      online_max_bid:           0,
      increment_strategy:       '.default',
      current_winner:           ''
    };

Bid.online_high_bid = 1200; //foot[Bid.random_key];
Bid.online_max_bid  = 1500; //foot[Bid.random_key + 5];

initialize_footing();
set_increment();
display_high_and_max();

$('.square-button, .small-button, .small-wide-button, .wide-button, .dropdown-item, .toggle').click(function(event) {
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
    if ($('body').hasClass('initializing') && $('.alert-window.change-lot').hasClass('show')) {
      change_lot();
    } else if ($('body').hasClass('initializing')) {
      set_number();
    } else if ($('.overlay-wrapper').hasClass('show')) {
      confirm_sale();
    } else {
      set_number();
    }
  } else if (event.keyCode == 83 && Bid.sell_value != 0) {
    sell_lot();
  } else if (event.keyCode == 80) {
    pass_lot();
  } else if (event.keyCode == 77) {
    focus_increment();
  } else if (event.keyCode == 68) {
    toggle_increment_strategy('.toggle.default', 'default');
  } else if (event.keyCode == 84) {
    toggle_increment_strategy('.toggle.two-five-eight', '.two-five-eight');
  } else if (event.keyCode == 65) {
    bid('online');
    active_state('.online');
  } else if (event.keyCode == 70) {
    bid('Floor');
    active_state('.floor');
  } else if (event.keyCode == 87) {
    message('Fair warning', 'yellow');
    active_state('.warning');
  } else if (event.keyCode == 69) {
    message('Last call', 'red');
    active_state('.last-call');
  } else if (event.keyCode == 67) {
    if ($("body").hasClass("initializing")) {
      toggle_change_lot();
    }
  } else if (event.keyCode == 8) {
    del_char();
  } else if (event.keyCode == 191) {
    update_number('/');
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
    Bid.temp_ask = Bid.temp_ask == '' ? '' : Math.abs(Bid.temp_ask);
    Bid.temp_ask = Bid.temp_ask.toLocaleString();
    $('.current-ask .button-value').html(Bid.temp_ask);
    if (Bid.temp_ask == '') {
      $(".current-ask .placeholder-button-value").removeClass('hide');
    }
  }
}

function focus_increment() {
  Bid.increment_focus = true;
  $('.small-wide-button.current-increment').addClass('typing');
  $('.current-increment .increment').html('0');
  toggle_increment_strategy('.toggle.manual', '.manual');
}

function update_number(value) {
  if (Bid.increment_focus) {
    Bid.temp_increment = Bid.temp_increment.replace(/,/g, '');
    Bid.temp_increment += value;
    Bid.temp_increment = Math.abs(Bid.temp_increment);
    Bid.temp_increment = Bid.temp_increment.toLocaleString();
    $('.current-increment .increment').html(Bid.temp_increment);
  } else {
    $(".wide-button.current-ask").addClass("typing");
    $(".current-ask .button-value").html('');
    if (value == '/') {
      $('.current-ask .placeholder-button-value').removeClass('hide');
    } else {
      $(".placeholder-button-value").addClass("hide");
      Bid.override_start_price = true;
      Bid.temp_ask = Bid.temp_ask.replace(/,/g, "");
      Bid.temp_ask += value;
      Bid.temp_ask = Math.abs(Bid.temp_ask);
      Bid.temp_ask = Bid.temp_ask.toLocaleString();
      $(".current-ask .button-value").html(Bid.temp_ask);
    }
  }
}

function reset_number() {
  if (Bid.increment_focus) {
    Bid.temp_increment = '';
    $('.current-increment .increment').html(Bid.increment_string);
    $('.current-increment').removeClass('typing');
    toggle_increment_strategy(Bid.prev_toggle, 'default');
    Bid.increment_focus = false;
    typing = false;
  } else {
    Bid.temp_ask = '';
    $('.current-ask .button-value').html(Bid.ask_string);
    $('.current-ask').removeClass('typing');
    typing = false;
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
      Bid.increment_strategy = '.manual';
      Bid.override_increment_value = Bid.increment_value;
      set_current_ask('update increment');
      initialize_footing();
    }
  } else {
    if (Bid.temp_ask !== "") {
      set_bid_split_status();
      Bid.ask_value = Math.abs(Bid.temp_ask.replace(/,/g, ""));
      Bid.ask_string = Bid.temp_ask;
      Bid.temp_ask = "";
      set_increment();
      $(".current-ask").removeClass("typing");
    } else {
      reset_number();
    }
    if ($("body").hasClass("initializing")) {
      open_bidding();
    }
  }
  check_for_online_bidders();
  slide_to_foot(false);
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
  if (Bid.increment_strategy == '.manual') {
    return Bid.override_increment_value;
  } else if (Bid.increment_strategy == '.two-five-eight') {
    var value = Bid.sell_string.slice(-3).slice(0,1);
    if (value == 0) {
      return 200;
    } else if (value == 2) {
      return 300;
    } else if (value == 5) {
      return 300;
    } else if (value == 8) {
      return 200;
    }
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
  var submittable_online_bid = source == "online" && $(".online").hasClass("disabled") ? false : true,
      set_with_floor         = source == "Floor" ? true : false;

  Bid.current_winner = source;

  if (submittable_online_bid || set_with_floor) {
    set_number();
    set_sell_at();
    set_increment();
    set_current_ask(false);
    add_to_history(source);
    check_for_online_bidders();
    slide_to_foot(true);
    $('.current-ask').removeClass('typing');
  }
}

function set_current_ask(status) {
  if (status == 'update increment') {
    if (Bid.sell_value != 0) {
      Bid.ask_value  = Bid.sell_value + Bid.increment_value;
      Bid.ask_string = Bid.ask_value.toLocaleString();
    }
  } else if (status == 'reset') {
    Bid.ask_value  = Bid.sell_value + increment_policy_value(); // increment_policy_value();
    Bid.ask_string = Bid.ask_value.toLocaleString();
  } else {
    Bid.ask_value  = Bid.ask_value + Bid.increment_value;
    Bid.ask_string = Bid.ask_value.toLocaleString();
  }
  $('.current-ask .button-value').html(Bid.ask_string);
  $(".current-ask .placeholder-button-value").html(Bid.ask_string);
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
  console.log(Bid.current_winner);
  if (Bid.current_winner == 'online' || Bid.online_max_bid < Bid.ask_value) {
    disable_online_bidding();
  } else {
    enable_online_bidding();
  }
  set_footing_highlights();
}

function enable_online_bidding() {
  if ($('.square-button.online').hasClass('disabled')) {
    $('.square-button.online').addClass('animating');

    setTimeout(function() {
      $('.square-button.online').removeClass('disabled');
      $('.square-button.online').removeClass('animating');
    }, 375);
  }
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
  if ($('body').hasClass('initializing')) {
    var url = window.location;
    window.location.href = url;
  } else {
    $('.overlay-wrapper').addClass('show');
    $('.alert-window.pass-lot').addClass('show');
  }
}

function cancel() {
  if ($('body').hasClass('initializing')) {
    $(".alert-window.starting-ask").addClass("show");
    $(".alert-window.pass-lot").removeClass("show");
    $(".alert-window.change-lot").removeClass("show");
  } else {
    $(".overlay-wrapper").removeClass("show");
    $(".alert-window.confirm-sale").removeClass("show");
    $(".alert-window.pass-lot").removeClass("show");
  }
}

function confirm_sale() {
  var url = window.location;
  window.location.href = url;
}

function initialize_footing() {
  var output = '';

  if (Bid.increment_strategy == '.manual') {
    var foot_value = Bid.ask_value;
    for (i = 0; i < foot.length; i++) {
      var side        = i % 2 == 0 ? 'left' : 'right',
          value       = 'val' + foot_value,
          max_marker  = Bid.online_max_bid == foot_value ? 'max hide' : '',
          high_marker = Bid.online_high_bid == foot_value ? 'high' : '',
          css_classes = side + ' ' + value + ' ' + max_marker + ' ' + high_marker;

      output += '<div class="foot ' + css_classes + '">' + foot_value.toLocaleString() + '</div>';
      foot_value += Bid.increment_value;
    }
  } else if (Bid.increment_strategy == '.two-five-eight') {
    for (i = 0; i < foot_258.length; i++) {
      var side        = i % 2 == 0 ? 'left' : 'right',
          value       = 'val' + foot_258[i],
          max_marker  = Bid.online_max_bid == foot_258[i] ? 'max hide' : '',
          high_marker = Bid.online_high_bid == foot_258[i] ? 'high' : '',
          css_classes = side + ' ' + value + ' ' + max_marker + ' ' + high_marker;

      output += '<div class="foot ' + css_classes + '">' + foot_258[i].toLocaleString() + '</div>';
    }
  } else {
    for (i = 0; i < foot.length; i++) {
      var side        = i % 2 == 0 ? 'left' : 'right',
          value       = 'val' + foot[i],
          max_marker  = Bid.online_max_bid == foot[i] ? 'max hide' : '',
          high_marker = Bid.online_high_bid == foot[i] ? 'high' : '',
          css_classes = side + ' ' + value + ' ' + max_marker + ' ' + high_marker;

      output += '<div class="foot ' + css_classes + '">' + foot[i].toLocaleString() + '</div>';
    }
  }

  $('.footing').html(output);
  $('.footing').scrollTop();
  set_footing_highlights();
}

function display_high_and_max() {
  $('.high-max-wrapper .high .high-value').html(Bid.online_high_bid.toLocaleString());
  $('.high-max-wrapper .max .max-value').html(Bid.online_max_bid.toLocaleString());
}

function set_footing_highlights() {
  if (Bid.online_max_bid >= Bid.ask_value) {
    var max_bid           = '.val' + Bid.online_max_bid,
        foot_to_highlight = $(max_bid).hasClass('left') ? '.foot.left' : '.foot.right',
        class_to_add      = $(max_bid).hasClass('left') ? 'left' : 'right';
    $(foot_to_highlight).addClass('on');
    $('.footing-wrapper').addClass(class_to_add);
  } else {
    $('.footing-wrapper').removeClass('left').removeClass('right');
    $('.foot').addClass('on');
    $('.high-max-wrapper').addClass('hide');
  }
  reveal_max_bid();
}

function reveal_max_bid() {
  var current_ask_index = $('.val' + Bid.ask_value).index(),
      max_bid_index     = $('.val' + Bid.online_max_bid).index(),
      distance_apart    = max_bid_index - current_ask_index;

  if (distance_apart < 3) {
    $('.foot.max').removeClass('hide');
  } else {
    $('.foot.max').addClass('hide');
  }
}

function slide_to_foot(should_animate) {
  var foot_to_slide_to = '.val' + Bid.ask_value,
      current_offset   = $('.footing').scrollTop(),
      y_distance;

  if ($(foot_to_slide_to)[0]) {
    y_distance = $(foot_to_slide_to).position().top + current_offset - 69;
    if (should_animate) {
      $('.footing').stop().animate({ 'scrollTop': y_distance});
    } else {
      $('.footing').stop().scrollTop(y_distance);
    }
    for (i = 0; i < $(foot_to_slide_to).index(); i++) {
      $($('.foot')[i]).removeClass('on');
    }
  }
}

function toggle_increment_strategy(toggle_to_activate, increment_strategy) {
  Bid.prev_toggle = $('.toggle.active').data('name');
  Bid.current_toggle = toggle_to_activate;
  Bid.increment_strategy = Bid.current_toggle.replace(/\.toggle/g, '');

  $('.small-button.toggle').removeClass('active');
  $(toggle_to_activate).addClass('active');

  if (increment_strategy != 'manual' && !$('.current-increment').hasClass('typing')) {
    set_current_ask('reset');
    set_increment();
    initialize_footing();
    set_footing_highlights();
    reveal_max_bid();
    slide_to_foot(false);
  } else if (increment_strategy != '.manual') {
    Bid.increment_focus = false;
    $('.current-increment .increment').html(Bid.increment_value);
    $('.current-increment').removeClass('typing');
  }
}

function open_bidding() {
  $(".overlay-wrapper").removeClass("show");
  $(".hold-sale").addClass("hide");
  $("body").removeClass("initializing");
  $(".alert-window.starting-ask").removeClass('show');
}

function toggle_change_lot() {
  $(".alert-window.starting-ask").removeClass("show");
  $(".alert-window.change-lot").addClass("show");
  $('input').focus();
}

$('.lot-button').click(function() {
  $('.lot-button').removeClass('selected');
  $(this).addClass('selected');
  $(".change-lot .ok.disabled").removeClass("disabled");
});

function change_lot() {
  if (!$('.alert-window .ok').hasClass('disabled')) {
    var url = window.location;
    window.location.href = url;
  }
}

$(".pause-sale-button").click(function() {
  $(this).toggleClass('paused');
  $('.alert-window.pause-sale').toggleClass('show');
  $('.alert-window.starting-ask').toggleClass('show');
});