var electron, path, json;

path = require('path');
json = require('../../package.json');

electron = require('electron');
const {ipcMain, session, dialog} = require('electron')

var Timer = require('../lib/easytimer.min.js');

var timer = new Timer();

electron.app.on('ready', function() {
  var mainwindow;

  mainwindow = new electron.BrowserWindow({
    title: json.name,
    width: json.settings.width,
    height: json.settings.height
  });

  var electronScreen = electron.screen;
  var displays = electronScreen.getAllDisplays();
  var externalDisplay = null;
  externalDisplay = displays[0];
  mainwindow.loadURL('file://' + path.join(__dirname, '..', '..') + '/index.html')
  //mainwindow.webContents.openDevTools()

  var secmainWindow

  function createInsertWindow(a) {
    if (a !== "" ) {
      externalDisplay = displays[a]
      secmainWindow = new electron.BrowserWindow({
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50,
        show: false,
        backgroundColor: '#000',
        frame: false,
        fullscreen: true
      });
    }
    else {
      externalDisplay = displays[0]
      secmainWindow = new electron.BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        backgroundColor: '#000',
        frame: false
      });
    }
    secmainWindow.loadURL('file://' + path.join(__dirname, '..', '..') + '/countDownDisplay.html')
    //secmainWindow.webContents.openDevTools()
    secmainWindow.on('closed',function() {
        secmainWindow = null;
    });
  }

  ipcMain.on('start-prefs', function(event, data) {
    if(!secmainWindow) {
          createInsertWindow(data.display);
      }
      return (secmainWindow.isVisible()) ? secmainWindow.hide() : secmainWindow.show();
  });

  ipcMain.on('close-prefs', function() {
    if(!secmainWindow) {
          dialog.showErrorBox("Stop Button Clicked", "You clicked the stop button multiple time")
          console.log("New Window")
      }
      return (secmainWindow.isVisible()) ? secmainWindow.close() : secmainWindow.show();
  });

  ipcMain.on('pause-prefs', function() {
      secmainWindow.webContents.send('pause' , {msg:'hello from main process'});
  });

  ipcMain.on('resume-prefs', function() {
      secmainWindow.webContents.send('resume' , {msg:'hello from resume process'});
  });

  ipcMain.on('exit-prefs', function() {
      mainwindow.close();
  });

  ipcMain.on('invokeAction', function(){
      var result = displays.length;
      mainwindow.webContents.send('actionReply', {msg:result});
  });

  mainwindow.on('closed',function() {
    if(secmainWindow) {
      secmainWindow.close();
    }
    mainWindow = null;
  });

  // mainwindow.loadURL('file://' + path.join(__dirname, '..', '..') + '/index.html');
  //
  // mainwindow.webContents.on('did-finish-load', function(){
  //   mainwindow.webContents.send('loaded', {
  //     appName: json.name,
  //     electronVersion: process.versions.electron,
  //     nodeVersion: process.versions.node,
  //     chromiumVersion: process.versions.chrome
  //   });
  // });
  //
  // mainwindow.on('closed', function() {
  //   mainwindow = null;
  // });

});
