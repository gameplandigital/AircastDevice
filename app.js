var async = require('async')
var needle = require('needle')
var fs = require('fs')
var bodyParser  = require('body-parser');
var express = require('express')
var path = require('path')
var aircast = require('./aircastServer.js')

var Twit = require('twit');

console.log(' FFF ');



var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.use('/css', express.static(path.join(__dirname+'/public/css')));
app.use('/scripts', express.static(path.join(__dirname+'/public/scripts')));
app.use('/templates', express.static(path.join(__dirname+'/public/templates')));
app.use('/assets', express.static(path.join(__dirname+'/public/assets')));
app.use('/Aircast', express.static(path.join(__dirname+'/../AircastContent')));
app.use('/AircastConfig', express.static(path.join(__dirname+'/../AircastConfig')));

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

app.post('/localContent',function (req,res) {

  
  var d = req.body;

  fs.exists(path.join(__dirname+'/../AircastConfig/offline-content.txt'), (exists) => {

    if (exists) {
      try{
        if (d.status) {
          fs.writeFile(path.join(__dirname+'/../AircastConfig/offline-content.txt'), JSON.stringify(d.content), function(err, data){
              if (err) {
                res.json({success: false, content: [], err});  
              }else{
                console.log("Successfully Written to File.");
                res.json({success: true, content: d.content, err});  
              }
          });
        } else {
          fs.readFile(path.join(__dirname+'/../AircastConfig/offline-content.txt'), 'utf-8' ,function(err, data) {
            if (err) {
                res.json({success: false, content: [], err});  
            }else{
              res.json({success: true, content: JSON.parse(data), err})
            }
          });
        }
      }catch(error){
        console.log(error);
      }

    } else {
        try{

          let data_to_write = JSON.stringify(d.content);
          fs.writeFile(path.join(__dirname+'/../AircastConfig/offline-content.txt'),data_to_write, (err) => {
              if (err) {
                res.json({success: false, content: [], err});  
              }else {
                  console.log("Successfully Written to File.");
                  res.json({success: true, content: JSON.parse(data_to_write), err});

                }
          });   

        }catch(error){
          console.log(error)
        }
    }

  });

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

