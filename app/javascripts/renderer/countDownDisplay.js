var Timer = require('../lib/easytimer.min.js');
const $ = require('jquery')
const {remote} = require('electron')
const ipcR = require('electron').ipcRenderer;
require('electron-cookies')


var timer = new Timer();
var cookieValue = Number(document.cookie.replace(/(?:(?:^|.*;\s*)seconds\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
timer.start({countdown: true, startValues: {seconds: cookieValue}});
$('#chronoExample1 .values').html(timer.getTimeValues().toString());

var now = new Date(Date.now());

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

var formatted = formatAMPM(now);//now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

$('#timeDisplay').html(formatted);

ipcR.on('pause' , function(event , data){
  timer.pause()
 });

ipcR.on('resume' , function(event , data){
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
