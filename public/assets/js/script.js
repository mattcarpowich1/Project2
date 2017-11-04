$.ajax({
  url: '/api/riffs/all',
  method: "GET"
}).done(function(riffs) {
  console.log(riffs);
});

StartAudioContext(Tone.context, "article").then(function() {

  var loop;
  var currentSequence;

  //opens modal when click on tile
  $('article').on('click', function (evt) {
    if (evt.target.id === 'favorite') return;
    $('.modal').addClass('is-active');
    
    var riffId = $(this).data('id');
    var url = '/api/riffs/' + riffId;

    $.ajax({
      url: url,
      method: "GET"
    }).done(function(riff) {
      // set tempo to riff's tempo
      Tone.Transport.bpm.value = 120;

      Tone.Transport.start();

      // var sequence = riff.sequence.split(",");

      var sequence = ["A2", "B2", "C#3", "D#3",
                  "F3", "G3", "A3", "B3",
                  "A3", "G3", "F3", "D#3",
                  "C#3", "B2", "A2", "G2"];

      currentSequence = sequence;

      $.each($('.modal-step'), function(index, value) {
        $(this).text(sequence[index]);
      });

      // sequence = sequence[0].slice(1);

      // console.log(sequence);

      // keep track of which step in the sequence we're on
      var step = 0;

      // create instrument
      var synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

      // initialize loop with parameters from riff
      loop = new Tone.Loop(function(time) {
        if (step > sequence.length) {
          step = 0;
        }

        if (sequence[step]) {
          synth.triggerAttackRelease(sequence[step], "8n", time);
        }

        step++;

      }, "16n");

      $("#cn-button").on("click", function(event) {
        loop.start();
      });

    });


  });

  //closes modal if clicking elements that have class 
  $('.close-modal').on('click', function () {
    $('.modal').removeClass('is-active');
    clearModal();
    loop.stop();
  });

  //closes modal if clicking off of modal
  $('.modal-background').on('click', function () {
    $('.modal').removeClass('is-active');
    clearModal();
    loop.stop();
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

});
