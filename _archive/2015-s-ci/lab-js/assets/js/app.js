// function
// alert('hello js');

//variables
var animal = "cat";
var age = 12.5;
var clothing = ["shirts", "socks", "pants"];
var winner = false;
var checking_account = 1000;

console.log(winner);

// functions
function print_text(text) {
  $('.value').html(text);
}


function charge_cc(item_value, brand_name) {
  alert('You will be charged ' + item_value + ' for this ' + brand_name + ' item');
  alert('Your checking account balance is ' + checking_account);

  if (checking_account < item_value) {
    if (checking_account < 1) {
      alert('You dont have any money');
    } else {
      alert('You dont have enough money to purchase this item');
    }
  } else {
    checking_account = checking_account - item_value;
    alert('Charge successful');
    display_checking_balance();
    alert('Checking balance is ' + checking_account);
  }
}

function display_checking_balance() {
  $('.value').html(checking_account);
}

$('.item').click(function() {
  var item_value = $(this).data('value');
  var brand_name = $(this).data('brand');
  charge_cc(item_value, brand_name);
});

display_checking_balance();



