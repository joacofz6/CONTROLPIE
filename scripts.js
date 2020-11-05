var presetSelected = -1;
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

function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : null;
    // a velocity value might not be included with a noteOff command
    console.log(command + " " + note + " " + velocity);
    switch (true) {
        //un switch especial!!!
    case ((command >= 144) && (command <= 159)):
        // noteOn
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

var timer = setTimeout(hideOverlay, 3000);

function hideOverlay() {
    $('#btnPressed').css({
        "opacity": "0"
    });
}

function noteOffCallback(note) {// alert("not off"+note);
}

function noteOnListener(channel, note, velocity) {// $('#channel').html("Channel: " + channel);
// $('#notePressed').html("Note Pressed: " + note);
// $('#noteVelocity').html("Velocity: " + velocity);
}

function noteOffListener(note) {// document.querySelector('#noteReleased').innerHTML = note;
}
// var CtrlPieIsConnected = false;
function sendInitMsg() {
    var msg1 = [0xBE, 0x1A, 0x70];
    // BE	1A	70
    console.log("Connect request..." + msg1);
    sendMessageToCtrlPie(msg1);
    connectionStep = 1;
}

function sendKeepAlive() {
    var msg1 = [0xB7, 0x70, 0x7F];
    // note on, middle C, full velocity
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
}
;function noteToNoteName(note) {
    note -= 21;
    // see the explanation below.
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

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
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
        document.body.appendChild(link);
        // Firefox requires the link to be in the body
        link.download = "allPresetsAndBanksConfig.info";
        link.href = uri;
        link.click();
        document.body.removeChild(link);
        // remove the link when done
    } else {
        location.replace(uri);
    }
}

