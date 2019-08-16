var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
  isMobile = true;
} else {}
if (navigator.requestMIDIAccess) {
  console.log('This browser supports WebMIDI!');
  if (document.querySelector('body')) {
    // document.querySelector('body').innerHTML = 'MIDI DEVICES FOUND';
  }
  // navigator.requestMIDIAccess({ sysex: true } ).then(onMIDISuccess, onMIDIFailure);
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  console.log('WebMIDI is not supported in this browser.');
  document.querySelector('body').innerHTML = 'Error: This browser does not support WebMIDI.';
}
var midi = null;
var output = null;
var isConnected = false;

function onMIDISuccess(midiAccess) {
  // document.querySelector('body').innerHTML = 'Press any note to begin...';
  midi = midiAccess;
  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;
  var lista = [];
  var devicesMap = new Map();
  for (var input of midiAccess.inputs.values()) {
    lista.push(input.name);
    devicesMap.set(input.id, input.name);
    if (input.name == "CONTROL PIE") {
      input.onmidimessage = getCTRLPIEmsg; // attach de un listener distinto para el dispositivo control pie
    } else {
      input.onmidimessage = getMIDIMessage; //attach de un litener generico de mensajes midi (util para hacer midi LEARN)
    }
  }
  for (out of midiAccess.outputs.values()) {
    if (out.name == "CONTROL PIE") {
      console.log(out.name);
      output = out;
      isConnected = true;
      sendInitMsg();
      sendKeepAlive();
      // $('#btnAlertConnect').removeClass("invisible");
      // $('#btnAlertConnect').removeClass("btn btn-warning");
      // $('#btnAlertConnect').addClass("btn btn-block bg-light");
      // $('#btnAlertConnect').addClass("btn-info");
      // $('#alertConnect').hide();
    } else {
      // $('#btnAlertConnect').removeClass("invisible");
      // $('#btnAlertConnect').addClass("btn-warning");
      // no hay attach de eventos para otros outputs
      // $('#alertConnect').show();
    }
  }
}

function showCtrlPieConnected() {
  $('#alertConnect').hide();
  $("#lowPanel").removeClass("invisible");
  $('#infoAlertConnect').show();
  $('#infoSelPreset').collapse('show');
}

function onMIDIFailure() {
  document.querySelector('.step0').innerHTML = 'Error: Could not access MIDI devices. Connect a device and refresh to try again.';
}

function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = (message.data.length > 2) ? message.data[2] : null; // a velocity value might not be included with a noteOff command
  console.log(command + " " + note + " " + velocity);
  switch (true) { //un switch especial!!!
    case ((command >= 144) && (command <= 159)): // noteOn
      if (velocity > 0) {
        midiLearnCommand = "NOTE";
        midiLearnNote = velocity;
        noteOnListener(command & 0xf, note, velocity);
      } else {
        noteOffListener(note);
      }
      break;
    case ((command >= 128) && (command <= 143)):
      noteOffCallback(note);
      break;
    default:
      break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}
var connectionStep = 0;
var dataCount = 0;
var allConfigData = new Array(493);
var originalConfigData = new Array(493);
var demoData = [1, 54, 1, 1, 19, 1, 0, 13, 1, 0, 13, 1, 0, 14, 1, 0, 9, 1, 0, 15, 1, 0, 15, 1, 1, 55, 1, 1, 17, 1, 0, 86, 3, 0, 84, 3, 0, 88, 3, 0, 91, 3, 0, 94, 3, 0, 93, 3, 0, 90, 3, 0, 92, 3, 0, 95, 3, 0, 95, 3, 0, 226, 2, 0, 234, 2, 0, 180, 2, 0, 182, 2, 0, 205, 2, 0, 183, 2, 0, 179, 2, 0, 181, 2, 0, 233, 2, 0, 233, 2, 16, 15, 1, 16, 31, 1, 0, 82, 1, 0, 80, 1, 0, 205, 2, 0, 183, 2, 0, 44, 1, 0, 81, 1, 0, 226, 2, 0, 74, 1, 16, 29, 1, 17, 29, 1, 0, 88, 3, 0, 91, 3, 0, 94, 3, 0, 93, 3, 0, 90, 3, 0, 92, 3, 0, 95, 3, 0, 6, 1, 4, 43, 1, 64, 30, 1, 0, 41, 1, 64, 31, 1, 0, 40, 1, 64, 32, 1, 0, 44, 1, 64, 33, 1, 0, 58, 1, 64, 34, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 127, 1, 127, 0, 127, 2, 127, 0, 48, 3, 0, 49, 3, 0, 50, 3, 0, 51, 3, 0, 52, 3, 0, 53, 3, 0, 54, 3, 0, 55, 3, 0, 56, 3, 0, 57, 3, 0, 58, 3, 0, 59, 3, 0, 60, 3, 0, 61, 3, 0, 62, 3, 0, 63, 3, 0, 64, 3, 0, 65, 3, 0, 66, 3, 0, 67, 3, 0, 68, 3, 0, 69, 3, 0, 70, 3, 0, 71, 3, 0, 72, 3, 0, 73, 3, 0, 74, 3, 0, 75, 3, 0, 76, 3, 0, 77, 3, 0, 78, 3, 0, 79, 3, 0, 80, 3, 0, 81, 3, 0, 82, 3, 0, 83, 3, 0, 84, 3, 0, 85, 3, 0, 86, 3, 0, 87, 3, 0, 88, 3, 0, 89, 3, 0, 90, 3, 0, 91, 3, 0, 92, 3, 0, 93, 3, 0, 94, 3, 0, 95, 3, 0, 96, 3, 0, 97, 3, 0, 98, 3, 0, 99, 3, 0, 100, 3, 0, 101, 3, 0, 102, 3, 0, 103, 3, 0, 104, 3, 0, 105, 3, 0, 106, 3, 0, 107, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 9, 0, 205, 2, 0, 183, 2, 0, 255, 0, 193];
var presetSelected;
var currentBank = -1;
var currentBankName = "";
var buttonPressed = null;
var editingHold = null;
var selectedModifierText = "";
var selectedTypeText = "";
var selectedValueText = "";
var storedTypeTextP = "";
var storedValueTextP = "";
var storedModifierTextP = "";
var storedTypeTextH = "";
var storedValueTextH = "";
var storedModifierTextH = "";
var left_shift = 0b00000001; // hex for 0000 0001 1
var right_shift = 0b00000010; // hex for 0000 0010 2
var left_alt = 0b00000100; // hex for 0000 0100 4
var right_alt = 0b00001000; // hex for 0000 1000 8
var left_ctrl = 0b00010000; // hex for 0001 0000 16
var right_ctrl = 0b00100000; // hex for 0010 0000 32
var left_gui = 0b01000000; // hex for 0100 0000 64
var right_gui = 0b10000000; // hex for 0100 0000 128
var externalBtn = 483;
var serialNumber = 0;
var midiLearnCommand = 0;
var midiLearnNote = 0;
var modifierSelected = null;
var typeSelected = null;
var valueSelected = null;
var modifierPress = null;
var valuePress = null;
var typePress = null;
var behaveShort = null;
var modifierHold = null;
var valueHold = null;
var typeHold = null;
var behaveHold = null;

