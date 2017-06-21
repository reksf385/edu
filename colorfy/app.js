run_colorfy();

function run_colorfy() {
  $('.sale-card').each(function(index) {
    colorify({
      container: 'colorfy-sale-card-' + index,
      accuracy: 20,
      padding: -1,
      give: {
        property: 'background',
        target: 'parent'
      }
    });
  });
}


