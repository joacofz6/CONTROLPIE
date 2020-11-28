var isMobile = false;
//initiate as false
// device detection
/*
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
  isMobile = true;
}

else {}
*/

var midi = null;
var output = null;
var isConnected = false;

var connectionStep = 0;
var dataCount = 0;
var allConfigData = new Array(493);
var originalConfigData = new Array(493);
var demoData = [1, 54, 1, 1, 19, 1, 0, 13, 1, 0, 13, 1, 0, 14, 1, 0, 9, 1, 0, 15, 1, 0, 15, 1, 1, 55, 1, 1, 17, 1, 0, 86, 3, 0, 84, 3, 0, 88, 3, 0, 91, 3, 0, 94, 3, 0, 93, 3, 0, 90, 3, 0, 92, 3, 0, 95, 3, 0, 95, 3, 0, 226, 2, 0, 234, 2, 0, 180, 2, 0, 182, 2, 0, 205, 2, 0, 183, 2, 0, 179, 2, 0, 181, 2, 0, 233, 2, 0, 233, 2, 16, 15, 1, 16, 31, 1, 0, 82, 1, 0, 80, 1, 0, 205, 2, 0, 183, 2, 0, 44, 1, 0, 81, 1, 0, 226, 2, 0, 74, 1, 16, 29, 1, 17, 29, 1, 0, 88, 3, 0, 91, 3, 0, 94, 3, 0, 93, 3, 0, 90, 3, 0, 92, 3, 0, 95, 3, 0, 6, 1, 4, 43, 1, 64, 30, 1, 0, 41, 1, 64, 31, 1, 0, 40, 1, 64, 32, 1, 0, 44, 1, 64, 33, 1, 0, 58, 1, 64, 34, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 127, 1, 127, 0, 127, 2, 127, 0, 48, 3, 0, 49, 3, 0, 50, 3, 0, 51, 3, 0, 52, 3, 0, 53, 3, 0, 54, 3, 0, 55, 3, 0, 56, 3, 0, 57, 3, 0, 58, 3, 0, 59, 3, 0, 60, 3, 0, 61, 3, 0, 62, 3, 0, 63, 3, 0, 64, 3, 0, 65, 3, 0, 66, 3, 0, 67, 3, 0, 68, 3, 0, 69, 3, 0, 70, 3, 0, 71, 3, 0, 72, 3, 0, 73, 3, 0, 74, 3, 0, 75, 3, 0, 76, 3, 0, 77, 3, 0, 78, 3, 0, 79, 3, 0, 80, 3, 0, 81, 3, 0, 82, 3, 0, 83, 3, 0, 84, 3, 0, 85, 3, 0, 86, 3, 0, 87, 3, 0, 88, 3, 0, 89, 3, 0, 90, 3, 0, 91, 3, 0, 92, 3, 0, 93, 3, 0, 94, 3, 0, 95, 3, 0, 96, 3, 0, 97, 3, 0, 98, 3, 0, 99, 3, 0, 100, 3, 0, 101, 3, 0, 102, 3, 0, 103, 3, 0, 104, 3, 0, 105, 3, 0, 106, 3, 0, 107, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 9, 0, 205, 2, 0, 183, 2, 0, 255, 0, 193];

var left_shift = 0b00000001;
// hex for 0000 0001 1
var right_shift = 0b00000010;
// hex for 0000 0010 2
var left_alt = 0b00000100;
// hex for 0000 0100 4
var right_alt = 0b00001000;
// hex for 0000 1000 8
var left_ctrl = 0b00010000;
// hex for 0001 0000 16
var right_ctrl = 0b00100000;
// hex for 0010 0000 32
var left_gui = 0b01000000;
// hex for 0100 0000 64
var right_gui = 0b10000000;
// hex for 0100 0000 128

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

