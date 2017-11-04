var allRiffs;
var currentRiff;
var loop;
var currentSequence;
var synth;
var isPlaying = false;

Tone.Transport.start();

$.ajax({
  url: '/api/riffs/all',
  method: "GET"
}).done(function(riffs) {
  allRiffs = riffs;
});

StartAudioContext(Tone.context, "article").then(function() {

  //opens modal when click on tile
  $('article').on('click', function (evt) {
    if (evt.target.id === 'favorite') return;
    if (evt.target.className.indexOf('fa') > -1) return;
    $('.modal').addClass('is-active');
    
    var riffId = $(this).data('id');
    var url = '/api/riffs/' + riffId;

    $.ajax({
      url: url,
      method: "GET"
    }).done(function(riff) {
      // set tempo to riff's tempo
      Tone.Transport.bpm.value = 120;

      // Tone.Transport.start();

      //get step array
      var sequence = getStepArray(riff.sequence);
      
      $.each($('.modal-step'), function(index, value) {
        $(this).text(sequence[index]);
      });

      console.log(sequence);

      // keep track of which step in the sequence we're on
      var step = 0;

      // create instrument
      synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

      // initialize loop with parameters from riff
      loop = new Tone.Loop(function(time) {
        if (step >= sequence.length) {
          step = 0;
        }

        if (sequence[step] != " ") {
          synth.triggerAttackRelease(sequence[step], "8n", time);
        }

        step++;

      }, "8n");

      $(".is-active #cn-button").on("click", function(event) {
        loop.start();
      });

    });


  });

  function getStepArray (dbString) {
    let seq = dbString.split(", ");

    seq[0] = seq[0].slice(1);
    seq[seq.length-1] = seq[seq.length-1].slice(0, -1);
    seq.forEach((el, i) => {
      seq[i] = el.slice(1,-1);
    });

    return seq;
  }

  // Play the sequence that was clicked
  $('.fa-play').on('click', function(event) {

    if (isPlaying) {
      loop.stop();
      isPlaying = false;
      return;
    }

    var step = 0;

    for (var i = 0; i < allRiffs.length; i++) {
      if (allRiffs[i].id === id) {
        currentRiff = allRiffs[i];
        break;
      }
    }

    // set tempo 
    Tone.Transport.bpm.value = currentRiff.tempo;

    // get sequence and format it
    currentSequence = getStepArray(currentRiff.sequence);

    // initialize instrument
    synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

    // initialize loop
    loop = new Tone.Loop(function(time) {
      if (step >= currentSequence.length) {
        step = 0;
      }

      if (currentSequence[step] != " ") {
        synth.triggerAttackRelease(currentSequence[step], "8n", time);
      }

      step++;
    }, "8n");


    Tone.Transport.start();
    setTimeout(function() {
      loop.start();
    }, 3);
    
    isPlaying = true;


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
    let mod = $(this).attr('id')[1];
    let val = `${key}${mod}`;
    let p8 = $(`#${key}-p8-option`).val();

    if ($(`#${val}-check`).prop('checked')) {
      if (mod === 'b') $(`#${key}s-check`).prop('checked', false);
      else $(`#${key}b-check`).prop('checked', false);

      if (mod === 's') val = key + '#';
    } else {
      val = key;
    }

    $(`#${key}-step-selector`).attr('value', `${val}${p8}`);
  });

  //changing octaves
  $('.p8-option').on('change', function () {
    let p8 = $(this).val();
    let key = $(this).attr('id')[0];
    let curVal = $(`#${key}-step-selector`).attr('value').slice(0,-1);
    $(`#${key}-step-selector`).attr('value', curVal+p8);
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
        $(this).val($(that).attr('value'));
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
        $(this).val($('.picked').attr('value'));
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
