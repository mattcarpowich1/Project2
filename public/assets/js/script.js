let allRiffs;
let currentRiff;
let currentSequence;

let modalLoop;
let modalStep = 0;
let step = 0;
let modalSynth;
//use these to update/insert db
let modalSequence = [
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " ",
  " "
];

let modalBeat = 8;

let activeRiffs = [];
let loopsPlaying = [];
let loopSteps = [];

let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];


//INITIALIZE DRUMS
let kick = new Tone.MembraneSynth({
  pitchDecay: 0.01,
  octaves: 5,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.001,
    decay: .1,
    sustain: .5,
    release: .25
  }
}).toMaster();
kick.volume.value = -5;

let snareNoise = new Tone.NoiseSynth({
  noise: {
    type: "brown"
  },
  envelope: {
    attack: .005,
    decay: .1625,
    sustain: .05,
    release: .5
  }
});

let dist = new Tone.Distortion(0.8).toMaster();

snareNoise.connect(dist);

snareNoise.volume.value = -22;

let cymbal = new Tone.MetalSynth({
  frequency: 200,
  envelope: {
    attack: .001,
    decay: .0625,
    release: .125
  },
  harmonicity: 5,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5
}).toMaster();

cymbal.volume.value = -25;

let kickActive = false;
let snareActive = false;
let cymbalActive = false;

Tone.Transport.start();

$.ajax({
  url: "/api/riffs/all",
  method: "GET"
}).done(function(riffs) {
  allRiffs = riffs;
});