function getCTRLPIEmsg(message) {
  var header = message.data[0];
  var leftHalf = message.data[1];
  var rightHalf = (message.data.length > 2) ? message.data[2] : 0; // a rightHalf value might not be included with a leftHalfOff command
  var decValue = (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f));
  switch (connectionStep) {
    case 0: //CTRL pie is connecting
      //ignores incomming messages in this stage
      console.log("ignoring..." + header.toString(16) + " " + leftHalf.toString(16) + " " + rightHalf.toString(16));
      break;
    case 1: // waiting for response token
      console.log("handshaking... " + header.toString(16) + " " + leftHalf.toString(16) + " " + rightHalf.toString(16));
      if (header == 0xBC && leftHalf == 0x1A && rightHalf == 0x70) {
        var msg2 = [0xBC, 0x1A, 0x7F]; // leftHalf on, middle C, full rightHalf
        console.log(msg2);
        output.send(msg2, window.performance.now() + 500.0);
        connectionStep++;
      }
      break;
    case 2: //receiving inital data config
      dataCount++;
      allConfigData[dataCount] = (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f)); //Stores read data
      originalConfigData[dataCount] = (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f)); //Stores a backup of read data
      console.log("data: " + pad(dataCount, 3) + " " + decimalToHex(header, 2) + " " + decimalToHex(leftHalf, 2) + " " + decimalToHex(rightHalf, 2) + " dec value: " + decValue);
      if (dataCount == 493) {
        console.log("all data received ok");
        dataCount = 0;
        setRadioWithCurrentPreset(rightHalf);
        connectionStep++; // Handle timeout or any possible error.
      }
      break;
    case 3: // NOTE: PROCESSING SERIAL NUMBER BYTES
      dataCount++;
      console.log("data: " + pad(dataCount, 3) + " " + decimalToHex(header, 2) + " " + (leftHalf).toString(2) + " " + (rightHalf).toString(2) + " dec value: " + decValue);
      switch (dataCount) {
        case 1:
          serialNumber = decValue;
          break;
        case 2:
          serialNumber = ((decValue << 8) | serialNumber);
          break;
        case 3:
          serialNumber = ((decValue << 16) | serialNumber);
          break;
        case 4:
          serialNumber = ((decValue << 24) | serialNumber);
          break;
      }
      if (dataCount == 4) {
        console.log("SERIAL NUM RECEIVED OK");
        console.log("Serial number is: " + serialNumber);
        dataCount = 0;
        connectionStep++;
        showCtrlPieConnected();
      }
      break;
    case 4: //connected to Ctrol PIE
      console.log("data: " + pad(dataCount, 3) + " " + decimalToHex(header, 2) + " " + decimalToHex(leftHalf, 2) + " " + decimalToHex(rightHalf, 2) + " dec value: " + decValue);
      if (header == 187 && rightHalf == 0) {
        var tx = "Button " + leftHalf + " pressed.";
        $("#btnPressed").text(tx)
        $("#btnPressed").removeClass("btnHold");
        $("#btnPressed").addClass("btnPress");
        $("#btnPressed").css({
          "opacity": "1"
        });
        window.clearTimeout(timer);
        timer = window.setTimeout(hideOverlay, 3000);
        console.log(tx);
        showBtnConfig(leftHalf);
      }
      if (header == 187 && rightHalf == 1) {
        var tx = "Button " + leftHalf + " long press.";
        $("#btnPressed").text(tx);
        $("#btnPressed").removeClass("btnPress");
        $("#btnPressed").addClass("btnHold");
        $("#btnPressed").css({
          "opacity": "1"
        });
        window.clearTimeout(timer);
        timer = window.setTimeout(hideOverlay, 3000);
        console.log(tx);
        showBtnConfig(leftHalf);
      }
      //BE 0F 7F
      if (header == 190 && leftHalf == 15 && rightHalf == 127) { //CONFIRMATION OF FACTORY RESTORE
        $("#modalbody").text("Default values restored.");
        $("#restoreToFactory").addClass("disabled")
        $("#restoreToFactory").prop('disabled', true);
        $("#restoreBtn").prop('disabled', true);
        $("#restoreTitle").text("OPERATION SUCCESSFUL");
        $("#restoreHeading").removeClass("bg-danger")
        $("#restoreHeading").addClass("bg-success")
        sendInitMsg();
        populateDashboard(presetSelected, currentBank);
      }
      break;
    case 5: //DEMO
      break;
  }
}
var timer = setTimeout(hideOverlay, 3000);

function hideOverlay() {
  $('#btnPressed').css({
    "opacity": "0"
  });
}

function noteOffCallback(note) {
  // alert("not off"+note);
}

function noteOnListener(channel, note, velocity) {
  // $('#channel').html("Channel: " + channel);
  // $('#notePressed').html("Note Pressed: " + note);
  // $('#noteVelocity').html("Velocity: " + velocity);
}

function noteOffListener(note) {
  // document.querySelector('#noteReleased').innerHTML = note;
}
// var CtrlPieIsConnected = false;
function sendInitMsg() {
  var msg1 = [0xBE, 0x1A, 0x70]; // BE	1A	70
  console.log("Connect request..." + msg1);
  sendMessageToCtrlPie(msg1);
  connectionStep = 1;
}

function sendKeepAlive() {
  var msg1 = [0xB7, 0x70, 0x7F]; // note on, middle C, full velocity
  if (output) {
    sendMessageToCtrlPie(msg1);
    console.log("keep alive...");
  }
  setTimeout(sendKeepAlive, 5000);
}

function setRadioWithCurrentPreset(value) {
  console.log(value);
  presetSelected = value;
  $('input[id="option' + value + '"]').parent().addClass('active');
};

