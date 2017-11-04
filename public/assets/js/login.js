let $av = $('#avatar-div');
let defCol = 'lightgrey';
let colors = ['red', 'orange', 'yellow', 'green',
              'blue', 'violet'];

$('input').keydown(function (event) {
  $av.css('background', colors[getRand(0,colors.length)]);
});

$('input').keyup(function (event) {
  $av.css('background', defCol);
});

$('#remember').on('click', function () {
  defCol = defCol === 'lightgrey' ? 'black' : 'lightgrey';
  $av.css('background', defCol);
});

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}