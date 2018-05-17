var async = require('async')
var needle = require('needle')
var fs = require('fs')
var express = require('express')
var path = require('path')
var aircast = require('./aircastServer.js')

var Twit = require('twit');

console.log(' WWQQ ');



var app = express()

app.set('port', process.env.PORT || 3000);
app.use('/css', express.static(path.join(__dirname+'/public/css')));
app.use('/scripts', express.static(path.join(__dirname+'/public/scripts')));
app.use('/templates', express.static(path.join(__dirname+'/public/templates')));
app.use('/assets', express.static(path.join(__dirname+'/public/assets')));
app.use('/Aircast', express.static(path.join(__dirname+'/../AircastContent')));

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '/public')});
})

app.get('/demo', function (req, res) {
  res.sendFile('indexDemo.html', {root: path.join(__dirname, '/public')});
})

app.get('/demoPortrait', function (req, res) {
  res.sendFile('indexDemoPortrait.html', {root: path.join(__dirname, '/public')});
})

app.get('/crash', function (req, res) {
  setTimeout(function () {
        throw new Error('We crashed!!!!!');
  }, 10);
  res.sendFile('indexDemoPortrait.html', {root: path.join(__dirname, '/public')});
})



app.get('/myID', function (req, res) {
  // console.log(aircast);
  var data = {
              RpiID: aircast.config.RpiID,
              RpiServer: aircast.config.RpiServer
            }

  if(aircast.config.isLegit){
    res.send(data);
  }
  else{
    res.send({
      error: 'config failed'
    });
  }

})



app.listen(app.get('port'), function () {
  console.log('Example app listening on port: '+app.get('port'))
})


function getRpiConfig(){
  if(aircast.getConfig()){
    console.log('success');
    // updateRpi();
    setInterval(aircast.getRpiFiles, 10000);
    setInterval(aircast.getSourceFiles, 30000);
    setInterval(aircast.nodeAlive, 30000);
    // setInterval(aircast.removeFile, 5000);
  }
  else{
    console.log('fail');
    setTimeout(getRpiConfig, 1000);
  }
}

function updateRpi(){
  setInterval(aircast.getRpiFiles, 10000);
}


getRpiConfig()