StartAudioContext(Tone.context, "article").then(function() {
  //opens modal when click on tile
  $('article').on('click', function (evt) {
    if (evt.target.className.indexOf("controller-btn") > -1) return;
    if (evt.target.className.indexOf("favorite") > -1) return;
    $(".modal").addClass("is-active");
    removeActive(".step");

    //stop playing loops
    if (loopsPlaying.length > 0) {
      loopsPlaying.forEach((loop) => loop.stop(0.01));
    }
    //clears out tile loops
    activeRiffs = [];
    loopsPlaying = [];
    loopSteps = [];
    resetRadio();

    if (!$(this).data('authored')) {
      $('footer').hide();
    } else {
      $('footer').show();
    }

    if ($(this).data('username') !== '') {
      $('.modal-riff-user').html(`@${$(this).data('username')}`);
    } else {
      $('.modal-riff-user').empty();
    }

    let riffId = $(this).data("id");
    $("#modal-title-input").val("New Riff");

    if (riffId) {
      let url = "/api/riffs/" + riffId;
      $.ajax({
        url: url,
        method: "GET"
      }).done(function(riff) {

        // set tempo to riff's tempo
        Tone.Transport.bpm.value = 120;

        //get step array
        modalSequence = getStepArray(riff.sequence);
        modalBeat = riff.beat_division;

        //set riff name
        let slider = 3;
        $("#modal-title-input").val(riff.title);
        $(".modal").attr("data-id", riffId)
        switch (riff.beat_division) {
          case 2: slider = 1; break;
          case 4: slider = 2; break;
          case 8: slider = 3; break;
          case 16: slider = 4; break;
        }
        $(".modal-beat-sel").val(slider);

        $.each($(".modal-step"), function(index, value) {
          $(this).text(modalSequence[index]);
        });
        defineLoop(modalSequence, modalBeat);
      });
    } else {
      $.each($(".modal-step"), function(index, value) {
        $(this).text(modalSequence[index]);
      });
      defineLoop(modalSequence, modalBeat);
      $("#modal-title-input").attr("placeholder", "New Riff");
    }
  });

  function defineLoop(seq, beat) {
    // modalLoop = {};
    modalStep = 0;
    modalSynth = new Tone.PolySynth(8, Tone.Synth).toMaster();

    // initialize loop with parameters from riff
    modalLoop = new Tone.Loop(function(time) {
      if (modalStep >= seq.length) {
        modalStep = 0;
      }

      let prev = modalStep === 0 ? seq.length-1 : modalStep - 1;
      $(`#modal-step-${prev}`).removeClass(`active-step-${seq[prev][0]}`);
      $(`#modal-step-${modalStep}`).addClass(`active-step-${seq[modalStep][0]}`);

      if (seq[modalStep] != " ") {
        modalSynth.triggerAttackRelease(seq[modalStep], "8n", time);
      }

      if (kickActive) {
        if (modalStep % 2 === 0) {
          kick.triggerAttackRelease("C2", "16n", time);
        }
      }

      if (snareActive) {
        if (modalStep % 2 === 0 && modalStep % 4 != 0) {
          snareNoise.triggerAttackRelease("16n", time);
        }
      }

      if (cymbalActive) {
        cymbal.triggerAttackRelease("16n", time);
      }

      modalStep++;
    }, `${beat}n`);
  }

  $(".modal-radio").on("click", function(event) {
    if ($(this).val() === 'play') {
      if (modalLoop !== undefined) {
        if (modalLoop.state !== "started") {
          modalStep = 0;
          Tone.Transport.start();
          setTimeout(function() {
            modalLoop.start(0.01);
          }, 3);
        }
      } else {
        modalStep = 0;
        Tone.Transport.start();
        setTimeout(function() {
          modalLoop.start(0.01);
        }, 3);
      }
      $(".modal-beat-sel").prop("disabled", true);
    }  else {
      if (modalLoop.state === "started") {
        modalLoop.stop(0.01);
        Tone.Transport.stop();
        removeActive(".modal-step");
      }
      $(".modal-beat-sel").prop("disabled", false);
    }
  });

  $(".modal-beat-sel").on("change", function() {
    switch ($(this).val()) {
      case "1": modalBeat = 2; break;
      case "2": modalBeat = 4; break;
      case "3": modalBeat = 8; break;
      case "4": modalBeat = 16; break;
      default: modalBeat = 8; break;
    }
    defineLoop(modalSequence, modalBeat);
  });

  // Play the sequence that was clicked
  $(".tile-radio").on("click", function(event) {
    let id = $(this).data("id");
    let index;

    for (let i = 0; i < allRiffs.length; i++) {
      if (allRiffs[i].id === id) {
        index = i;
        break;
      }
    }
    handlePlay(
      id,
      index,
      $(this).hasClass("controller-play"),
      $(this).hasClass("controller-stop")
    );
  });

  //closes modal if clicking elements that have class
  $(".close-modal").on("click", function() {
    $(".modal").removeClass("is-active");
    clearModal();
    modalLoop.stop(0.01);
  });

  //closes modal if clicking off of modal
  $(".modal-background").on("click", function() {
    $(".modal").removeClass("is-active");
    clearModal();
    modalLoop.stop(0.01);
  });

  //pick which notes are sent to steps
  $(".step-selector").on("click", function() {
    let that = this;

    if ($(this).hasClass("picked")) {
      $(this).removeClass("picked");
    } else {
      $.each($(".picked"), function() {
        $(this).removeClass("picked");
      });
      $(this).addClass("picked");
    }

    if ($("#step-grid").find(".clicked").length !== 0) {
      $(".clicked").each(function() {
        $(this).html($(that).attr("value"));
        $(this).val($(that).attr("value"));
        modalSequence[parseInt($(this).data("id"))] = $(that).attr("value");
        $(this).removeClass("clicked");
        $(this).addClass("unclicked");
        $(that).removeClass("picked");
      });
    }
  });

  //steps clicked
  $(".modal-step").on("click", function() {
    if ($(this).hasClass("unclicked")) {
      $(this).removeClass("unclicked");
      $(this).addClass("clicked");

      if ($(".picked").attr("value") !== undefined) {
        $(this).html($(".picked").attr("value"));
        $(this).val($(".picked").attr("value"));
        modalSequence[parseInt($(this).data("id"))] = $(".picked").attr(
          "value"
        );
        $(this).addClass("unclicked");
        $(this).removeClass("clicked");
      } else {
        if ($(this).html() !== "") {
          $(this).empty();
          modalSequence[parseInt($(this).data("id"))] = " ";
        }
      }
    } else {
      $(this).removeClass("clicked");
      $(this).addClass("unclicked");
    }
  });
});