function showConfigExternal() {
    var modeExt = allConfigData[externalBtn];
    return xtraBtnOptions[modeExt];
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
    if ((bitData & left_shift) == left_shift) {
        //checks bit is on
        text = "Left SHIFT";
    }
    if ((bitData & right_shift) == right_shift) {
        //checks bit is on
        if (text.length > 0) {
            text = text + " + Right SHIFT";
        } else {
            text = " Right SHIFT";
        }
    }
    if ((bitData & left_alt) == left_alt) {
        //checks bit is on
        if (text.length > 0) {
            text = text + " + Left ALT";
        } else {
            text = "Left ALT";
        }
    }
    if ((bitData & right_alt) == right_alt) {
        //checks bit is on
        if (text.length > 0) {
            text = text + " + Right ALT";
        } else {
            text = "Right ALT";
        }
    }
    if ((bitData & left_ctrl) == left_ctrl) {
        //checks bit is on
        if (text.length > 0) {
            text = text + " + Left CTRL";
        } else {
            text = "Left Ctrl";
        }
    }
    if ((bitData & right_ctrl) == right_ctrl) {
        //checks bit is on
        if (text.length > 0) {
            text = text + " + Right Ctrl";
        } else {
            text = "Right Ctrl";
        }
    }
    if ((bitData & left_gui) == left_gui) {
        //checks bit is on
        if (text.length > 0) {
            text = text + " + Left GUI";
        } else {
            text = "Left GUI";
        }
    }
    if ((bitData & right_gui) == right_gui) {
        //checks bit is on
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
function getType(typeOfPress) {
    // console.log("TYPE: " + data);
    switch (typeOfPress) {
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
}
;function compareData(address, behave, isHold) {
    //returns true when different data
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

function udpateCurrentBtnTitle() {
    $('#specificButtonInfo').text("BUTTON " + buttonPressed + " CURRENT SETUP");
}
function gerAddressAndBehave() {
    address = ((presetSelected - 1) * 30) + ((buttonPressed - 1) * 6) + 1 + currentBank;
    behave = ((presetSelected - 1) * 10) + ((buttonPressed - 1) * 2) + 181 + currentBank
    modifierPress = allConfigData[address];
    valuePress = allConfigData[address + 1];
    typePress = allConfigData[address + 2];
    behaveShort = allConfigData[behave];
    modifierHold = allConfigData[address + 3];
    valueHold = allConfigData[address + 4];
    typeHold = allConfigData[address + 5];
    behaveHold = allConfigData[behave + 1];
}
function showBtnConfig() {
    $('#allPresetsInfo').hide();
    $('#buttonInfo').show();
    // specificButtonInfo
    $('[id^="showBtn"]').each(function() {
        $(this).removeClass("btn-dark")
    })
    $('[id^="showBtn"]').each(function() {
        $(this).addClass("btn-light")
    })
    udpateCurrentBtnTitle();
    $('.card-title.press').html('Button <span class="text-info">' + buttonPressed + ' short </span>press');
    $('.card-title.hold').html('Button <span class="text-info">' + buttonPressed + ' long </span>press')

    $('#showBtn' + buttonPressed).removeClass("btn-light")
    $('#showBtn' + buttonPressed).addClass("btn-dark")
    $("#btnsCarousel").carousel(parseInt(buttonPressed, 10) - 1);
    $('#btnsCarousel').carousel('pause');
    gerAddressAndBehave();
    console.log("gettin config for initial addres " + address);
    console.log("with initial behave address " + behave);

    if (compareData(address, behave, false)) {
        //false  means this button was edited for short
        $('.card-title.press').html('WHEN BUTTON ' + buttonPressed + ' IS PRESSED -edited- <div class="spinner-grow text-danger"></div>');
    }
    if (compareData(address, behave, true)) {
        //true means this button was edited for hod
        $('.card-title.hold').html('WHEN BUTTON ' + buttonPressed + ' IS HOLD -edited- <div class="spinner-grow text-danger"></div>')
    }
    // $('.card-subtitle.typePress').text(getType(typePress));
    // $('.card-subtitle.typeHold').text(getType(typeHold));
    let typeP = getType(typePress) + ':     <span class="badge dataType badge-pill">' + getValue(typePress, valuePress) + '</span>';
    storedTypeTextP = getType(typePress);
    storedValueTextP = getValue(typePress, valuePress);
    storedTypeTextH = getType(typeHold);
    storedValueTextH = getValue(typeHold, valueHold);
    storedModifierTextP = getModifierValue(typePress, modifierPress);
    storedModifierTextH = getModifierValue(typeHold, modifierHold);

    $('.card-subtitle.valuePress').html(typeP);
    let typeH = getType(typeHold) + ':     <span class="badge dataType badge-pill">' + getValue(typeHold, valueHold) + '</span>';
    $('.card-subtitle.valueHold').html(typeH);
    let modifier = getModifierName(typePress) + getModifierValue(typePress, modifierPress);

    let modifierH = getModifierName(typeHold) + getModifierValue(typeHold, modifierHold);
    // if ((typeHold == 1 || typeHold == 2) && modifierHold > 0) {
    //   $('.card-subtitle.modifierHold').text(modifierH);
    // } else {
    //   $('.card-subtitle.modifierHold').html('<p> </p>');
    //   if (typeHold > 2) {
    //     $('.card-subtitle.modifierHold').text(modifierH);
    //   }
    // }
    generateBtnInfo("Current config: <br>", typePress, typeHold, '.card-subtitle.configPress', '.card-subtitle.configHold');

}
//END show button configuration

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
    } else {
        //EXTERNAL BURON
        var eepromAddress = externalBtn;
        console.log("EEPROM ADDRESS: " + eepromAddress);
        console.log("EEPROM DATA: " + allConfigData[eepromAddress]);
        $('#bankInfo').text("EDITING BANK " + currentBank + " BUTTON EXTERNO");
    }
}
;function showConfig(eepromAddress) {
    getType(eepromAddress);
}
;var xtraBtnOptions = ["EXTRA BUTTON", "ALT + TAB", "MEDIA VOLUME", "MIDI VOL", "PRESET CHANGE", "MIDI PROG CHG", "MIDI SUSTAIN", "MIDI PITCH BEND", "CHANGE BANK", "METRONOME"];

function populateDashboard(preset, bank) {
    // NOTE: BANK EITHER 0 or 240
    var address = 0;
    var behave = 0;
    var changesMade = false;
    for (btnNumber = 1; btnNumber <= 5; btnNumber++) {
        address = ((preset - 1) * 30) + ((btnNumber - 1) * 6) + 1 + bank;
        behave = ((preset - 1) * 10) + ((btnNumber - 1) * 2) + 181 + bank
        if (compareData(address, behave, false)) {
            //false  means this button was edited for short
            $('.press' + btnNumber).show();
            changesMade = true;
        } else {
            $('.press' + btnNumber).hide();
        }
        if (compareData(address, behave, true)) {
            //
            $('.hold' + btnNumber).show();
            changesMade = true;
        } else {
            $('.hold' + btnNumber).hide();
        }
        if (changesMade) {
            $('#btnBurnData').prop('disabled', false);
            $('#btnBurnData').show();
            $('#btnDiscardData').prop('disabled', false);
            $('#btnDiscardData').show();
        } else {
            $('#btnBurnData').prop('disabled', true);
            $('#btnDiscardData').prop('disabled', true);
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
        if (preset == 1 && bank == 0) {
            //YOUTUBE PRESET
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
            // } else {
            //
            //
            //   if ((typePress == 1 || typePress == 2) && modifierPress > 0) {
            //     // $('#btn' + btnNumber + 'PressModifier').html(modTxtP);
            //   } else {
            //     if (typePress > 2) {
            //       // $('#btn' + btnNumber + 'PressModifier').html(modTxtP);
            //     } else {
            //       modTxtP = "";
            //     }
            //     // $('#btn' + btnNumber + 'PressModifier').html('<p> </p>');
            //   }
            //   $('#btn' + btnNumber + 'PressModifier').html(modTxtP);
            //   switch (typePress) {
            //     case 1:
            //       $('#btn' + btnNumber + 'PressTypeVal').css({
            //         "background-color": "#8be0b9"
            //       });
            //       break;
            //     case 2:
            //       $('#btn' + btnNumber + 'PressTypeVal').css({
            //         "background-color": "#eac5a5"
            //       });
            //       break;
            //     case 3:
            //       $('#btn' + btnNumber + 'PressTypeVal').css({
            //         "background-color": "#d5aef3"
            //       });
            //       break;
            //     case 4:
            //       $('#btn' + btnNumber + 'PressTypeVal').css({
            //         "background-color": "#d5aef3"
            //       });
            //       break;
            //     case 5:
            //       $('#btn' + btnNumber + 'PressTypeVal').css({
            //         "background-color": "#d5aef3"
            //       });
            //       break;
            //   }
            //   $('#btn' + btnNumber + 'PressValue').html(typeTxtP + '<span id="btn' + btnNumber + 'PressValueVal" class="badge dataType badge-pill">P</span>');
            //   $('#btn' + btnNumber + 'PressTypeVal').text(typeTxtP);
            //   $('#btn' + btnNumber + 'PressValueVal').text(getValue(typePress, valuePress));
            //   if ((typeHold == 1 || typeHold == 2) && modifierHold > 0) {} else {
            //     if (typeHold > 2) {} else {
            //       modTxtH = "";
            //     }
            //   }
            //   $('#btn' + btnNumber + 'HoldModifier').html(modTxtH);
            //   switch (typeHold) {
            //     case 1: //KEYBOARD
            //       $('#btn' + btnNumber + 'HoldTypeVal').css({
            //         "background-color": "#8be0b9"
            //       });
            //       break;
            //     case 2: // MULTIMEDIA
            //       $('#btn' + btnNumber + 'HoldTypeVal').css({
            //         "background-color": "#eac5a5"
            //       });
            //       break;
            //     case 3: //MIDI NOTE
            //       $('#btn' + btnNumber + 'HoldTypeVal').css({
            //         "background-color": "#d5aef3"
            //       });
            //       break;
            //     case 4: //MIDI PROG
            //       $('#btn' + btnNumber + 'HoldTypeVal').css({
            //         "background-color": "#d5aef3"
            //       });
            //       break;
            //     case 5: //MIDI CC
            //       $('#btn' + btnNumber + 'HoldTypeVal').css({
            //         "background-color": "#d5aef3"
            //       });
            //       break;
            //   }
            //   $('#btn' + btnNumber + 'HoldValue').html(typeTxtP + ':<span id="btn' + btnNumber + 'HoldValueVal" class="badge dataType badge-pill">P</span>');
            //   $('#btn' + btnNumber + 'HoldTypeVal').text(typeTxtH);
            //   $('#btn' + btnNumber + 'HoldValueVal').text(getValue(typeHold, valueHold));
        }
        storedTypeTextP = getType(typePress);
        storedValueTextP = getValue(typePress, valuePress);
        storedTypeTextH = getType(typeHold);
        storedValueTextH = getValue(typeHold, valueHold);
        storedModifierTextP = getModifierValue(typePress, modifierPress);
        storedModifierTextH = getModifierValue(typeHold, modifierHold);
        generateBtnInfo("CONFIG: <br>", typePress, typeHold, '#btn' + btnNumber + 'PressType', '#btn' + btnNumber + 'HoldType');

    }
    //END OF FOR - EACH iteration of buttons
    $('#allPresetsInfo').show();
    $('#buttonInfo').hide();
}

function generateBtnInfo(prefix, typePress, typeHold, containerPress, containerHold) {
    if (typePress >= 3) {
        $(containerPress).html(prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + storedValueTextP + '</span>' + ' - ' + ' <span class="badge dataType badge-pill">' + "Channel: " + storedModifierTextP + ' </span>');
    } else {
        if (storedModifierTextP != "") {
            $(containerPress).html(prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + storedModifierTextP + '</span>' + ' + ' + ' <span class="badge dataType badge-pill">' + storedValueTextP + ' </span>');
        } else {
            $(containerPress).html(prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType badge-pill">' + storedValueTextP + ' </span>');
        }
    }
    if (typeHold >= 3) {
        $(containerHold).html(prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + storedValueTextH + '</span>' + '  - ' + ' <span class="badge dataType badge-pill">' + "Channel: " + storedModifierTextH + ' </span>');
    } else {
        if (storedModifierTextH != "") {
            $(containerHold).html(prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + storedModifierTextH + '</span>' + ' + ' + ' <span class="badge dataType badge-pill">' + storedValueTextH + ' </span>');
        } else {
            $(containerHold).html(prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType badge-pill">' + storedValueTextH + ' </span>');
        }
    }
}

function toastrBtnInfo(prefix, typePress, typeHold) {
    if (typePress != null) {
        if (typePress >= 3) {
            toastr['info'](prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedValueTextP + '</span>' + ' - ' + ' <span class="badge dataType text-dark">' + "Channel: " + storedModifierTextP + ' </span>');
        } else {
            if (storedModifierTextP != "") {
                toastr['info'](prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedModifierTextP + '</span>' + ' + ' + ' <span class="badge dataType text-dark">' + storedValueTextP + ' </span>');
            } else {
                toastr['info'](prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType text-dark">' + storedValueTextP + ' </span>');
            }
        }
    }

    if (typeHold != null) {
        if (typeHold >= 3) {
            toastr['warning'](prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedValueTextH + '</span>' + '  - ' + ' <span class="badge dataType text-dark">' + "Channel: " + storedModifierTextH + ' </span>');
        } else {
            if (storedModifierTextH != "") {
                toastr['warning'](prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedModifierTextH + '</span>' + ' + ' + ' <span class="badge dataType text-dark">' + storedValueTextH + ' </span>');
            } else {
                toastr['warning'](prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType text-dark">' + storedValueTextH + ' </span>');
            }
        }

    }

}

function buildBtnTextHTML(prefix, typePress, typeHold) {
  if (typePress != null) {
      if (typePress >= 3) {
        return (prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedValueTextP + '</span>' + ' - ' + ' <span class="badge dataType text-dark">' + "Channel: " + storedModifierTextP + ' </span>');
    } else {
        if (storedModifierTextP != "") {
            return (prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedModifierTextP + '</span>' + ' + ' + ' <span class="badge dataType text-dark">' + storedValueTextP + ' </span>');
        } else {
            return (prefix + '<span class="typeType text-dark badge">' + storedTypeTextP + ':</span> ' + ' <span class="badge dataType text-dark">' + storedValueTextP + ' </span>');
        }
    }
  }
    if (typeHold != null) {
        if (typeHold >= 3) {
        return (prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedValueTextH + '</span>' + '  - ' + ' <span class="badge dataType text-dark">' + "Channel: " + storedModifierTextH + ' </span>');
    } else {
        if (storedModifierTextH != "") {
            return (prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType text-dark"> ' + storedModifierTextH + '</span>' + ' + ' + ' <span class="badge dataType text-dark">' + storedValueTextH + ' </span>');
        } else {
            return (prefix + '<span class="typeType text-dark badge">' + storedTypeTextH + ':</span> ' + ' <span class="badge dataType text-dark">' + storedValueTextH + ' </span>');
        }
    }
  }

}

var modifiedBtns = new Map();

function applyEditBtnData() {
    let addr = ((presetSelected - 1) * 30) + ((buttonPressed - 1) * 6) + 1 + currentBank;
    let beh = ((presetSelected - 1) * 10) + ((buttonPressed - 1) * 2) + 181 + currentBank // alert("modifier byte: " + modifierSelected + " | value byte: " + valueSelected + " | type byte:" + typeSelected + " | hold Edit? " + editingHold + " | init address: " + addr + " | behave addres: " + beh);
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
    showBtnConfig();
    $('#modalChannelValue').collapse('hide');
}
function fillKeyDropdown(keys) {
    $('#modalModifierValue').collapse('show');
    $('#dropdownTypeName').html("KEY:");
    if (typeSelected == 1) {
    $('#dropdownTypeComment').html('will send a keyboard stroke </br> <i class="fa fa-keyboard-o fa-3x text-dark" aria-hidden="true"></i>');
    }else{
      $('#dropdownTypeComment').html('will send multimedia special keys  </br> <i class="fa fa-keyboard-o fa-2x text-dark" aria-hidden="true"></i><i class="fa fa-play-circle fa-2x text-dark" aria-hidden="true"></i>');
    }
    $('.dropdown-menu.scrollable-menu.keys').html("");
    // $('.dropdown-menu.scrollable-menu.keys').append('<div class="dropdown-menu" aria-labelledby="btnGroupType">');
    const entries = Object.entries(keys);
    for (const [key,value] of entries) {
        $('.dropdown-menu.scrollable-menu.keys').append('<div class="dropdown-menu" aria-labelledby="btnGroupType">');
        $('.dropdown-menu.scrollable-menu.keys').append('<a class="dropdown-item"href="#" id=' + key + '>' + value + '</a>');
    }
    // $('.dropdown-menu.scrollable-menu.keys').append('</div>');

    $('.dropdown-menu.scrollable-menu.keys a').click(function() {
        $('#selectedKey').text($(this).text());
        valueSelected = $(this).prop('id');
        //       updateModifierSelector();
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
    }
    ;
}
;function resetSelectedConfig(fullReset) {
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
        $('#selectedConfig').html('<span class="typeType text-dark badge">' + selectedTypeText + ':</span> <span><i class="fa fa-check-circle fa-2x icon-confirm edit" ></i></span>');
    }
    if (selectedValueText != "") {
        $('#selectedConfig').html('<span class="typeType text-dark badge">' + selectedTypeText + ':</span> ' + '<span class="badge dataType badge-pill">' + selectedValueText + ' </span> <span><i class="fa fa-check-circle fa-2x icon-confirm edit" ></i></span>');
    }
    if (selectedModifierText != "") {
        $('#selectedConfig').html('<span class="typeType text-dark badge">' + selectedTypeText + ':</span> ' + ' <span class="badge dataType badge-pill"> ' + selectedModifierText + ' </span>' + ' <span class="badge dataType badge-pill"> + </span>' + ' <span class="badge dataType badge-pill">' + selectedValueText + ' </span> <span><i class="fa fa-check-circle fa-2x icon-confirm edit" ></i></span>');
    }
    let addr = ((presetSelected - 1) * 30) + ((buttonPressed - 1) * 6) + 1 + currentBank;
    let beh = ((presetSelected - 1) * 10) + ((buttonPressed - 1) * 2) + 181 + currentBank
    console.log("modifier byte: " + modifierSelected + " | value byte: " + valueSelected + " | type byte:" + typeSelected + " | hold Edit? " + editingHold + " | init address: " + addr + " | behave addres: " + beh);
    validateSelectedConfig();
}

function validateSelectedConfig() {
    if (typeSelected != null && valueSelected != null && modifierSelected != null) {
        $('.fa-check-circle.edit').show();
        // $('.modal-body.selectedConfig').addClass('bg-success');
        // $('.modal-body.selectedConfig').removeClass('bg-dark');
        $('#applyEditBtn').prop('disabled', false);
    } else {
        $('.fa-check-circle.edit').hide();
        $('.modal-body.selectedConfig').removeClass('bg-success');
        $('.modal-body.selectedConfig').addClass('bg-dark');
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
        // $('#dropdownTypeComment').html("velocity is fixed and configurable.");
        $('#dropdownTypeComment').html('will send MIDI </br> <i class="fa fa-music fa-3x text-dark" aria-hidden="true"></i>');
    } else {
        $('#dropdownTypeName').html("MIDI VALUE:");
        if (typeSelected == 4) {
            // $('#dropdownTypeComment').html("will toggle controller between 0 to 127 values.");
            $('#dropdownTypeComment').html('will toggle CONTROL messages (0 and 127)  </br> <i class="fa fa-music fa-2x text-dark" aria-hidden="true"> </i><i class="fa fa-cogs fa-2x text-dark" aria-hidden="true"></i>');
        } else {
            // $('#dropdownTypeComment').html("will send a program change message ");
            $('#dropdownTypeComment').html('will send a program change message  </br> <i class="fa fa-music fa-2x text-dark" aria-hidden="true"></i> </i><i class="fa fa-cogs fa-2x text-dark" aria-hidden="true"></i>');
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
function updatePresetBtn(preset) {
  toastr.remove()
  $('.btn-bank').removeClass('invisible')
   $("[id^=preset]").removeClass('btn-circle-selected')
  // $("[id^=preset]").addClass('btn-circle-not-selected')
  // $("[id^=preset"+preset+"]").removeClass('btn-circle-not-selected')
  $("[id^=preset"+preset+"]").addClass('btn-circle-selected')
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
window.onunload = function() {
    //APP DISCONNECT message cuando se cierra
    var msg1 = [0xBE, 0x1F, 0x7F];
    //BE	1F	7F
    sendMessageToCtrlPie(msg1);
}