var keyCodes = {
    "65|0": "4",
    "66|0": "5",
    "67|0": "6",
    "68|0": "7",
    "69|0": "8",
    "70|0": "9",
    "71|0": "10",
    "72|0": "11",
    "73|0": "12",
    "74|0": "13",
    "75|0": "14",
    "76|0": "15",
    "77|0": "16",
    "78|0": "17",
    "79|0": "18",
    "80|0": "19",
    "81|0": "20",
    "82|0": "21",
    "83|0": "22",
    "84|0": "23",
    "85|0": "24",
    "86|0": "25",
    "87|0": "26",
    "88|0": "27",
    "89|0": "28",
    "90|0": "29",
    "49|0": "30",
    "50|0": "31",
    "51|0": "32",
    "52|0": "33",
    "53|0": "34",
    "54|0": "35",
    "55|0": "36",
    "56|0": "37",
    "57|0": "38",
    "48|0": "39",
    "13|0": "40",
    "13|3": "40",
    "27|0": "41",
    "8|0": "42",
    "9|0": "43",
    "32|0": "44",
    "219|0": "45",
    "221|0": "46",
    "186|0": "47",
    "187|0": "48",
    "191|0": "49",
    "144|0": "50",
    "192|0": "51",
    "222|0": "53",
    "188|0": "54",
    "190|0": "55",
    "189|0": "56",
    "20|0": "57",
    "112|0": "58",
    "113|0": "59",
    "114|0": "60",
    "115|0": "61",
    "116|0": "62",
    "117|0": "63",
    "118|0": "64",
    "119|0": "65",
    "120|0": "66",
    "121|0": "67",
    "122|0": "68",
    "123|0": "69",
    "145|0": "71",
    "19|0": "72",
    "45|0": "73",
    "36|0": "74",
    "33|0": "75",
    "46|0": "76",
    "36|0": "77",
    "34|0": "78",
    "39|0": "79",
    "37|0": "80",
    "40|0": "81",
    "38|0": "82",
    "39|0": "79",
    "37|0": "80",
    "40|0": "81",
    "38|0": "82",
    "144|0": "83",
    "111|3": "84",
    "106|3": "85",
    "109|3": "86",
    "107|3": "87",
    "13|3": "88",
    "97|3": "89",
    "98|3": "90",
    "99|3": "91",
    "100|3": "92",
    "101|3": "93",
    "102|3": "94",
    "103|3": "95",
    "104|3": "96",
    "105|3": "97",
    "96|3": "98",
    "110|3": "99",
    "91|1": "101"

}

var mediaKeyCodes = {
    "48|0": "48",
    "50|0": "50",
    "178|": "178",
    "179|": "179",
    "180|": "180",
    "176|0": "181",
    "177|0": "182",
    "178|0": "183",
    "179|0": "205",
    "176|": "176",
    "173|0": "226",
    "175|0": "233",
    "174|0": "234"

}

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
            input.onmidimessage = getCTRLPIEmsg;
            // attach de un listener distinto para el dispositivo control pie
        } else {
            input.onmidimessage = getMIDIMessage;
            //attach de un litener generico de mensajes midi (util para hacer midi LEARN)
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
        } else {// $('#btnAlertConnect').removeClass("invisible");
        // $('#btnAlertConnect').addClass("btn-warning");
        // no hay attach de eventos para otros outputs
        // $('#alertConnect').show();
        }
    }
}

function showCtrlPieConnected() {
    $('#alertConnect').hide();
    $(".lowPanel").removeClass("invisible");
    $('#infoAlertConnect').show();
    $('#infoSelPreset').collapse('show');
}

function onMIDIFailure() {
    document.querySelector('.step0').innerHTML = 'Error: Could not access MIDI devices. Connect a device and refresh to try again.';
}

