var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
  isMobile = true;

} else {

}

if (navigator.requestMIDIAccess) {
  console.log('This browser supports WebMIDI!');

  if (document.querySelector('body')) {
    document.querySelector('body').innerHTML = 'MIDI DEVICES FOUND';
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
  let table = document.querySelector("table");

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
      showCtrlPieConnected();
      sendKeepAlive();
      $('#alertConnect').hide(4000);
      $('#btnAlertConnect').removeClass("invisible");
      $('#btnAlertConnect').removeClass("btn-warning");
      $('#btnAlertConnect').addClass("btn-info-sm");
      // $('#btnAlertConnect').addClass("btn-info");
      $('#btnAlertConnect').text("CONTROL PIE CONECTADO!");
      // $('#alertConnect').hide();

    } else {
      $('#btnAlertConnect').removeClass("invisible");
      // $('#btnAlertConnect').addClass("btn-warning");

      // no hay attach de eventos para otros outputs
      // $('#alertConnect').show();
    }
  }



}

function showCtrlPieConnected() {

  $("#lowPanel").removeClass("invisible");


}


function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}



function onMIDIFailure() {
  document.querySelector('.step0').innerHTML = 'Error: Could not access MIDI devices. Connect a device and refresh to try again.';
}

function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = (message.data.length > 2) ? message.data[2] : null; // a velocity value might not be included with a noteOff command


  switch (true) { //un switch especial!!!
    case ((command >= 144) && (command <= 159)): // noteOn
      if (velocity > 0) {
        noteOnListener(command & 0xf, note, velocity);
      } else {
        noteOffListener(note);
      }
      break;

    case ((command >= 128) && (command <= 143)):
      noteOffCallback(note);
      break;
    default:
      console.log(command + " " + note + " " + velocity);
      break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}

var connectionStep = 0;
var dataCount = 0;
var allConfigData = new Array(493);
var presetSelected;
var currentBank;
var externalBtn = 483;

function getCTRLPIEmsg(message) {
  var header = message.data[0];
  var leftHalf = message.data[1];
  var rightHalf = (message.data.length > 2) ? message.data[2] : 0; // a rightHalf value might not be included with a leftHalfOff command


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
      // console.log("data: "+dataCount + " " +header.toString(16) + " " + leftHalf.toString(16) + " " + rightHalf.toString(16));


      dataCount++;
      allConfigData[dataCount] = (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f)); //Stores read data
      console.log("data: " + pad(dataCount, 3) + " " + decimalToHex(header, 2) + " " + decimalToHex(leftHalf, 2) + " " + decimalToHex(rightHalf, 2) +
        " dec value: " + (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f)));


      if (dataCount == 493) {
        console.log("all data received ok");
        dataCount = 0;
        setRadioWithCurrentPreset(rightHalf);

        connectionStep++; // Handle timeout or any possible error.
      }
      break;
    case 3: //connected to Ctrol PIE
      // dataCount++;
      // console.log("data: " + pad(dataCount, 3) + " " + decimalToHex(header, 2) + " " + decimalToHex(leftHalf, 2) + " " + decimalToHex(rightHalf, 2) +        " dec value: " + (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f)));
      break;

  }



  if (header == 187 && rightHalf == 0) {
    var tx = "Boton " + leftHalf + " apretado momentaneamente.";
    document.querySelector('#btnRead').innerHTML = tx;
    console.log(tx);
  }
  if (header == 187 && rightHalf == 1) {
    var tx = "Boton " + leftHalf + " pulsado largo.";
    document.querySelector('#btnRead').innerHTML = tx;
    console.log(tx);
  }



  // if(command==187 && rightHalf == 2){
  // 	var tx = "Boton "+leftHalf+" soltado.";
  // 	document.querySelector('#btnRead').innerHTML = tx;
  // 	console.log(tx);
  // }


}


function noteOffCallback(note) {
  // alert("not off"+note);

}

function noteOnListener(channel, note, velocity) {
  $('#channel').html("Channel: " + channel);
  $('#notePressed').html("Note Pressed: " + note);
  $('#noteVelocity').html("Velocity: " + velocity);
}

function noteOffListener(note) {
  // document.querySelector('#noteReleased').innerHTML = note;
}

var CtrlPieIsConnected = false;

function sendInitMsg() {
  var msg1 = [0xBE, 0x1A, 0x70]; // BE	1A	70
  console.log("Connect request..." + msg1);
  output.send(msg1);
  connectionStep = 1;
}

function sendKeepAlive() {
  var msg1 = [0xB7, 0x70, 0x7F]; // note on, middle C, full velocity

  if (output) {
    output.send(msg1, );
    console.log("keep alive...");
  }
  setTimeout(sendKeepAlive, 5000);

}

