var container = 'some value';
var cash = 5000;

function update_wallet(value) {
  $('.wallet').html(value);
}

function charge_card(amount, item) {
  if (cash >= amount) {
    cash = cash - amount;
    update_wallet(cash);
    $('.purchases').append(item + ', ');
  } else {
    alert('not enough money.');
  }
}

$('.item').click(function() {
  var amount = $(this).data('amount');
  var item   = $(this).data('item');

  charge_card(amount, item);
});


update_wallet(cash);