const {remote} = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
const {Menu} = remote;
require('electron-cookies')
var Timer = require('../lib/easytimer.min.js');
//const $ = require('jquery')

// const template = [
//   {
//     label: 'Obika',
//     submenu: [
//       {
//         label: 'Learn More',
//         click: function () {
//           ipcRenderer.send('toggle-prefs')
//         }
//       }
//     ]
//   }
// ]
//
// const menu = Menu.buildFromTemplate(template)
//
// Menu.setApplicationMenu(menu)

const $ = require('jquery')

var timer = new Timer();

ipcRenderer.send('invokeAction');

ipcRenderer.once('actionReply', function(event, data){
  getDisplayList(data.msg);
})

function getDisplayList(response) {
  var sel = document.getElementById('noofDisplays');
  for(var i = 0; i < response; i++) {
      var opt = document.createElement('option');
      let a = i + 1;
      opt.innerHTML = "Display " + a;
      opt.value = i;
      sel.appendChild(opt);
  }
}

$('#chronoExample .startButton').click(function () {
    //timer.start();
    let a = $("#noofDisplays").val()
    let hrs = $("#hrs").val()
    let mins = $("#mins").val()
    let secs = $("#secs").val()

    console.log("start button clicked");

    let totalsecs = (hrs * 3600) + (mins * 60) + (secs * 1);

    ipcRenderer.send('start-prefs', {display:a, hours:hrs, minutes:mins, seconds:secs});
    $('#chronoExample .pauseButton').prop('disabled', false);
    $('#chronoExample .stopButton').prop('disabled', false);
    $('#chronoExample .startButton').prop('disabled', true);

    document.cookie = "seconds="+totalsecs;
});

$('#chronoExample .pauseButton').click(function () {
    //timer.pause();
    ipcRenderer.send('pause-prefs')
    $('#chronoExample .pauseButton').addClass('hide');
    $('#chronoExample .resumeButton').removeClass('hide');
});

$('#chronoExample .resumeButton').click(function () {
    //timer.pause();
    ipcRenderer.send('resume-prefs')
    $('#chronoExample .resumeButton').addClass('hide');
    $('#chronoExample .pauseButton').removeClass('hide');
});

$('#chronoExample .stopButton').click(function () {
    //timer.stop();
    ipcRenderer.send('close-prefs')

    $('#chronoExample .resumeButton').addClass('hide');
    $('#chronoExample .pauseButton').removeClass('hide');

    $('#chronoExample .pauseButton').prop('disabled', true);
    $('#chronoExample .stopButton').prop('disabled', true);
    $('#chronoExample .startButton').prop('disabled', false);

});

$('#chronoExample .exitButton').click(function () {
    //timer.stop();
    ipcRenderer.send('exit-prefs')
});




var cookieValue = Number(document.cookie.replace(/(?:(?:^|.*;\s*)seconds\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
timer.start({countdown: true, startValues: {seconds: cookieValue}});
$('#chronoExample1 .values').html(timer.getTimeValues().toString());

var now = new Date(Date.now());
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

$('#timeDisplay').html(formatted);

ipcRenderer.on('pause' , function(event , data){
  timer.pause()
 });

ipcRenderer.on('resume' , function(event , data){
 timer.start()
});

timer.addEventListener('secondsUpdated', function (e) {
    $('#chronoExample1 .values').html(timer.getTimeValues().toString());
});

timer.addEventListener('targetAchieved', function (e) {
    $('#chronoExample1 .values').html('Time UP!!');
});

timer.addEventListener('started', function (e) {
    $('#chronoExample1 .values').html(timer.getTimeValues().toString());
});


// require('electron').ipcRenderer.on('loaded' , function(event, data) {
//   document.getElementById('title').innerHTML = data.appName + ' App';
//   document.getElementById('details').innerHTML = 'built with Electron v' + data.electronVersion;
//   document.getElementById('versions').innerHTML = 'running on Node v' + data.nodeVersion + ' and Chromium v' + data.chromiumVersion;
// });
