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
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

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