//clear step when modal closes
function clearModal() {
  $(".modal-step").each(function() {
    kickActive = false;
    snareActive = false;
    cymbalActive = false;
    $(this).empty();
    $(this).addClass("unclicked");
    $(this).removeClass("clicked");
  });
  $(".step-selector").each(function() {
    $(this).removeClass("picked");
  });
  modalStep = 0;
  modalSequence = [
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " "
  ];
  removeActive(".modal-step");
  $(".percussion-btn").each(function () {
    $(this).removeClass("picked");
  });
}

function removeActive (el, stepKey='all') {
  if (stepKey === 'all') {
    $(el).each( function () {
      $(el).removeClass("active-step-C");
      $(el).removeClass("active-step-D");
      $(el).removeClass("active-step-E");
      $(el).removeClass("active-step-F");
      $(el).removeClass("active-step-G");
      $(el).removeClass("active-step-A");
      $(el).removeClass("active-step-B");
    });
  } else {
    $(el).removeClass(`active-step-${stepKey}`);
  }
};

$("#publish-riff").on("click", function() {
// SaamK - Added a variable for riffId and created an if statement that is looking for if the data-id attribute exits. If no it posts a new riff, if yes it updates.
  var riffId = 0;
  riffId = $(this).closest(".modal").attr("data-id");
  let sequenceString = JSON.stringify(modalSequence);
  let newRiff = {
    title: $("#modal-title-input").val().trim(),
    sequence: sequenceString,
    beat_division: modalBeat,
  };
  if(!$(".modal").data("id")){
  $.post("/api/riffs/new", newRiff, function() {
    console.log("THERE");
    window.location.href = "/";
  });
} else{
  $.ajax({
    url: "/update",
    method: "PUT",
    data: {
      data: newRiff,
      id: riffId
    },
    dataType: "json",
    success: function(result) {
      window.location.href = "/";
    }
  });
}
});

//delete riff
$("#delete").on("click", function () {
  var riffId = 0;
    riffId = $(this).closest(".modal").attr("data-id");
    $(".modal").removeClass("is-active");
    $.ajax({
      url: "/delete",
      method: "DELETE",
      data: {
        id: riffId
      },
      dataType: "json",
      success: function(result) {
        location.reload();
      }
    });
});


$(".favorite").on("click", function() {
  let riffId = 0;
  if ($(this).is("#modal-favorite"))
    riffId = $(this).closest(".modal").attr("data-id");
  else
    riffId = $(this).closest("article").attr("data-id");
  let $this =  $(this);
  if ($(this).hasClass("fa-star")) {
    $.ajax({
      url: "/remove_favorite",
      method: "POST",
      data: {
        riffId: riffId
      },
      dataType: "json",
      success: function(result) {
        $this.removeClass("fa-star");
        $this.addClass("fa-star-o");
      }
    });
  } else {
    $.ajax({
      url: "/add_favorite",
      method: "POST",
      data: {
        riffId: riffId
      },
      dataType: "json",
      success: function(result) {
        $this.removeClass("fa-star-o");
        $this.addClass("fa-star");
      }
    });
  }
});

//altering to sharps and flats
$(".mod-check").on("click", function() {
  let key = $(this).attr("id")[0];
  let mod = $(this).attr("id")[1];
  let val = `${key}${mod}`;
  let p8 = $(`#${key}-p8-option`).val();

  if ($(`#${val}-check`).prop("checked")) {
    if (mod === "b") $(`#${key}s-check`).prop("checked", false);
    else $(`#${key}b-check`).prop("checked", false);

    if (mod === "s") val = key + "#";
  } else {
    val = key;
  }

  $(`#${key}-step-selector`).attr("value", `${val}${p8}`);
});

//changing octaves
$(".p8-option").on("change", function() {
  let p8 = $(this).val();
  let key = $(this).attr("id")[0];
  let curVal = $(`#${key}-step-selector`)
    .attr("value")
    .slice(0, -1);
  $(`#${key}-step-selector`).attr("value", curVal + p8);
});

//Toggle Kick Drum
$('#kick_button').on('click', function() {
  kickActive = !kickActive;
  if (kickActive) $(this).addClass('picked');
  else $(this).removeClass('picked');
});

//Toggle Snare Drum
$('#snare_button').on('click', function() {
  snareActive = !snareActive;
  if (snareActive) $(this).addClass('picked');
  else $(this).removeClass('picked');
});

