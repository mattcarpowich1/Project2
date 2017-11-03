// $(document).ready( function () {
//   toggleSelectClasses($(window).width());
// });

// $(window).resize( function () { 
// 	toggleSelectClasses($(window).width());
// });

// function toggleSelectClasses (winWidth) {
//   if (winWidth <= 768) {
//   	$('#step-selector').prop('multiple', false);
//   	$('#step-selector').removeAttr('size');
//   	$('#step-selector-div').removeClass('is-multiple');
//   } else {
//   	$('#step-selector').prop('multiple', 'true');
//   	$('#step-selector').attr('size', '9');
//   	$('#step-selector-div').addClass('is-multiple');
//   }
// }

$('article').on('click', function (evt) {
	if (evt.target.id === 'favorite') return;
  $('.modal').addClass('is-active');
});

$('.close-modal').on('click', function () {
  $('.modal').removeClass('is-active');
});

$('.modal-background').on('click', function () {
  $('.modal').removeClass('is-active');
});

//toggling favorite star
$('.favorite').on('click', function () {
  if ($(this).hasClass('fa-star')) {
  	$(this).removeClass('fa-star');
  	$(this).addClass('fa-star-o');
  } else {
  	$(this).removeClass('fa-star-o');
  	$(this).addClass('fa-star');
  }
});

//altering to sharps and flats
$('.mod-check').on('click', function () {
	let key = $(this).attr('id')[0];
	let mod = $(this).attr('id')[2];
	let val = `${key}-${mod}`;
	let p8 = $(`#${key}-p8-option`).val();

	if ($(`#${val}-check`).prop('checked')) {
    if (mod === 'b') $(`#${key}-s-check`).prop('checked', false);
    else $(`#${key}-b-check`).prop('checked', false);
	} else {
		val = key;
	}

	$(`#${key}-step-selector`).attr('value', `${p8}-${val}`);
});

//changing octaves
$('.p8-option').on('change', function () {
	let p8 = $(this).val();
  let key = $(this).attr('id')[0];
  let curVal = $(`#${key}-step-selector`).attr('value').slice(1);
  $(`#${key}-step-selector`).attr('value', p8+curVal);
});

//pick which notes are sent to steps
$('.step-selector').on('click', function () {
	let that = this;

	if ($(this).hasClass('picked')) {
		$(this).removeClass('picked');
	} else {
	  $.each($(".picked"), function () {
	    $(this).removeClass('picked');
	  });	
		$(this).addClass('picked');
	}

	if ($('#step-grid').find('.clicked').length !== 0) {
		$('.clicked').each(function () {
	    $(this).html($(that).attr('value'));
	    $(this).removeClass('clicked');
	    $(this).addClass('unclicked');
	    $(that).removeClass('picked');
	  });
	}
});

//steps clicked
$('.step-modal').on('click', function () {
	if ($(this).hasClass('unclicked')) {
		$(this).removeClass('unclicked');
	  $(this).addClass('clicked');

		if ($('.picked').attr('value') !== undefined) {
			$(this).html($('.picked').attr('value'));
	    $(this).addClass('unclicked');
		  $(this).removeClass('clicked');
		} else {
		  if ($(this).html() !== '') {
		  	$(this).empty();
		  }
	  }

	} else {
		$(this).removeClass('clicked');
		$(this).addClass('unclicked');		
	}
	
});


//Circular Nav
(function(){

	var button = document.getElementById('cn-button'),
    wrapper = document.getElementById('cn-wrapper');

    //open and close menu when the button is clicked
	var open = false;
	button.addEventListener('click', handler, false);

	function handler(){
	  if(!open){
	    // this.innerHTML = "Test";
	    classie.add(wrapper, 'opened-nav');
	  }
	  else{
	    // this.innerHTML = "Test";
		classie.remove(wrapper, 'opened-nav');
	  }
	  open = !open;
	}
	function closeWrapper(){
		classie.remove(wrapper, 'opened-nav');
	}

})();