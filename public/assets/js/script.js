//opens modal when click on tile
$('article').on('click', function (evt) {
  if (evt.target.id === 'favorite') return;
  $('.modal').addClass('is-active');
});

//closes modal if clicking elements that have class 
$('.close-modal').on('click', function () {
  $('.modal').removeClass('is-active');
  clearModal();
});

//closes modal if clicking off of modal
$('.modal-background').on('click', function () {
  $('.modal').removeClass('is-active');
  clearModal();
});

//clear step when modal closes
function clearModal() {
  $('.modal-step').each(function () {
    $(this).empty();
    $(this).addClass('unclicked');
    $(this).removeClass('clicked');
  });
  $('.step-selector').each(function () {
    $(this).removeClass('picked');
  });
}

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
$('.modal-step').on('click', function () {
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