//Toggle Cymbal
$('#cymbal_button').on('click', function() {
  cymbalActive = !cymbalActive;
  if (cymbalActive) $(this).addClass('picked');
  else $(this).removeClass('picked');
});

//takes in sequence from db and turns it into proper array
function getStepArray(dbString) {
  let seq = dbString.split(",");

  seq[0] = seq[0].slice(1);
  seq[seq.length - 1] = seq[seq.length - 1].slice(0, -1);
  seq.forEach((el, i) => {
    seq[i] = el.trim().slice(1, -1);
  });

  return seq;
}

function defineTileLoop(id, seq, step, beat) {
  let tileSynth = new Tone.PolySynth(2, Tone.Synth).toMaster();
  step = 0;
  let loop = new Tone.Loop(function(time) {
    if (step >= seq.length) {
      step = 0;
    }

    let prev = step === 0 ? seq.length - 1 : step - 1;
    $(`#step-${id}-${prev}`).removeClass(`active-step-${seq[prev][0]}`);
    $(`#step-${id}-${step}`).addClass(`active-step-${seq[step][0]}`);

    if (seq[step] != " ") {
      tileSynth.triggerAttackRelease(seq[step], "8n", time);
    }

    step++;
  }, `${beat}n`);
  return loop;
}

//removes last element from arrays
function popActiveLoop() {
  loopsPlaying.pop();
  activeRiffs.pop();
  loopSteps.pop();
}

//removes first element from arrays
function sliceActiveLoop() {
  loopsPlaying.slice(1);
  activeRiffs.slice(1);
  loopSteps.slice(1);
}

//removes arbitrary element from array
function spliceActiveLoop(index) {
  loopsPlaying.splice(index, 1);
  activeRiffs.splice(index, 1);
  loopSteps.splice(index, 1);
}

//Saves loop in arrays
function pushActiveLoop(id, seq, beat) {
  activeRiffs.push(id);
  loopSteps.push(0);
  let loop = defineTileLoop(id, seq, loopSteps[loopSteps.length - 1], beat);
  loopsPlaying.push(loop);
}

//resete the tile play/stop buttons
function resetRadio(ref = null) {
  if (ref === null) {
    $(`input[type="radio"]`).each(function() {
      $(this).prop("checked", false);
    });
  } else {
    $(`input[name="radio-${ref}"][value="play"]`).prop("checked", false);
  }
}

//main screen play button handler
function handlePlay(id, index, hitPlay, hitStop) {
  let riff = allRiffs[index];
  let seq = getStepArray(riff.sequence);
  let beat = riff.beat_division;

  let maxPlaying = 2;
  let ref = activeRiffs.indexOf(id);

  //generic look to stop associated id
  if (hitStop) {
    if (ref > -1) {
      loopsPlaying[ref].stop(0.01);
      spliceActiveLoop(ref);
      removeActiveStepTiles(id, seq.length);
      // removeActive(".step");
    }
  } else {
    if (activeRiffs.length < maxPlaying) {
      if (ref === -1) {
        pushActiveLoop(id, seq, beat);
        Tone.Transport.start();
        loopsPlaying[activeRiffs.length - 1].start(0.01);
      }
    } else {
      if (ref === -1) {
        //stop and remove last playing loop
        let stopRiff = activeRiffs[activeRiffs.length - 1];
        resetRadio(stopRiff);
        loopsPlaying[activeRiffs.length - 1].stop(0.01);
        popActiveLoop();

        //start clicked loop
        pushActiveLoop(id, seq, beat);
        Tone.Transport.start();
        loopsPlaying[activeRiffs.length - 1].start(0.01);

        //turns off colors
        removeActiveStepTiles(stopRiff, seq.length);
      }
    }
  }
}

function removeActiveStepTiles (id, len) {
  for (let i = 0; i < len - 1; i++) {
    $(`#step-${id}-${i}`).removeClass("active-step-C");
    $(`#step-${id}-${i}`).removeClass("active-step-D");
    $(`#step-${id}-${i}`).removeClass("active-step-E");
    $(`#step-${id}-${i}`).removeClass("active-step-F");
    $(`#step-${id}-${i}`).removeClass("active-step-G");
    $(`#step-${id}-${i}`).removeClass("active-step-A");
    $(`#step-${id}-${i}`).removeClass("active-step-B");
  }
};
