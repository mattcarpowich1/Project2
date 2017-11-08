let $av = $('#avatar-div');
let defCol = 'lightgrey';
let colors = ['red', 'orange', 'yellow', 'green',
              'blue', 'violet'];

$('input').keydown(function (event) {
	var color = colors[getRand(0,colors.length)];
  $av.css({
  	'border-color': color,
  	'box-shadow': '0 0 20px 10px ' + color
	});
});

$('input').keyup(function (event) {
  $av.css({
  	'box-shadow': 'none'
  });
});

$('#remember').on('click', function () {
  defCol = defCol === 'lightgrey' ? 'black' : 'lightgrey';
  $av.css('background', defCol);
});

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}