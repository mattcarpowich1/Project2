$(document).ready( function () {
  toggleSelectClasses($(window).width());
});

$(window).resize( function () { 
	toggleSelectClasses($(window).width());
});

function toggleSelectClasses (winWidth) {
  if (winWidth <= 768) {
  	$('#step-selector').prop('multiple', false);
  	$('#step-selector').removeAttr('size');
  	$('#step-selector-div').removeClass('is-multiple');
  } else {
  	$('#step-selector').prop('multiple', 'true');
  	$('#step-selector').attr('size', '9');
  	$('#step-selector-div').addClass('is-multiple');
  }
}

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

$('.favorite').on('click', function () {
  if ($(this).hasClass('fa-star')) {
  	$(this).removeClass('fa-star');
  	$(this).addClass('fa-star-o');
  } else {
  	$(this).removeClass('fa-star-o');
  	$(this).addClass('fa-star');
  }
});

$('.step-modal').on('click', function () {
	if ($(this).hasClass('unclicked')) {
		if ($('#step-selector').val().length !== 0) {
      $(this).html($('#step-selector').val());
      $.each($("#step-selector option:selected"), function () {
	      $(this).prop('selected', false);
	    });
		} else {
		  $(this).removeClass('unclicked');
		  $(this).addClass('clicked');
	  }
	} else {
		$(this).removeClass('clicked');
		$(this).addClass('unclicked');		
	}
});

$('#step-selector').on('change', function () {
	let that = this;
	if ($('#step-grid').find('.clicked').length !== 0) {
		$('.clicked').each(function () {
	    $(this).html($(that).val());
	    $(this).removeClass('clicked');
	    $(this).addClass('unclicked');
	  });
	  $.each($("#step-selector option:selected"), function () {
	    $(this).prop('selected', false);
	  });
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