function getCTRLPIEmsg(message) {
    var header = message.data[0];
    var leftHalf = message.data[1];
    var rightHalf = (message.data.length > 2) ? message.data[2] : 0;
    // a rightHalf value might not be included with a leftHalfOff command
    var decValue = (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f));
    switch (connectionStep) {
    case 0:
        //CTRL pie is connecting
        //ignores incomming messages in this stage
        console.log("ignoring..." + header.toString(16) + " " + leftHalf.toString(16) + " " + rightHalf.toString(16));
        break;
    case 1:
        // waiting for response token
        console.log("handshaking... " + header.toString(16) + " " + leftHalf.toString(16) + " " + rightHalf.toString(16));
        if (header == 0xBC && leftHalf == 0x1A && rightHalf == 0x70) {
            var msg2 = [0xBC, 0x1A, 0x7F];
            // leftHalf on, middle C, full rightHalf
            console.log(msg2);
            output.send(msg2, window.performance.now() + 500.0);
            connectionStep++;
        }
        break;
    case 2:
        //receiving inital data config
        dataCount++;
        allConfigData[dataCount] = (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f));
        //Stores read data
        originalConfigData[dataCount] = (((leftHalf & 0x0f) << 4) | (rightHalf & 0x0f));
        //Stores a backup of read data
        console.log("data: " + pad(dataCount, 3) + " " + decimalToHex(header, 2) + " " + decimalToHex(leftHalf, 2) + " " + decimalToHex(rightHalf, 2) + " dec value: " + decValue);
        if (dataCount == 493) {
            console.log("all data received ok");
            dataCount = 0;
            setRadioWithCurrentPreset(rightHalf);
            connectionStep++;
            // Handle timeout or any possible error.
        }
        break;
    case 3:
        // NOTE: PROCESSING SERIAL NUMBER BYTES
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
    case 4:
        //connected to Ctrol PIE
        console.log("data: " + pad(dataCount, 3) + " " + decimalToHex(header, 2) + " " + decimalToHex(leftHalf, 2) + " " + decimalToHex(rightHalf, 2) + " dec value: " + decValue);
        if (header == 187 && rightHalf == 0) {
            buttonPressed = leftHalf;

            window.clearTimeout(timer);
            timer = window.setTimeout(hideOverlay, 3000);
            console.log(tx);
            showBtnConfig();
            var tx = buildBtnTextHTML('Button: <span class="text-warning">' + buttonPressed + ' SHORT</span> press <br>', typePress, null);
            $("#btnPressed").html(tx)
            $("#btnPressed").removeClass("btnHold");
            $("#btnPressed").addClass("btnPress");
            $("#btnPressed").css({
                "opacity": "1"
            });
            if (currentBank >= 0 && presetSelected > 0) {
                toastr.remove()
                toastrBtnInfo('Button: <span class="text-warning">' + buttonPressed + ' SHORT</span> press <br>', typePress, null);
            }

        }
        if (header == 187 && rightHalf == 1) {
            buttonPressed = leftHalf;

            window.clearTimeout(timer);
            timer = window.setTimeout(hideOverlay, 3000);
            console.log(tx);
            showBtnConfig();
            var tx = buildBtnTextHTML('Button: <span class="text-dark">' + buttonPressed + ' LONG</span> press <br>', null, typeHold);
            $("#btnPressed").html(tx);
            $("#btnPressed").removeClass("btnPress");
            $("#btnPressed").addClass("btnHold");
            $("#btnPressed").css({
                "opacity": "1"
            });
            if (currentBank >= 0 && presetSelected > 0) {
                toastr.remove()
                toastrBtnInfo('Button: <span class="text-dark">' + buttonPressed + ' LONG</span> press <br>', null, typeHold);
            }
        }
        //BE 0F 7F
        if (header == 190 && leftHalf == 15 && rightHalf == 127) {
            //CONFIRMATION OF FACTORY RESTORE
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
    case 5:
        //DEMO
        break;
    }
}