function noteToNoteName(note) {
  note -= 21; // see the explanation below.
  var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
  var octave = parseInt(note / 12) + 1;
  // var name = notes[note % 12];
  var name = notes[((note % 12) + 12) % 12];
  return (name + octave);
}
Number.prototype.mod = function(n) {
  return ((this % n) + n) % n;
}

function startDemo() {
  for (let i = 1; i <= demoData.length; i++) {
    allConfigData[i] = demoData[i - 1];
    originalConfigData[i] = demoData[i - 1];
    console.log("copying.." + i);
  }
}

function sendMessageToCtrlPie(msg) {
  if (!(output === null)) {
    output.send(msg);
  }
}
$(document).ready(function() { // ESTO PREVIENE QUE SE EJECUTEN ESTOS JQUERY ANTES DE QUE CARGUE LA PAGINA
  $('#applyEditBtn').click(function() {
    $('#editBtnModal').modal('hide');
    applyEditBtnData();
  });
  $('#btnSaveAllPresetsToFile').click(function() {
    saveAllDataInfo();
  });
  $("#btnDemo").click(function() {
    isConnected = true;
    startDemo();
    serialNumber = "THIS IS A DEMO"
    setRadioWithCurrentPreset(1);
    showCtrlPieConnected();
    connectionStep = 5;
  });
  $('#btnsCarousel').carousel('pause');
  $("#backToAll").click(function() {
    populateDashboard(presetSelected, currentBank);
    $('#btnsCarousel').carousel(6);
    $('#btnsCarousel').carousel('pause');
  });
  $('[id^="btnInfo"]').click(function() {
    buttonPressed = (($(this).prop('id')).slice(-1));
    $('#specificButtonInfo').text("BUTTON " + buttonPressed + " CURRENT SETUP");
    showBtnConfig(buttonPressed);
  });
  $('#infoAlertConnect').click(function() {
    if (isConnected) {
      // alert("SERIAL NUMBER IS: xxxxx");
      $('#serialNumber').text("Your CONTROL PIE serial number is: " + serialNumber);
      $("#serialModal").modal();
    } else {}
  });
  $('#btnAlertConnect').click(function() {
    if (isConnected) {} else {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }
  });
  $("#getConfig").click(function() {
    var msg1 = [0xBE, 0x1D, 0x70]; //BE	1D	70
    sendMessageToCtrlPie(msg1);
  });
  $("#getActivePreset").click(function() {
    var msg1 = [0xBE, 0x1D, 0x70]; //BE	1D	70
    sendMessageToCtrlPie(msg1);
  });
  $("#restoreToFactory").click(function() {
    var msg1 = [0xBE, 0x0F, 0x70]; //BE	0F	70
    sendMessageToCtrlPie(msg1);
    //     sendMessageToCtrlPie(msg1); //disconnect
    // wait(5000)
    // alert("Control Pie restored to factory default values");
  });
  $("#restoreBtn").click(function() {
    console.log("sdsd");
    $("#restoreToFactory").removeClass("disabled")
    $("#restoreToFactory").prop('disabled', false);
  });

  function updatePresetBtn(preset) {
    $('#btnGroupDrop1').text("Preset " + preset);
    $('#btnGroupDrop1').removeClass("btn-warning");
    $('#btnGroupDrop1').addClass("btn-success");
    $('#btnBank1').prop('disabled', false);
    $('#btnBank2').prop('disabled', false);
    $("#imgPresetsTop").attr("src", "leds-presets-" + preset + ".png");
    if (currentBank == 0 || currentBank == 240) {
      populateDashboard(preset, currentBank);
      if (currentBank == 240) {
        $("#imgPresetsTop").attr("src", "leds-presets-" + preset + "b2.png");
      }
    }
  }
  $('[id^="showBtn"]').click(function() {
    resetSelectedConfig(true);
    buttonPressed = (($(this).prop('id')).slice(-1));
    $('#specificButtonInfo').text("BUTTON " + buttonPressed + " CURRENT SETUP");
    $('#specificButtonInfo').addClass("bg-info");
    $('#specificButtonInfo').removeClass("bg-warning");
    showBtnConfig(buttonPressed);
  });
  $("#showAll").click(function() {
    $('#allPresetsInfo').show();
    $('#buttonInfo').hide();
    $("#btnsCarousel").carousel(6);
    $('#btnsCarousel').carousel('pause');
  });
  $("#external").click(function() {
    $('#specificButtonInfo').text("EXTERNAL BUTTON CURRENT SETUP");
    $('#specificButtonInfo').removeClass("bg-info");
    $('#specificButtonInfo').addClass("bg-warning");
    showBtnConfig("6");
  });
  $("[id^=preset]").click(function() {
    presetSelected = (($(this).prop('id')).slice(-1));
    var msg1 = [0xBF, 0x1C, presetSelected]; //BF	1C	06
    sendMessageToCtrlPie(msg1);
    updatePresetBtn(presetSelected);
    updatePresetCardTitle()
    showAllPresetData();
    console.log(presetSelected);
  });
  $('#btnBank1').click(function() {
    $('#btnBank1').removeClass("btn-dark");
    $('#btnBank1').addClass("btn-success");
    $('#btnBank2').addClass("btn-dark");
    $('#btnBank2').removeClass("btn-success");
    $('#bankInfo').text("EDITING BANK 1");
    currentBank = 0; // para bank 1
    currentBankName = "1";
    $("#imgPresetsTop").attr("src", "leds-presets-" + presetSelected + ".png");
    populateDashboard(presetSelected, currentBank);
    $('#collapsePresets').addClass("show");
    $('#infoSelPreset').collapse('hide');
    showAllPresetData();
    updatePresetCardTitle();
    //BF	1C	07 para bank 1
    //BF	1C	08 para bank 1
    var msg1 = [0xBF, 0x1C, 6 + 1]; //BF	1C	07 para bank 1
    sendMessageToCtrlPie(msg1);
  });
  $('#btnBank2').click(function() {
    $('#btnBank2').removeClass("btn-dark");
    $('#btnBank2').addClass("btn-success");
    $('#btnBank1').addClass("btn-dark");
    $('#btnBank1').removeClass("btn-success");
    $('#bankInfo').text("EDITING BANK 2");
    currentBank = 240; //240 para bank 2
    currentBankName = "2";
    $("#imgPresetsTop").attr("src", "leds-presets-" + presetSelected + "b2.png");
    populateDashboard(presetSelected, currentBank);
    $('#collapsePresets').addClass("show");
    showAllPresetData();
    updatePresetCardTitle();
    //BF	1C	07 para bank 1
    //BF	1C	08 para bank 1
    var msg1 = [0xBF, 0x1C, 6 + 2]; //BF	1C	08 para bank 2
    sendMessageToCtrlPie(msg1);
  });
  $('#leftShift').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | left_shift;
    } else {
      modifierSelected = modifierSelected ^ left_shift;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#rightShift').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | right_shift;
    } else {
      modifierSelected = modifierSelected ^ right_shift;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#leftAlt').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | left_alt;
    } else {
      modifierSelected = modifierSelected ^ left_alt;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#rightAlt').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | right_alt;
    } else {
      modifierSelected = modifierSelected ^ right_alt;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#leftControl').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | left_ctrl;
    } else {
      modifierSelected = modifierSelected ^ left_ctrl;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#rightControl').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | right_ctrl;
    } else {
      modifierSelected = modifierSelected ^ right_ctrl;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#leftGui').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | left_gui;
    } else {
      modifierSelected = modifierSelected ^ left_gui;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#rightGui').click(function() {
    if ($(this).is(':checked')) {
      modifierSelected = modifierSelected | right_gui;
    } else {
      modifierSelected = modifierSelected ^ right_gui;
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
  });
  $('#editPress').click(function() {
    updateCurrentConfig(false); //boolean indicates type of button (pulse or hold)
    $('#btnConfigTitle').html("Editing config for BUTTON " + buttonPressed + " | PRESET " + presetSelected + " | BANK " + currentBank + " (when PRESSED momentarily)");
    $('#editHeading').removeClass('bg-hold');
    $('#editHeading').addClass('bg-press');
    $('#editHeading').removeClass('text-dark');
    $('#editHeading').addClass('text-light');
    editingHold = false;
  });
  $('#editHold').click(function() {
    updateCurrentConfig(true);
    $('#btnConfigTitle').html("Editing config for BUTTON " + buttonPressed + " | PRESET " + presetSelected + " | BANK " + currentBank + " (when HOLD)");
    $('#editHeading').removeClass('bg-press');
    $('#editHeading').addClass('bg-hold');
    $('#editHeading').removeClass('text-light');
    $('#editHeading').addClass('text-dark');
    editingHold = true;
  });
  //TYPE SELECTOR IN EDIT BUTTON
  $("[id^=type]").click(function() {
    typeSelected = Number((($(this).prop('id')).slice(-1)));
    let text = "";
    switch (typeSelected) {
      case 1:
        text = "KEY";
        break;
      case 2:
        text = "MULTIMEDIA KEY";
        break;
      case 3:
        text = "MIDI NOTE";
        break;
      case 4:
        text = "MIDI CONTROL CHANGE";
        break;
      case 5:
        text = "MIDI PROGRAM CHANGE";
        break;
    }
    resetSelectedConfig(false);
    selectedTypeText = text;
    updateValueSelector(typeSelected);
    $('#btnGroupType').text(text);
    $('#btnGroupType').removeClass("btn-warning");
    $('#btnGroupType').addClass("btn-success");
    // $('#modalModifierValue').collapse('hide');
    // $('#modalChannelValue').collapse('hide');
    console.log(typeSelected);
    updateSelectedConfig();
  });

  function resetSelectedConfig(fullReset) {
    $('#selectedKey').text("choose...");
    $('#selectedChannel').text("choose...");
    $('#modalModifierValue').collapse('hide');
    $('#modalChannelValue').collapse('hide');
    if (fullReset) {
      $('#modalKeyValue').collapse('hide');
    }
    $('#leftShift').prop('checked', false);
    $('#rightShift').prop('checked', false);
    $('#leftAlt').prop('checked', false);
    $('#rightAlt').prop('checked', false);
    $('#leftControl').prop('checked', false);
    $('#rightControl').prop('checked', false);
    $('#leftGui').prop('checked', false);
    $('#rightGui').prop('checked', false);
    selectedTypeText = "";
    selectedValueText = "";
    selectedModifierText = "";
    modifierSelected = 0;
  }

  function updateSelectedConfig() {
    if (selectedTypeText != "") {
      $('#selectedConfig').html("New config: <br>" + '<span class="typeType text-dark badge">' + selectedTypeText + ':</span> ');
    }
    if (selectedValueText != "") {
      $('#selectedConfig').html("New config: <br>" + '<span class="typeType text-dark badge">' + selectedTypeText + ':</span> ' + '<span class="badge dataType badge-pill">' + selectedValueText + ' </span>');
    }
    if (selectedModifierText != "") {
      $('#selectedConfig').html("New config: <br>" + '<span class="typeType text-dark badge">' + selectedTypeText + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + selectedModifierText + ' </span>' + ' <span class="badge dataType badge-pill"> + </span>' + ' <span class="badge dataType badge-pill">' + selectedValueText + ' </span>');
    }
    let addr = ((presetSelected - 1) * 30) + ((buttonPressed - 1) * 6) + 1 + currentBank;
    let beh = ((presetSelected - 1) * 10) + ((buttonPressed - 1) * 2) + 181 + currentBank
    console.log("modifier byte: " + modifierSelected + " | value byte: " + valueSelected + " | type byte:" + typeSelected + " | hold Edit? " + editingHold + " | init address: " + addr + " | behave addres: " + beh);
    validateSelectedConfig();
  }

  function validateSelectedConfig() {
    if (typeSelected != null && valueSelected != null && modifierSelected != null) {
      $('.fa-check-circle.edit').show();
      $('#applyEditBtn').prop('disabled', false);
    } else {
      $('.fa-check-circle.edit').hide();
      $('#applyEditBtn').prop('disabled', true);
    }
  }

  function updateCurrentConfig(isHold) {
    // valueSelected = null;
    // modifierSelected = null;
    if (isHold) {
      var storedTypeText = storedTypeTextH;
      var storedValueText = storedValueTextH;
      var storedModifierText = storedModifierTextH;
    } else {
      var storedTypeText = storedTypeTextP;
      var storedValueText = storedValueTextP;
      var storedModifierText = storedModifierTextP;
    }
    if (storedTypeText != "") {
      $('#currentConfig').html("Current config: <br>" + '<span class="typeType text-dark badge">' + storedTypeText + ':</span> ');
    }
    if (storedValueText != "") {
      $('#currentConfig').html("Current config: <br>" + '<span class="typeType text-dark badge">' + storedTypeText + ':</span> ' + ' <span class="badge dataType badge-pill">' + storedValueText + ' </span>');
    }
    if (storedModifierText != "") {
      $('#currentConfig').html("Current config: <br>" + '<span class="typeType text-dark badge">' + storedTypeText + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + storedModifierText + ' </span>' + ' <span class="badge dataType badge-pill"> + </span>' + ' <span class="badge dataType badge-pill">' + storedValueText + ' </span>');
    }
  }

  function updateValueSelector(typeSelected) {
    if (typeSelected.length < 1) {
      // $('#modalModifierValue').collapse('show');
      $('#modalKeyValue').collapse('show');
    }
    valueSelected = null;
    switch (typeSelected) {
      case 1:
        fillKeyDropdown(keys);
        break;
      case 2:
        fillKeyDropdown(mediaKeys);
        break;
      case 3:
        fillChannelDropDown(typeSelected);
        break;
      case 4:
        fillChannelDropDown(typeSelected);
        break;
      case 5:
        fillChannelDropDown(typeSelected);
        break;
    }
  }

  function fillChannelDropDown(typeSelected) {
    modifierSelected = null;
    $('.dropdown-menu.scrollable-menu.keys').html("");
    if (typeSelected == 3) {
      $('#dropdownTypeName').html("MIDI NOTE:");
      $('#dropdownTypeComment').html("velocity is fixed and configurable.");
    } else {
      $('#dropdownTypeName').html("MIDI VALUE:");
      if (typeSelected == 4) {
        $('#dropdownTypeComment').html("will toggle controller between 0 to 127 values.");
      } else {
        $('#dropdownTypeComment').html("will send a program change message ");
      }
    }
    for (var data = 0; data < 128; data++) {
      $('.dropdown-menu.scrollable-menu.keys').append('<div class="dropdown-menu" aria-labelledby="btnGroupType">');
      if (typeSelected == 3) {
        $('.dropdown-menu.scrollable-menu.keys').append('<a class="dropdown-item"href="#" id=' + data + '>' + data + ' (' + noteToNoteName(data) + ')' + '</a>');
      } else {
        $('.dropdown-menu.scrollable-menu.keys').append('<a class="dropdown-item"href="#" id=' + data + '>' + data + '</a>');
      }
    }
    $('.dropdown-menu.scrollable-menu.keys a').click(function() {
      $('#selectedKey').text($(this).text());
      valueSelected = $(this).prop('id');
      updateChannelSelector();
      selectedValueText = $(this).text();
      updateSelectedConfig();
    });
    $('.dropdown-menu.scrollable-menu.channel a').click(function() {
      $('#selectedChannel').text($(this).text());
      let channelSelected = $(this).prop('id');
      modifierSelected = (Number(channelSelected) - 1);
      selectedModifierText = "Channel: " + channelSelected;
      updateSelectedConfig();
    });
    $('#modalKeyValue').collapse('show');
  }

  function fillKeyDropdown(keys) {
    $('#dropdownTypeName').html("KEY:");
    $('#dropdownTypeComment').html("will send a keyboard stroke ");
    $('.dropdown-menu.scrollable-menu.keys').html("");
    // $('.dropdown-menu.scrollable-menu.keys').append('<div class="dropdown-menu" aria-labelledby="btnGroupType">');
    const entries = Object.entries(keys);
    for (const [key, value] of entries) {
      $('.dropdown-menu.scrollable-menu.keys').append('<div class="dropdown-menu" aria-labelledby="btnGroupType">');
      $('.dropdown-menu.scrollable-menu.keys').append('<a class="dropdown-item"href="#" id=' + key + '>' + value + '</a>');
    }
    // $('.dropdown-menu.scrollable-menu.keys').append('</div>');
    $('.dropdown-menu.scrollable-menu.keys a').click(function() {
      $('#selectedKey').text($(this).text());
      valueSelected = $(this).prop('id');
      updateModifierSelector();
      selectedValueText = $(this).text();
      updateSelectedConfig();
    });
    $('#modalKeyValue').collapse('show');
  }

  function updateModifierSelector() {
    $('#modalModifierValue').collapse('show');
  }

  function updateChannelSelector() {
    $('#modalChannelValue').collapse('show');
  }

  function updateBtnTitle() {
    $('#presetSelected').html("PRESET " + presetSelected + " | BANK " + currentBankName);
  }

  function updatePresetCardTitle() {
    updateBtnTitle();
    if (presetSelected == 1 && currentBank == 0) {
      $('#overallPresetInfo').text("YouTube CONTROLLER CONFIG (preset is not editable)");
    } else {
      if (presetSelected == 2 && currentBank == 0) {
        $('#presetSelected').html("PRESET " + presetSelected + " SELECTED | BANK 1");
        let modeHUI = ""
        if (allConfigData[482] > 127) {
          modeHUI = "HUI CONTROLLER"
        } else {
          modeHUI = "UNIVERSAL CONTROLLER"
        }
        $('#overallPresetInfo').text("MACKIE " + modeHUI + " CONFIG (preset is not editable)");
      } else {
        if (currentBank == 0) {
          $('#overallPresetInfo').text("PRESET " + presetSelected + " BANK 1 CURRENT CONFIG");
        }
        if (currentBank == 240) {
          $('#overallPresetInfo').text("PRESET " + presetSelected + " BANK 2 CURRENT CONFIG");
        }
      }
    }
  }

  function showAllPresetData() {
    if (currentBank == 0 || currentBank == 240) {
      var step;
      for (let step = 1; step < 6; step++) {
        var eepromAddress = (presetSelected - 1) * 30 + ((step - 1) * 6) + 1 + currentBank;
        $('#btnType' + step).text(getType(eepromAddress));
        $('#btnValue' + step).text(getValue(eepromAddress));
        // console.log("BTN " + step +" BANK "+currentBank+ " is TYPE: " +getType(eepromAddress) +" EP. ADD:  "+eepromAddress+2);
      }
      // $('#btnType6').text(showConfigExternal());
    };
  };

  function showbtnInfo(btnNumber) {
    //(modo - 1) * 30 + ((btnNumber - 1) * 6) + 1 + bank
    console.log("PRESET: " + presetSelected);
    console.log("boton: " + btnNumber);
    console.log("Bank: " + currentBank);
    if (btnNumber <= 5) {
      var eepromAddress = (presetSelected - 1) * 30 + ((btnNumber - 1) * 6) + 1 + currentBank;
      console.log("EEPROM ADDRESS: " + eepromAddress);
      console.log("EEPROM DATA: " + allConfigData[eepromAddress]);
      showConfig(eepromAddress);
      $('#bankInfo').text("EDITING BANK " + currentBank + " BUTTON " + btnNumber);
    } else { //EXTERNAL BURON
      var eepromAddress = externalBtn;
      console.log("EEPROM ADDRESS: " + eepromAddress);
      console.log("EEPROM DATA: " + allConfigData[eepromAddress]);
      $('#bankInfo').text("EDITING BANK " + currentBank + " BUTTON EXTERNO");
    }
  };

  function showConfig(eepromAddress) {
    getType(eepromAddress);
  };
  var xtraBtnOptions = ["EXTRA BUTTON", "ALT + TAB", "MEDIA VOLUME", "MIDI VOL", "PRESET CHANGE", "MIDI PROG CHG", "MIDI SUSTAIN", "MIDI PITCH BEND", "CHANGE BANK", "METRONOME"];

  function showConfigExternal() {
    var modeExt = allConfigData[externalBtn];
    return xtraBtnOptions[modeExt];
  }

  function getModifierName(data) {
    switch (data) {
      case 0:
        return "N/A"
        break;
      case 1:
        return ""
        break;
      case 2:
        return ""
        break;
      case 3:
        return "CHANNEL"
        break;
      case 4:
        return "CHANNEL"
        break;
      case 5:
        return "CHANNEL"
        break;
    }
  }

  function getType(data) {
    // console.log("TYPE: " + data);
    switch (data) {
      case 1:
        return "KEY";
        break;
      case 2:
        return "MULTIMEDIA KEY";
        break;
      case 3:
        return "MIDI NOTE";
        break;
      case 4:
        return "MIDI CTR CHG";
        break;
      case 5:
        return "MIDI PRG CHG";
        break;
    }
  };

  function getValue(type, data) {
    // var type = allConfigData[eepromAddress + 2];
    switch (type) {
      case 1:
        // return getKeyboardValue(eepromAddress);
        return keys[data];
        break;
      case 2:
        // return "MULTIMEDIA KEYBOARD stroke";
        return mediaKeys[data];
        break;
      case 3:
        return data + ' (' + noteToNoteName(data) + ')';
        break;
      case 4:
        return data;
        break;
      case 5:
        return data;
        break;
    }
  }
  var mediaKeys = {
    "48": "CONSUMER POWER ",
    "50": "CONSUMER SLEEP ",
    "178": "MEDIA RECORD ",
    "179": "MEDIA FAST FORWARD ",
    "180": "MEDIA REWIND ",
    "181": "MEDIA NEXT ",
    "182": "MEDIA PREV ",
    "183": "MEDIA STOP ",
    "205": "MEDIA PLAY PAUSE ",
    "176": "MEDIA PAUSE ",
    "226": "MEDIA VOL MUTE ",
    "233": "MEDIA VOL UP ",
    "234": "MEDIA VOL DOWN "
  };
  var keys = {
    "4": "A",
    "5": "B",
    "6": "C",
    "7": "D",
    "8": "E",
    "9": "F",
    "10": "G",
    "11": "H",
    "12": "I",
    "13": "J",
    "14": "K",
    "15": "L",
    "16": "M",
    "17": "N",
    "18": "O",
    "19": "P",
    "20": "Q",
    "21": "R",
    "22": "S",
    "23": "T",
    "24": "U",
    "25": "V",
    "26": "W",
    "27": "X",
    "28": "Y",
    "29": "Z",
    "30": "1",
    "31": "2",
    "32": "3",
    "33": "4",
    "34": "5",
    "35": "6",
    "36": "7",
    "37": "8",
    "38": "9",
    "39": "0",
    "40": "ENTER",
    "40": "RETURN",
    "41": "ESC",
    "42": "BACKSPACE",
    "43": "TAB",
    "44": "SPACE",
    "45": "MINUS (-)",
    "46": "EQUAL (=)",
    "47": "LEFT BRACE ({)",
    "48": "RIGHT BRACE (})",
    "49": "BACKSLASH (\)",
    "50": "NON US NUM",
    "51": "SEMICOLON (;)",
    "52": 'QUOTE (")',
    "53": "TILDE (´)",
    "54": "COMMA (,)",
    "55": "PERIOD (.)",
    "56": "SLASH (/)",
    "57": "CAPS LOCK",
    "58": "F1",
    "59": "F2",
    "60": "F3",
    "61": "F4",
    "62": "F5",
    "63": "F6",
    "64": "F7",
    "65": "F8",
    "66": "F9",
    "67": "F10",
    "68": "F11",
    "69": "F12",
    "70": "PRINT",
    "70": "PRINTSCREEN",
    "71": "SCROLL LOCK",
    "72": "PAUSE",
    "73": "INSERT",
    "74": "HOME",
    "75": "PAGE UP",
    "76": "DELETE",
    "77": "END",
    "78": "PAGE DOWN",
    "79": "RIGHT ARROW",
    "80": "LEFT ARROW",
    "81": "DOWN ARROW",
    "82": "UP ARROW",
    "79": "RIGHT",
    "80": "LEFT",
    "81": "DOWN",
    "82": "UP",
    "83": "NUM LOCK",
    "84": "KEYPAD DIVIDE",
    "85": "KEYPAD MULTIPLY",
    "86": "KEYPAD SUBTRACT",
    "87": "KEYPAD ADD",
    "88": "KEYPAD ENTER",
    "89": "KEYPAD 1",
    "90": "KEYPAD 2",
    "91": "KEYPAD 3",
    "92": "KEYPAD 4",
    "93": "KEYPAD 5",
    "94": "KEYPAD 6",
    "95": "KEYPAD 7",
    "96": "KEYPAD 8",
    "97": "KEYPAD 9",
    "98": "KEYPAD 0",
    "99": "KEYPAD DOT",
    "101": "APPLICATION",
    "101": "MENU"
  }

  function getMediaKeyboardValue(eepromAddress) {
    var data = allConfigData[eepromAddress + 1];
    console.log(mediaKeys[data]);
    return mediaKeys[data];
  }

  function getKeyboardValue(eepromAddress) {
    var data = allConfigData[eepromAddress + 1];
    console.log(keys[data]);
    return keys[data];
  }
  if (!isMobile) {
    $('#midiLearnDiv').removeClass("invisible");
  } else {}

  function getModifierValue(type, bitData) {
    var text = "";
    if ((bitData & left_shift) == left_shift) { //checks bit is on
      text = "Left SHIFT";
    }
    if ((bitData & right_shift) == right_shift) { //checks bit is on
      if (text.length > 0) {
        text = text + " + Right SHIFT";
      } else {
        text = " Right SHIFT";
      }
    }
    if ((bitData & left_alt) == left_alt) { //checks bit is on
      if (text.length > 0) {
        text = text + " + Left ALT";
      } else {
        text = "Left ALT";
      }
    }
    if ((bitData & right_alt) == right_alt) { //checks bit is on
      if (text.length > 0) {
        text = text + " + Right ALT";
      } else {
        text = "Right ALT";
      }
    }
    if ((bitData & left_ctrl) == left_ctrl) { //checks bit is on
      if (text.length > 0) {
        text = text + " + Left CTRL";
      } else {
        text = "Left Ctrl";
      }
    }
    if ((bitData & right_ctrl) == right_ctrl) { //checks bit is on
      if (text.length > 0) {
        text = text + " + Right Ctrl";
      } else {
        text = "Right Ctrl";
      }
    }
    if ((bitData & left_gui) == left_gui) { //checks bit is on
      if (text.length > 0) {
        text = text + " + Left GUI";
      } else {
        text = "Left GUI";
      }
    }
    if ((bitData & right_gui) == right_gui) { //checks bit is on
      if (text.length > 0) {
        text = text + " + Right GUI";
      } else {
        text = "Right GUI";
      }
    }
    switch (type) {
      case 1:
        // return keyboard modifier;
        return text;
        break;
      case 2:
        // return "MULTIMEDIA KEYBOARD modifier";
        return text;
        break;
      case 3:
        return Number(bitData) + 1;
        break;
      case 4:
        return Number(bitData) + 1;
        break;
      case 5:
        return Number(bitData) + 1;
        break;
    }
  }

  function populateDashboard(preset, bank) { // NOTE: BANK EITHER 0 or 240
    var address = 0;
    var behave = 0;
    for (btnNumber = 1; btnNumber <= 5; btnNumber++) {
      address = ((preset - 1) * 30) + ((btnNumber - 1) * 6) + 1 + bank;
      behave = ((preset - 1) * 10) + ((btnNumber - 1) * 2) + 181 + bank
      if (compareData(address, behave, false)) { //false  means this button was edited for short
        $('.press' + btnNumber).show();
      }else{
        $('.press' + btnNumber).hide();
      }
      if (compareData(address, behave, true)) { //
        $('.hold' + btnNumber).show();
      }else {
        $('.hold' + btnNumber).hide();
      }
      var modifierPress = allConfigData[address];
      var valuePress = allConfigData[address + 1];
      var typePress = allConfigData[address + 2];
      var behaveShort = allConfigData[behave];
      var modTxtP = getModifierName(typePress) + '<span id ="btn' + btnNumber + 'PressModVal" class="badge dataType badge-pill">' + getModifierValue(typePress, modifierPress) + '</span>';
      var typeTxtP = getType(typePress);
      var modifierHold = allConfigData[address + 3];
      var valueHold = allConfigData[address + 4];
      var typeHold = allConfigData[address + 5];
      var behaveHold = allConfigData[behave + 1];
      var modTxtH = getModifierName(typeHold) + '<span id ="btn' + btnNumber + 'HoldModVal" class="badge dataType badge-pill">' + getModifierValue(typeHold, modifierHold) + '</span>';
      var typeTxtH = getType(typeHold);
      if (preset == 1 && bank == 0) { //YOUTUBE PRESET
        switch (btnNumber) {
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
          case 5:
            break;
        }
      } else {
        if ((typePress == 1 || typePress == 2) && modifierPress > 0) {
          // $('#btn' + btnNumber + 'PressModifier').html(modTxtP);
        } else {
          if (typePress > 2) {
            // $('#btn' + btnNumber + 'PressModifier').html(modTxtP);
          } else {
            modTxtP = "";
          }
          // $('#btn' + btnNumber + 'PressModifier').html('<p> </p>');
        }
        $('#btn' + btnNumber + 'PressModifier').html(modTxtP);
        switch (typePress) {
          case 1:
            $('#btn' + btnNumber + 'PressTypeVal').css({
              "background-color": "#8be0b9"
            });
            break;
          case 2:
            $('#btn' + btnNumber + 'PressTypeVal').css({
              "background-color": "#eac5a5"
            });
            break;
          case 3:
            $('#btn' + btnNumber + 'PressTypeVal').css({
              "background-color": "#d5aef3"
            });
            break;
          case 4:
            $('#btn' + btnNumber + 'PressTypeVal').css({
              "background-color": "#d5aef3"
            });
            break;
          case 5:
            $('#btn' + btnNumber + 'PressTypeVal').css({
              "background-color": "#d5aef3"
            });
            break;
        }
        $('#btn' + btnNumber + 'PressValue').html(typeTxtP + '<span id="btn' + btnNumber + 'PressValueVal" class="badge dataType badge-pill">P</span>');
        $('#btn' + btnNumber + 'PressTypeVal').text(typeTxtP);
        $('#btn' + btnNumber + 'PressValueVal').text(getValue(typePress, valuePress));
        if ((typeHold == 1 || typeHold == 2) && modifierHold > 0) {} else {
          if (typeHold > 2) {} else {
            modTxtH = "";
          }
        }
        $('#btn' + btnNumber + 'HoldModifier').html(modTxtH);
        switch (typeHold) {
          case 1: //KEYBOARD
            $('#btn' + btnNumber + 'HoldTypeVal').css({
              "background-color": "#8be0b9"
            });
            break;
          case 2: // MULTIMEDIA
            $('#btn' + btnNumber + 'HoldTypeVal').css({
              "background-color": "#eac5a5"
            });
            break;
          case 3: //MIDI NOTE
            $('#btn' + btnNumber + 'HoldTypeVal').css({
              "background-color": "#d5aef3"
            });
            break;
          case 4: //MIDI PROG
            $('#btn' + btnNumber + 'HoldTypeVal').css({
              "background-color": "#d5aef3"
            });
            break;
          case 5: //MIDI CC
            $('#btn' + btnNumber + 'HoldTypeVal').css({
              "background-color": "#d5aef3"
            });
            break;
        }
        $('#btn' + btnNumber + 'HoldValue').html(typeTxtP + ':<span id="btn' + btnNumber + 'HoldValueVal" class="badge dataType badge-pill">P</span>');
        $('#btn' + btnNumber + 'HoldTypeVal').text(typeTxtH);
        $('#btn' + btnNumber + 'HoldValueVal').text(getValue(typeHold, valueHold));
      }
      // $('#btn' + btnNumber + 'HoldValue').val("SABARA");
    }
    $('#allPresetsInfo').show();
    $('#buttonInfo').hide();
  }

  function showBtnConfig(buttonPressed) {
    $('#allPresetsInfo').hide();
    $('#buttonInfo').show();
    // specificButtonInfo
    $('[id^="showBtn"]').each(function() {
      $(this).removeClass("btn-dark")
    })
    $('[id^="showBtn"]').each(function() {
      $(this).addClass("btn-light")
    })
    $('.card-title.press').text('WHEN BUTTON ' + buttonPressed + ' IS PRESSED');
    $('.card-title.hold').text('WHEN BUTTON ' + buttonPressed + ' IS HOLD')
    $('#showBtn' + buttonPressed).removeClass("btn-light")
    $('#showBtn' + buttonPressed).addClass("btn-dark")
    $("#btnsCarousel").carousel(parseInt(buttonPressed, 10) - 1);
    $('#btnsCarousel').carousel('pause');
    address = ((presetSelected - 1) * 30) + ((buttonPressed - 1) * 6) + 1 + currentBank;
    behave = ((presetSelected - 1) * 10) + ((buttonPressed - 1) * 2) + 181 + currentBank
    console.log("gettin config for initial addres " + address);
    console.log("with initial behave address " + behave);
    modifierPress = allConfigData[address];
    valuePress = allConfigData[address + 1];
    typePress = allConfigData[address + 2];
    behaveShort = allConfigData[behave];
    modifierHold = allConfigData[address + 3];
    valueHold = allConfigData[address + 4];
    typeHold = allConfigData[address + 5];
    behaveHold = allConfigData[behave + 1];
    if (compareData(address, behave, false)) { //false  means this button was edited for short
      $('.card-title.press').html('WHEN BUTTON ' + buttonPressed + ' IS PRESSED -edited- <div class="spinner-grow text-danger"></div>');
    }
    if (compareData(address, behave, true)) { //true means this button was edited for hod
      $('.card-title.hold').html('WHEN BUTTON ' + buttonPressed + ' IS HOLD -edited- <div class="spinner-grow text-danger"></div>')
    }
    // $('.card-subtitle.typePress').text(getType(typePress));
    // $('.card-subtitle.typeHold').text(getType(typeHold));
    let typeP = getType(typePress) + ':     <span class="badge dataType badge-pill">' + getValue(typePress, valuePress) + '</span>';
    storedTypeTextP = getType(typePress);
    storedValueTextP = getValue(typePress, valuePress);
    $('.card-subtitle.valuePress').html(typeP);
    let typeH = getType(typeHold) + ':     <span class="badge dataType badge-pill">' + getValue(typeHold, valueHold) + '</span>';
    storedTypeTextH = getType(typeHold);
    storedValueTextH = getValue(typeHold, valueHold);
    $('.card-subtitle.valueHold').html(typeH);
    let modifier = getModifierName(typePress) + getModifierValue(typePress, modifierPress);
    storedModifierTextP = getModifierValue(typePress, modifierPress);

    let modifierH = getModifierName(typeHold) + getModifierValue(typeHold, modifierHold);
    storedModifierTextH = getModifierValue(typeHold, modifierHold);
    // if ((typeHold == 1 || typeHold == 2) && modifierHold > 0) {
    //   $('.card-subtitle.modifierHold').text(modifierH);
    // } else {
    //   $('.card-subtitle.modifierHold').html('<p> </p>');
    //   if (typeHold > 2) {
    //     $('.card-subtitle.modifierHold').text(modifierH);
    //   }
    // }
    $('.card-subtitle.configPress').html("Current config: <br>" + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + storedModifierTextP + ' </span>' + ' <span class="badge dataType badge-pill"> + </span>' + ' <span class="badge dataType badge-pill">' + storedValueTextP + ' </span>');
    $('.card-subtitle.configHold').html("Current config: <br>" + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + storedModifierTextH + ' </span>' + ' <span class="badge dataType badge-pill"> + </span>' + ' <span class="badge dataType badge-pill">' + storedValueTextH + ' </span>');



  } //END show button configuration
  function compareData(address, behave, isHold) { //returns true when different data
    if (isHold) {
      if (allConfigData[address + 3] != originalConfigData[address + 3] || allConfigData[address + 4] != originalConfigData[address + 4] || allConfigData[address + 5] != originalConfigData[address + 5] || allConfigData[behave + 1] != originalConfigData[behave + 1]) {
        return true;
      } else {
        return false;
      }
    } else {
      if (allConfigData[address] != originalConfigData[address] || allConfigData[address + 1] != originalConfigData[address + 1] || allConfigData[address + 2] != originalConfigData[address + 2] || allConfigData[behave] != originalConfigData[behave]) {
        return true;
      } else {
        return false;
      }
    }
  }
  var modifiedBtns = new Map();

  function applyEditBtnData() {
    let addr = ((presetSelected - 1) * 30) + ((buttonPressed - 1) * 6) + 1 + currentBank;
    let beh = ((presetSelected - 1) * 10) + ((buttonPressed - 1) * 2) + 181 + currentBank
    // alert("modifier byte: " + modifierSelected + " | value byte: " + valueSelected + " | type byte:" + typeSelected + " | hold Edit? " + editingHold + " | init address: " + addr + " | behave addres: " + beh);
    ;
    modifiedBtns.set("" + currentBank + "" + presetSelected + "" + buttonPressed, editingHold);
    if (editingHold) {
      addr = addr + 3;
      beh = beh + 1;
    }
    allConfigData[addr] = Number(modifierSelected);
    allConfigData[addr + 1] = Number(valueSelected);
    allConfigData[addr + 2] = Number(typeSelected);
    populateDashboard(presetSelected, currentBank);
    showBtnConfig(buttonPressed);
    $('#modalChannelValue').collapse('hide');
  }
}); // END DOCUMENT READY
function decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof(padding) === "undefined" || padding === null ? padding = 2 : padding;
  while (hex.length < padding) {
    hex = "0" + hex;
  }
  return hex;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function saveAllDataInfo() {
  // location.href = uri;
  uri = "data:application/octet-stream," + encodeURIComponent(allConfigData);
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); // Firefox requires the link to be in the body
    link.download = "allPresetsAndBanksConfig.info";
    link.href = uri;
    link.click();
    document.body.removeChild(link); // remove the link when done
  } else {
    location.replace(uri);
  }
}
window.onunload = function() { //APP DISCONNECT message cuando se cierra
  var msg1 = [0xBE, 0x1F, 0x7F]; //BE	1F	7F
  sendMessageToCtrlPie(msg1);
}