function setRadioWithCurrentPreset(value) {
  console.log(value);
  presetSelected = value;
  $('input[id="option' + value + '"]').parent().addClass('active');
};

$(document).ready(function() { // ESTO PREVIENE QUE SE EJECUTEN ESTOS JQUERY ANTES DE QUE CARGUE LA PAGINA

  $('#btnAlertConnect').click(function() {
    if (isConnected) {
      alert("already connected");
    } else {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }

  });

  $("#getConfig").click(function() {
    var msg1 = [0xBE, 0x1D, 0x70]; //BE	1D	70
    output.send(msg1);
  });

  $("#getActivePreset").click(function() {
    var msg1 = [0xBE, 0x1D, 0x70]; //BE	1D	70
    output.send(msg1);
  });

  $("#restoreToFactory").click(function() {
    var msg1 = [0xBE, 0x0F, 0x70]; //BE	0F	70
    output.send(msg1);
    $("#modalbody").text("Default values restored.");
    $("#restoreToFactory").addClass("disabled")
    $("#restoreToFactory").prop('disabled', true);
    // alert("Control Pie restored to factory default values");
  });

  $("#restoreBtn").click(function() {
    console.log("sdsd");
    $("#restoreToFactory").removeClass("disabled")
    $("#restoreToFactory").prop('disabled', false);
  });

  function updatePresetBtn(preset) {
    $('#btnGroupDrop1').text("Preset " + preset);
    $('#btnGroupDrop1').removeClass("btn-dark");
    $('#btnGroupDrop1').addClass("btn-success");
    $('#btnBank1').prop('disabled', false);
    $('#btnBank2').prop('disabled', false);
  }

  $("[id^=preset]").click(function() {
    presetSelected = (($(this).prop('id')).slice(-1));
    // $('#btnBank1').removeClass("btn-success");
    // $('#btnBank2').removeClass("btn-success");
    // $('#btnBank1').addClass("btn-dark");
    // $('#btnBank2').addClass("btn-dark");
    // $('#editBtns').prop('disabled', true);
    //
    // $('#collapsePresets').removeClass("collapse show")
    // $('#collapsePresets').addClass("collapse")

    var msg1 = [0xBF, 0x1C, presetSelected]; //BF	1C	06
    output.send(msg1);
    updatePresetBtn(presetSelected);
    showAllPresetData();
    console.log(presetSelected);
  });


  $('#btnBank1').click(function() {

    $('#btnBank1').removeClass("btn-dark");
    $('#btnBank1').addClass("btn-success");
    $('#btnBank2').addClass("btn-dark");
    $('#btnBank2').removeClass("btn-success");
    $('#editBtns').prop('disabled', false);
    $('#bankInfo').text("EDITING BANK 1");
    currentBank = 0; // para bank 1
    showAllPresetData();
    //BF	1C	07 para bank 1
    //BF	1C	08 para bank 1
    var msg1 = [0xBF, 0x1C, 6 + 1]; //BF	1C	07 para bank 1
    output.send(msg1);
  });

  $('#btnBank2').click(function() {
    $('#btnBank2').removeClass("btn-dark");
    $('#btnBank2').addClass("btn-success");
    $('#btnBank1').addClass("btn-dark");
    $('#btnBank1').removeClass("btn-success");
    $('#bankInfo').text("EDITING BANK 2");
    $('#editBtns').prop('disabled', false);
    currentBank = 240; //240 para bank 2
    showAllPresetData();
    //BF	1C	07 para bank 1
    //BF	1C	08 para bank 1
    var msg1 = [0xBF, 0x1C, 6 + 2]; //BF	1C	08 para bank 2
    output.send(msg1);
  });

  function showAllPresetData() {
    if (currentBank == 0 || currentBank == 240) {
      var step;
      for (let step = 1; step < 6; step++) {
        var eepromAddress = (presetSelected - 1) * 30 + ((step - 1) * 6) + 1 + currentBank;
$('#btnType'+step).text(getType(eepromAddress));
$('#btnValue'+step).text(getValue(eepromAddress));

        // console.log("BTN " + step +" BANK "+currentBank+ " is TYPE: " +getType(eepromAddress) +" EP. ADD:  "+eepromAddress+2);
      }
      $('#btnType6').text(showConfigExternal());


    };
  };

  $("[id^=btnInfo]").click(function() {

    showbtnInfo(($(this).prop('id')).slice(-1));
    // alert(($(this).prop('id')).slice(-1));
    // allConfigData[]

  });


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

var xtraBtnOptions =  ["EXTRA BUTTON", "ALT + TAB", "MEDIA VOLUME", "MIDI VOL", "PRESET CHANGE", "MIDI PROG CHG", "MIDI SUSTAIN", "MIDI PITCH BEND", "CHANGE BANK", "METRONOME"];

  function showConfigExternal(){
    var modeExt = allConfigData[externalBtn];

    return xtraBtnOptions[modeExt];
  }

  function getType(eepromAddress) { //con un eepromaddress inicial te devuele el type (+2)
    var data = allConfigData[eepromAddress + 2];
    console.log("TYPE: " + data);
    switch (data) {
      case 1:
        return "KEYBOARD";
        break;
      case 2:
        return "MULTIMEDIA KB";
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

  function getValue(eepromAddress){
    var type = allConfigData[eepromAddress + 2];
    switch (type) {
      case 1:
        return getKeyboardValue(eepromAddress);

        break;
      case 2:
        // return "MULTIMEDIA KEYBOARD stroke";
        return "Hard coded MM"
        break;
      case 3:
        return "MIDI NOTE"
        break;
      case 4:
        // return "MIDI CONTROL CHANGE type";
        break;
      case 5:
        // return "MIDI PROGRAM CHANGE type";
        break;

    }
  }
var keys = {"4":"KEY A","5":"KEY B","6":"KEY C","7":"KEY D","8":"KEY E","9":"KEY F","10":"KEY G","11":"KEY H","12":"KEY I","13":"KEY J","14":"KEY K","15":"KEY L","16":"KEY M","17":"KEY N","18":"KEY O","19":"KEY P","20":"KEY Q","21":"KEY R","22":"KEY S","23":"KEY T","24":"KEY U","25":"KEY V","26":"KEY W","27":"KEY X","28":"KEY Y","29":"KEY Z","30":"KEY 1","31":"KEY 2","32":"KEY 3","33":"KEY 4","34":"KEY 5","35":"KEY 6","36":"KEY 7","37":"KEY 8","38":"KEY 9","39":"KEY 0","40":"KEY ENTER","40":"KEY RETURN","41":"KEY ESC","42":"KEY BACKSPACE","43":"KEY TAB","44":"KEY SPACE","45":"KEY MINUS","46":"KEY EQUAL","47":"KEY LEFT BRACE","48":"KEY RIGHT BRACE","49":"KEY BACKSLASH","50":"KEY NON US NUM","51":"KEY SEMICOLON","52":"KEY QUOTE","53":"KEY TILDE","54":"KEY COMMA","55":"KEY PERIOD","56":"KEY SLASH","57":"KEY CAPS LOCK","58":"KEY F1","59":"KEY F2","60":"KEY F3","61":"KEY F4","62":"KEY F5","63":"KEY F6","64":"KEY F7","65":"KEY F8","66":"KEY F9","67":"KEY F10","68":"KEY F11","69":"KEY F12","70":"KEY PRINT","70":"KEY PRINTSCREEN","71":"KEY SCROLL LOCK","72":"KEY PAUSE","73":"KEY INSERT","74":"KEY HOME","75":"KEY PAGE UP","76":"KEY DELETE","77":"KEY END","78":"KEY PAGE DOWN","79":"KEY RIGHT ARROW","80":"KEY LEFT ARROW","81":"KEY DOWN ARROW","82":"KEY UP ARROW","79":"KEY RIGHT","80":"KEY LEFT","81":"KEY DOWN","82":"KEY UP","83":"KEY NUM LOCK","84":"KEYPAD DIVIDE","85":"KEYPAD MULTIPLY","86":"KEYPAD SUBTRACT","87":"KEYPAD ADD","88":"KEYPAD ENTER","89":"KEYPAD 1","90":"KEYPAD 2","91":"KEYPAD 3","92":"KEYPAD 4","93":"KEYPAD 5","94":"KEYPAD 6","95":"KEYPAD 7","96":"KEYPAD 8","97":"KEYPAD 9","98":"KEYPAD 0","99":"KEYPAD DOT","100":"KEY NON US","101":"KEY APPLICATION","101":"KEY MENU"}
  function getKeyboardValue(eepromAddress){
    var data = allConfigData[eepromAddress + 1];
    console.log(keys[data]);
    return keys[data];
  }

  if (!isMobile) {
    // $('#midiLearnDiv').removeClass("invisible");
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



window.onunload = function() { //APP DISCONNECT message cuando se cierra
  var msg1 = [0xBE, 0x1F, 0x7F]; //BE	1F	7F
  output.send(msg1);
}