function bindButtons() {

    $(".modal").on("shown.bs.modal", function () {
    if ($(".modal-backdrop").length > 1) {
        $(".modal-backdrop").not(':first').remove();
    }
    })
    $('[id^="showBtn"]').click(function() {

        resetSelectedConfig(true);
        buttonPressed = (($(this).prop('id')).slice(-1));
        $('#specificButtonInfo').text("BUTTON " + buttonPressed + " CURRENT SETUP");
        $('#specificButtonInfo').addClass("bg-info");
        $('#specificButtonInfo').removeClass("bg-warning");
        showBtnConfig();
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
//         $('#collapsePresets').hide(100)
        $('#lowPanel').fadeOut(50)
        $('.starting-title').text("Preset:");
        presetSelected = (($(this).prop('id')).slice(-1));
        var msg1 = [0xBF, 0x1C, presetSelected];
        //BF	1C	06
        sendMessageToCtrlPie(msg1);
        updatePresetBtn(presetSelected);
        updatePresetCardTitle()
        showAllPresetData();
        console.log(presetSelected);
//         $('#collapsePresets').show(100,function (e){showContent()})
    $('#lowPanel').fadeIn(423)
    });

    $('#btnBank1').click(function() {
        if($('#collapsePresets').is(":visible")){
            
            $('#collapsePresets').fadeOut(100,function (e){
//                 hideContent()
                ;})            
        }

//         hideContent()
         
        $('#btnBank1').removeClass("btn-dark");
        $('#btnBank1').addClass("btn-info");
        $('#btnBank2').addClass("btn-dark");
        $('#btnBank2').removeClass("btn-info");
        $('#bankInfo').text("EDITING BANK 1");
        currentBank = 0;
        // para bank 1
        currentBankName = "1";
        $("#imgPresetsTop").attr("src", "leds-presets-" + presetSelected + ".png");
        populateDashboard(presetSelected, currentBank);
//         $('#collapsePresets').addClass("show");
//         $('#infoSelPreset').collapse('hide');
        showAllPresetData();
        updatePresetCardTitle();
        //BF	1C	07 para bank 1
        //BF	1C	08 para bank 1
        var msg1 = [0xBF, 0x1C, 6 + 1];
        //BF	1C	07 para bank 1
        sendMessageToCtrlPie(msg1);
//         $('#collapsePresets').fadeIn(356)
        $('#collapsePresets').fadeIn(100,function (e){showContent()})

       
    });


    $('#btnBank2').click(function() {
        if($('#collapsePresets').is(":visible")){
           $('#collapsePresets').fadeOut(100,function (e){
//                hideContent();
               })                 

        }
//         $('#collapsePresets').fadeOut(100)
//         hideContent()
//         $('#collapsePresets').hide()
        $('#btnBank2').removeClass("btn-dark");
        $('#btnBank2').addClass("btn-info");
        $('#btnBank1').addClass("btn-dark");
        $('#btnBank1').removeClass("btn-info");
        $('#bankInfo').text("EDITING BANK 2");
        currentBank = 240;
        //240 para bank 2
        currentBankName = "2";
        $("#imgPresetsTop").attr("src", "leds-presets-" + presetSelected + "b2.png");
        populateDashboard(presetSelected, currentBank);
//         $('#collapsePresets').addClass("show");
        showAllPresetData();
        updatePresetCardTitle();
        //BF	1C	07 para bank 1
        //BF	1C	08 para bank 1
        var msg1 = [0xBF, 0x1C, 6 + 2];
        //BF	1C	08 para bank 2
        sendMessageToCtrlPie(msg1);
        $('#collapsePresets').fadeIn(356,function (e){showContent();})
    });

    $('#leftShift').click(function() {
        setModifiers()
    });
    $('#rightShift').click(function() {
        setModifiers()
    });
    $('#leftAlt').click(function() {
        setModifiers()
    });
    $('#rightAlt').click(function() {
        setModifiers()
    });
    $('#leftControl').click(function() {
        setModifiers()
    });
    $('#rightControl').click(function() {
        setModifiers()
    });
    $('#leftGui').click(function() {
        setModifiers()
    });
    $('#rightGui').click(function() {
        setModifiers()
    });
    $('#editPress').click(function() {
        //boolean indicates type of button (pulse or hold)
        editingHold = false;
        updateCurrentConfig(editingHold);
        $('#btnConfigTitle').html('Action for Button: <span class="text-danger">' + buttonPressed + '</span> | PRESET <span class="text-danger">' + presetSelected + '</span> | BANK <span class="text-danger">' + currentBank + '</span>  (when pushed shortly)');
        $('#editHeading').removeClass('bg-hold');
        $('#editHeading').addClass('bg-press');
        $('#editHeading').removeClass('text-dark');
        $('#editHeading').addClass('text-light');

    });
    $('#editHold').click(function() {
        editingHold = true;
        updateCurrentConfig(editingHold);
        $('#btnConfigTitle').html('Action for Button: <span class="text-danger">' + buttonPressed + '</span> | PRESET <span class="text-danger">' + presetSelected + '</span> | BANK <span class="text-danger">' + currentBank + '</span>  (when push and hold)');
        $('#editHeading').removeClass('bg-press');
        $('#editHeading').addClass('bg-hold');
        $('#editHeading').removeClass('text-light');
        $('#editHeading').addClass('text-dark');

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
        // $('#btnGroupType').removeClass("btn-warning");
        // $('#btnGroupType').addClass("btn-success");
        // $('#modalModifierValue').collapse('hide');
        // $('#modalChannelValue').collapse('hide');
        console.log('type selected: ' + typeSelected);
        updateSelectedConfig();
    });

    $('#applyEditBtn').click(function() {
//         $('#editBtnModal').modal('hide');
//         if ($('.modal-backdrop').is(':visible')) {
//           $('body').removeClass('modal-open');
//           $('.modal-backdrop').remove();
//         };
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
        udpateCurrentBtnTitle();
        showBtnConfig();
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
        var msg1 = [0xBE, 0x1D, 0x70];
        //BE	1D	70
        sendMessageToCtrlPie(msg1);
    });
    $("#getActivePreset").click(function() {
        var msg1 = [0xBE, 0x1D, 0x70];
        //BE	1D	70
        sendMessageToCtrlPie(msg1);
    });
    $("#restoreToFactory").click(function() {
        var msg1 = [0xBE, 0x0F, 0x70];
        //BE	0F	70
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

}
function hideContent(){
    
    $('.presetBtnActions').fadeOut();
    $('.infoCard').fadeOut();
    
}
function showContent(){
    let timer = 1123
    $('.presetBtnActions').fadeIn(timer,function (e){
        
            $('.infoCard').fadeIn(timer);
        
    });
    
    
    
}

function setModifiers() {
    if ($('#leftShift').is(':checked')) {
        modifierSelected = modifierSelected | left_shift;
    } else {
        if (modifierSelected & left_shift) {
            modifierSelected = modifierSelected ^ left_shift;
        }

    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
    if ($('#rightShift').is(':checked')) {
        modifierSelected = modifierSelected | right_shift;
    } else {
        if (modifierSelected & right_shift) {
            modifierSelected = modifierSelected ^ right_shift;
        }

    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
    if ($('#leftAlt').is(':checked')) {
        modifierSelected = modifierSelected | left_alt;
    } else {
        if (modifierSelected & left_alt) {
            modifierSelected = modifierSelected ^ left_alt;
        }

    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
    if ($('#rightAlt').is(':checked')) {
        modifierSelected = modifierSelected | right_alt;
    } else {
        if (modifierSelected & right_alt) {
            modifierSelected = modifierSelected ^ right_alt;
        }
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
    if ($('#leftControl').is(':checked')) {
        modifierSelected = modifierSelected | left_ctrl;
    } else {
        if (modifierSelected & left_ctrl) {
            modifierSelected = modifierSelected ^ left_ctrl;
        }
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
    if ($('#rightControl').is(':checked')) {
        modifierSelected = modifierSelected | right_ctrl;
    } else {
        if (modifierSelected & right_ctrl) {
            modifierSelected = modifierSelected ^ right_ctrl;
        }
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
    if ($('#leftGui').is(':checked')) {
        modifierSelected = modifierSelected | left_gui;
    } else {
        if (modifierSelected & left_gui) {
            modifierSelected = modifierSelected ^ left_gui;
        }
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();
    if ($('#rightGui').is(':checked')) {
        modifierSelected = modifierSelected | right_gui;
    } else {
        if (modifierSelected & right_gui) {
            modifierSelected = modifierSelected ^ right_gui;
        }
    }
    console.log(modifierSelected);
    selectedModifierText = getModifierValue(1, modifierSelected);
    updateSelectedConfig();

}

var keyIsPressed=false;
var ShiftLeft = false;
var ControlLeft= false;
var AltLeft= false;
var MetaLeft= false;
var ShiftRight= false;
var ControlRight= false;
var AltRight= false;
var MetaRight= false;

function handleKeyUp(){
    $("body").keyup(function(e) {
        keyIsPressed=false;
        if (e.originalEvent.code == 'ShiftLeft') {
            ShiftLeft=false;
        }
        if (e.originalEvent.code == 'ControlLeft') {
            ControlLeft=false;
        }
        if (e.originalEvent.code == 'AltLeft') {
            AltLeft=false;
        }
        if (e.originalEvent.code == 'MetaLeft') {
            MetaLeft=false;
        }
        if (e.originalEvent.code == 'ShiftRight') {
            ShiftRight=false;
        }
        if (e.originalEvent.code == 'ControlRight') {
            ControlRight=false;
        }
        if (e.originalEvent.code == 'AltRight') {
            AltRight=false;
        }
        if (e.originalEvent.code == 'MetaRight') {
            MetaRight=false;
        }

    });

}
function handleKeyPress(){
    $("body").keydown(function(e) {
        let keyCode = e.originalEvent.keyCode;

        if ($('#editBtnModal').hasClass('show')) {
            if(keyCode>= 173 && keyCode<=180){
                if(typeSelected != 2){
                    $('#type2').click();
                }

            }else if(keyCode!=16&&keyCode!=17&&keyCode!=18&&keyCode!=91&&keyCode!=93&&keyCode!=92){
                if(typeSelected != 1){
                    $('#type1').click();
                }
            }

            if ((typeSelected == 1 || typeSelected == 2)) {
                if (e.originalEvent.code == 'ShiftLeft' && !ShiftLeft) {
                    ShiftLeft = true;
                    if ($('#leftShift').is(":checked")) {
                        $('#leftShift').prop("checked", false)
                    } else {
                        $('#leftShift').prop("checked", true)
                    }
                }
                if (e.originalEvent.code == 'ControlLeft' && !ControlLeft) {
                    ControlLeft = true;
                    if ($('#leftControl').is(":checked")) {
                        $('#leftControl').prop("checked", false)
                    } else {
                        $('#leftControl').prop("checked", true)
                    }
                }
                if (e.originalEvent.code == 'AltLeft' && !AltLeft) {
                    AltLeft = true;
                    if ($('#leftAlt').is(":checked")) {
                        $('#leftAlt').prop("checked", false)
                    } else {
                        $('#leftAlt').prop("checked", true)
                    }
                }
                if (e.originalEvent.code == 'MetaLeft' && !MetaLeft) {
                    MetaLeft = true;
                    if ($('#leftGui').is(":checked")) {
                        $('#leftGui').prop("checked", false)
                    } else {
                        $('#leftGui').prop("checked", true)
                    }
                }

                if (e.originalEvent.code == 'ShiftRight' && !ShiftRight) {
                    ShiftRight = true;
                    if ($('#rightShift').is(":checked")) {
                        $('#rightShift').prop("checked", false)
                    } else {
                        $('#rightShift').prop("checked", true)
                    }
                }
                if (e.originalEvent.code == 'ControlRight' && !ControlRight) {
                    ControlRight = true;
                    if ($('#rightControl').is(":checked")) {
                        $('#rightControl').prop("checked", false)
                    } else {
                        $('#rightControl').prop("checked", true)
                    }
                }
                if (e.originalEvent.code == 'AltRight' && !AltRight) {
                    AltRight = true;
                    if ($('#rightAlt').is(":checked")) {
                        $('#rightAlt').prop("checked", false)
                    } else {
                        $('#rightAlt').prop("checked", true)
                    }
                }
                if (e.originalEvent.code == 'MetaRight' && !MetaRight) {
                    MetaRight = true;
                    if ($('#rightGui').is(":checked")) {
                        $('#rightGui').prop("checked", false)
                    } else {
                        $('#rightGui').prop("checked", true)
                    }
                }

                setModifiers()
                e.preventDefault();

                e.stopPropagation();
                //             return false;

                if (typeSelected == 1) {
                    let idSelector = keyCodes[e.originalEvent.keyCode + '|' + e.originalEvent.location];
                    $('#' + idSelector).click();
                }
                if (typeSelected == 2) {
                    let idSelector = mediaKeyCodes[e.originalEvent.keyCode + '|' + e.originalEvent.location];
                    $('#' + idSelector).click();
                }

                console.log("location: " + e.originalEvent.location);
                console.log("keycode: " + e.originalEvent.keyCode);
                console.log("keydown: " + e.originalEvent.code);
                console.log()
            }
        }
    keyIsPressed = true;
    });
}

$(document).ready(function() {
    // ESTO PREVIENE QUE SE EJECUTEN ESTOS JQUERY ANTES DE QUE CARGUE LA PAGINA

    if (navigator.requestMIDIAccess) {
        console.log('This browser supports WebMIDI!');
        if (document.querySelector('body')) {// document.querySelector('body').innerHTML = 'MIDI DEVICES FOUND';
        }
        // navigator.requestMIDIAccess({ sysex: true } ).then(onMIDISuccess, onMIDIFailure);
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        console.log('WebMIDI is not supported in this browser.');
        document.querySelector('body').innerHTML = 'Error: This browser does not support WebMIDI.';
    }

    // $("body").keydown(function(e){
    //       console.log("location: " +e.originalEvent.location);
    //         console.log("keydown: " +e.originalEvent.keyCode);
    //         console.log("keydown: " +e.originalEvent.code);
    //     });

    handleKeyPress();
    handleKeyUp();

    bindButtons();
//     $('#lowPanel').hide()

    toastr.options = {
        positionClass: "toast-top-right",
        autoDismiss: false,
        maxOpened: 2,
        newestOnTop: true,
        timeOut: 0

    }

});
// END DOCUMENT READY
