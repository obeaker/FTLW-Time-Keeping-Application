const {remote} = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
const {Menu} = remote;
require('electron-cookies')
const $ = require('jquery');
require('../lib/jquery-ui.min.js');
require('../lib/angular.min.js');
require('../lib/angular-route.min.js');

// require('../lib/angular-messages.min.js');
// require('../lib/angular-material.min.js');

var Timer = require('../lib/easytimer.min.js');
var timer = new Timer();
var cookieValue = Number(document.cookie.replace(/(?:(?:^|.*;\s*)seconds\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
var displaymsg = document.cookie.replace(/(?:(?:^|.*;\s*)msg\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var type = document.cookie.replace(/(?:(?:^|.*;\s*)type\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var newYR = document.cookie.replace(/(?:(?:^|.*;\s*)newYR\s*\=\s*([^;]*).*$)|^.*$/, "$1");

// create the module and name it ftlwApp
var ftlwApp = angular.module('ftlwApp', ['ngRoute']);

// configure our routes
ftlwApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : './pages/home.html',
			controller  : 'mainController',
			activetab: 'home'
		})
		.when('/home', {
			templateUrl : './pages/home.html',
			controller  : 'mainController',
			activetab: 'home'
		})
		.when('/countdown', {
			templateUrl : './pages/countdown.html',
			controller  : 'countdownController',
			activetab: 'countdown'
		})
		.when('/countup', {
			templateUrl : './pages/countup.html',
			controller  : 'countupController',
			activetab: 'countup'
		})
		.when('/newyear', {
			templateUrl : './pages/newyear.html',
			controller  : 'newyearController',
			activetab: 'newyear'
		});
});

// create the controller and inject Angular's $scope
ftlwApp.controller('mainController', function($scope, $route) {
	$scope.$route = $route;
	//$scope.message = 'Welcome to Fountain of the Living Word Church Timer. <br> Select '+
	//'a timer from the left side';
});

ftlwApp.controller('countdownController', function($scope, $route) {
	$scope.$route = $route;
  ipcRenderer.send('invokeAction');

  ipcRenderer.once('actionReply', function(event, data){
    getDisplayList(data.msg);
  })

	ipcRenderer.send('isDisplayVisible');

  ipcRenderer.once('displayVisible', function(event, data){
    checkDisplay(data.msg);
  })

  $('#chronoExample .startButton').click(function () {
      //timer.start();
      let a = $("#noofDisplays").val()
      let hrs = $("#hrs").val()
      let mins = $("#mins").val()
      let secs = $("#secs").val()
      let msgs = $("#displayMsg").val()
			let useTimer = "loadedCTDW"
			let pageLoad = "1";

      console.log("start button clicked");

      let totalsecs = (hrs * 3600) + (mins * 60) + (secs * 1);

      ipcRenderer.send('start-prefs', {display:a, setTimer:useTimer, loadPage:pageLoad});
      showDisplay ();

			document.cookie = "type=countdown";
      document.cookie = "seconds="+totalsecs;
      document.cookie = "msg="+msgs;
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

      closeDisplay();

  });

  $('#chronoExample .exitButton').click(function () {
      //timer.stop();
      ipcRenderer.send('exit-prefs')
  });
});

ftlwApp.controller('countupController', function($scope, $route) {
	$scope.$route = $route;
  ipcRenderer.send('invokeAction');

  ipcRenderer.once('actionReply', function(event, data){
    getDisplayList(data.msg);
  })

	ipcRenderer.send('isDisplayVisible');

  ipcRenderer.once('displayVisible', function(event, data){
    checkDisplay(data.msg);
  })

  $('#chronoExample .startButtonCTUP').click(function () {
      let a = $("#noofDisplays").val()
      let msgs = $("#displayMsgCTUP").val()
			let useTimer = "loaded"
			let pageLoad = "1";

      //console.log("start button clicked");

      ipcRenderer.send('start-prefs', {display:a, setTimer:useTimer, loadPage:pageLoad});

			showDisplayCTUP();

			document.cookie = "type=countup";
      document.cookie = "seconds=0";
      document.cookie = "msg="+msgs;
  });

  $('#chronoExample .pauseButtonCTUP').click(function () {
      //timer.pause();
      ipcRenderer.send('pause-prefs')
      $('#chronoExample .pauseButtonCTUP').addClass('hide');
      $('#chronoExample .resumeButtonCTUP').removeClass('hide');
  });

  $('#chronoExample .resumeButtonCTUP').click(function () {
      //timer.pause();
      ipcRenderer.send('resume-prefs')
      $('#chronoExample .resumeButtonCTUP').addClass('hide');
      $('#chronoExample .pauseButtonCTUP').removeClass('hide');
  });

  $('#chronoExample .stopButtonCTUP').click(function () {
      //timer.stop();
      ipcRenderer.send('close-prefs')

			closeDisplayCTUP();
  });

  $('#chronoExample .exitButtonCTUP').click(function () {
      //timer.stop();
      ipcRenderer.send('exit-prefs')
  });
});

ftlwApp.controller('newyearController', function($scope, $route) {
	$scope.$route = $route;
	$scope.myDate = new Date();
	$scope.$route = $route;
  ipcRenderer.send('invokeAction');

  ipcRenderer.once('actionReply', function(event, data){
    getDisplayList(data.msg);
  })

	ipcRenderer.send('isDisplayVisible');

  ipcRenderer.once('displayVisible', function(event, data){
    checkDisplay(data.msg);
  })

	$( "#datepicker" ).datepicker({
		altField: "#alternate",
		altFormat: "mm-dd-yy",
	 	minDate: 1
	});

  $('#chronoExample .startButtonNY').click(function () {
      let a = $("#noofDisplays").val()
      let msgs = $("#displayMsgNY").val()
			let nyDate = new Date($("#alternate").val());
			let useTimer = "loadedNY"
			let pageLoad = "2";

			ipcRenderer.send('start-prefs', {display:a, setTimer:useTimer, loadPage:pageLoad});

			showDisplayNY();

			document.cookie = "type=newyear";
      document.cookie = "seconds=0";
      document.cookie = "msg="+msgs;
			document.cookie = "newYR="+nyDate.toISOString();
  });

  $('#chronoExample .stopButtonNY').click(function () {
      //timer.stop();
      ipcRenderer.send('close-prefs')

			closeDisplayNY();
  });

  $('#chronoExample .exitButtonNY').click(function () {
      //timer.stop();
      ipcRenderer.send('exit-prefs')
  });

	// $('.testButton').click(function () {
  //     //timer.pause();
  //     ipcRenderer.send('test-prefs')
  //     $('#chronoExample .pauseButton').addClass('hide');
  //     $('#chronoExample .resumeButton').removeClass('hide');
  // });
});

ftlwApp.directive("datepicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "mm/dd/yy",
        onSelect: function (dateText) {
          updateModel(dateText);
        }
      };
      $(elem).datepicker(options);
    }
  }
});
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

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  function updateClock() {
    var t = getTimeRemaining(endtime);
    $('#clockdiv .days1').html(t.days);
		$('#clockdiv .hours1').html(('0' + t.hours).slice(-2));
		$('#clockdiv .minutes1').html(('0' + t.minutes).slice(-2));
		$('#clockdiv .seconds1').html(('0' + t.seconds).slice(-2));

		$('#clockdiv2 .hours').html(('0' + t.hours).slice(-2));
		$('#clockdiv2 .minutes').html(('0' + t.minutes).slice(-2));
		$('#clockdiv2 .seconds').html(('0' + t.seconds).slice(-2));

		if (t.total <= 0) {
      clearInterval(timeinterval);
			$('#clockdiv').css("display","none");
			$('#showNewYear').removeClass('hide');
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

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

function showDisplay() {
	$('#chronoExample .pauseButton').prop('disabled', false);
	$('#chronoExample .stopButton').prop('disabled', false);
	$('#chronoExample .startButton').prop('disabled', true);

	$('#hrs').prop('disabled', true);
	$('#mins').prop('disabled', true);
	$('#secs').prop('disabled', true);
	$('#displayMsg').prop('disabled', true);
}

function closeDisplay() {
	$('#chronoExample .resumeButton').addClass('hide');
	$('#chronoExample .pauseButton').removeClass('hide');

	$('#chronoExample .pauseButton').prop('disabled', true);
	$('#chronoExample .stopButton').prop('disabled', true);
	$('#chronoExample .startButton').prop('disabled', false);

	$('#hrs').prop('disabled', false);
	$('#mins').prop('disabled', false);
	$('#secs').prop('disabled', false);
	$('#displayMsg').prop('disabled', false);
}

function showDisplayCTUP() {
	$('#chronoExample .pauseButtonCTUP').prop('disabled', false);
	$('#chronoExample .stopButtonCTUP').prop('disabled', false);
	$('#chronoExample .startButtonCTUP').prop('disabled', true);

	$('#displayMsgCTUP').prop('disabled', true);
}

function closeDisplayCTUP() {
	$('#chronoExample .resumeButtonCTUP').addClass('hide');
	$('#chronoExample .pauseButtonCTUP').removeClass('hide');

	$('#chronoExample .pauseButtonCTUP').prop('disabled', true);
	$('#chronoExample .stopButtonCTUP').prop('disabled', true);
	$('#chronoExample .startButtonCTUP').prop('disabled', false);

	$('#displayMsgCTUP').prop('disabled', false);
}

function showDisplayNY() {
	$('#chronoExample .stopButtonNY').prop('disabled', false);
	$('#chronoExample .startButtonNY').prop('disabled', true);

	$('#displayMsgNY').prop('disabled', true);
}

function closeDisplayNY() {
	$('#chronoExample .stopButtonNY').prop('disabled', true);
	$('#chronoExample .startButtonNY').prop('disabled', false);

	$('#displayMsgNY').prop('disabled', false);
}

function disableButtons(type) {
	if (type === "countdown"){
		$('#chronoExample .pauseButtonCTUP').prop('disabled', true);
		$('#chronoExample .stopButtonCTUP').prop('disabled', true);
		$('#chronoExample .startButtonCTUP').prop('disabled', true);
		$('#chronoExample .exitButtonCTUP').prop('disabled', true);

		$('#chronoExample .stopButtonNY').prop('disabled', true);
		$('#chronoExample .startButtonNY').prop('disabled', true);
		$('#chronoExample .exitButtonNY').prop('disabled', true);
	}
	else if (type === "countup") {
		$('#chronoExample .pauseButton').prop('disabled', true);
		$('#chronoExample .stopButton').prop('disabled', true);
		$('#chronoExample .startButton').prop('disabled', true);
		$('#chronoExample .exitButton').prop('disabled', true);

		$('#chronoExample .stopButtonNY').prop('disabled', true);
		$('#chronoExample .startButtonNY').prop('disabled', true);
		$('#chronoExample .exitButtonNY').prop('disabled', true);
	}
	else if (type === "newyear") {
		$('#chronoExample .pauseButtonCTUP').prop('disabled', true);
		$('#chronoExample .stopButtonCTUP').prop('disabled', true);
		$('#chronoExample .startButtonCTUP').prop('disabled', true);
		$('#chronoExample .exitButtonCTUP').prop('disabled', true);

		$('#chronoExample .pauseButton').prop('disabled', true);
		$('#chronoExample .stopButton').prop('disabled', true);
		$('#chronoExample .startButton').prop('disabled', true);
		$('#chronoExample .exitButton').prop('disabled', true);
	}
}

function checkDisplay(shows) {
	var type = document.cookie.replace(/(?:(?:^|.*;\s*)type\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	if (shows === true) {
		if (type === "countdown"){
			showDisplay();
			disableButtons(type);
		}
		else if (type === "countup") {
			showDisplayCTUP();
			disableButtons(type);
		}
		else if (type === "newyear") {
			showDisplayNY();
			disableButtons(type);
		}
		else {
			closeDisplay();
		}
	}
}

if (type === "countdown"){
	timer.start({countdown: true, startValues: {seconds: cookieValue}});
}
else if (type === "countup"){
	timer.start();
}
else if (type === "newyear"){
	//var newYR = 'November 11 2016 19:47:00 GMT-0500';
	//console.log(new Date(Date.parse(newYR)));
	initializeClock('clockdiv', new Date(Date.parse(newYR)));
}
//$('#chronoExample1 .values').html(timer.getTimeValues().toString());
$('#chronoExample1 .hours').html(timer.getTimeValues().hours);
$('#chronoExample1 .minutes').html(timer.getTimeValues().minutes);
$('#chronoExample1 .seconds').html(timer.getTimeValues().seconds);
$('#chronoExample .hours').html(timer.getTimeValues().hours);
$('#chronoExample .minutes').html(timer.getTimeValues().minutes);
$('#chronoExample .seconds').html(timer.getTimeValues().seconds);
$('#chronoExample2 .hours').html(timer.getTimeValues().hours);
$('#chronoExample2 .minutes').html(timer.getTimeValues().minutes);
$('#chronoExample2 .seconds').html(timer.getTimeValues().seconds);

$('#displayMsgs').html(displaymsg);

function startTime() {
    var today = new Date();
    var formatted = formatAMPM(today);

    $('#timeDisplay').html("The time is: " + formatted);

    t = setTimeout(function () {
        startTime()
    }, 500);
}
startTime();

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

ipcRenderer.on('pause' , function(event , data){
  timer.pause()
 });

ipcRenderer.on('resume' , function(event , data){
 timer.start()
});

ipcRenderer.on('mainPause' , function(event , data){
  timer.pause()
 });

ipcRenderer.on('mainResume' , function(event , data){
 timer.start()
});

ipcRenderer.on('mainStop' , function(event , data){
timer.stop()
});

timer.addEventListener('secondsUpdated', function (e) {
  $('#chronoExample1 .hours').html(timer.getTimeValues().hours);
  $('#chronoExample1 .minutes').html(timer.getTimeValues().minutes);
  $('#chronoExample1 .seconds').html(timer.getTimeValues().seconds);
	$('#chronoExample .hours').html(timer.getTimeValues().hours);
  $('#chronoExample .minutes').html(timer.getTimeValues().minutes);
  $('#chronoExample .seconds').html(timer.getTimeValues().seconds);
	$('#chronoExample2 .hours').html(timer.getTimeValues().hours);
  $('#chronoExample2 .minutes').html(timer.getTimeValues().minutes);
  $('#chronoExample2 .seconds').html(timer.getTimeValues().seconds);
});

timer.addEventListener('targetAchieved', function (e) {
    $('#chronoExample1 .values').html('Time UP!!');
		$('#chronoExample2 .values').html('Time UP!!');
});

timer.addEventListener('started', function (e) {
  $('#chronoExample1 .hours').html(timer.getTimeValues().hours);
  $('#chronoExample1 .minutes').html(timer.getTimeValues().minutes);
  $('#chronoExample1 .seconds').html(timer.getTimeValues().seconds);
	$('#chronoExample .hours').html(timer.getTimeValues().hours);
  $('#chronoExample .minutes').html(timer.getTimeValues().minutes);
  $('#chronoExample .seconds').html(timer.getTimeValues().seconds);
	$('#chronoExample2 .hours').html(timer.getTimeValues().hours);
  $('#chronoExample2 .minutes').html(timer.getTimeValues().minutes);
  $('#chronoExample2 .seconds').html(timer.getTimeValues().seconds);
});

ipcRenderer.on('loaded' , function(event , data) {
	timer.start();
});

ipcRenderer.on('loadedCTDW' , function(event , data) {
	timer.start({countdown: true, startValues: {seconds: cookieValue}})
});

// require('electron').ipcRenderer.on('loaded' , function(event, data) {
//   document.getElementById('title').innerHTML = data.appName + ' App';
//   document.getElementById('details').innerHTML = 'built with Electron v' + data.electronVersion;
//   document.getElementById('versions').innerHTML = 'running on Node v' + data.nodeVersion + ' and Chromium v' + data.chromiumVersion;
// });
