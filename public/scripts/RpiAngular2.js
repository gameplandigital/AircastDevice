var app = angular.module('MainModule', ['ui.bootstrap', 'ui.event', 'ngAnimate']);


app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

app.config(function($httpProvider) {
  console.log('cors');
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});


app.controller('MainController', function($scope, $http, $interval, $timeout, $window, $q){
  reloader = 1;



  // $scope.refresh = Date.now();
  // console.log($scope.refresh);
  // console.log('time');
  // $window.alert('W: '+$window.innerWidth+' H: '+$window.innerHeight);

  $scope.demoState = 0;
  

  // var yesterday = new Date((Date.now()) - 86400000);
  // console.log('yesterday: '+Date.now());

  $scope.mainDiv = {
    "position": "absolute",
    "top":      "0px",
    "left":     "0px",
    "width":    $window.innerWidth+"px",
    "height":   $window.innerHeight+"px",
    "background-color": "black"
  }


  $scope.TemplateData = [];


  $scope.templates = [];

  var payload = {
    CampaignID: 3,
    tempHtml: 'templates/temp2.html',
    tempSrc: {
                video: "Aircast/loading.mp4"
              },
    tempJs: 'scripts/temp2.js',
    tempCss: 'css/temp2.css',
    tempInit: 'temp2Controller'
  }

  $scope.Default = payload;

  $scope.templates.push(payload);

  $scope.currentCampaignID = 0;

  
  var isStart = true;
  $scope.templatePosition = 0;
  $scope.templateShuffle = function(){
    // $scope.refresh = Date.now();


    if($scope.templates.length == 0){

        $scope.templates.push($scope.Default);
    }

    var playingTemplate = $scope.templates[0];
    $scope.templates.shift();
    $scope.templates.push(playingTemplate);

    

    UpdateWallet($http, playingTemplate.CampaignID, $window.innerWidth, $window.innerHeight);


    $scope.currentTemp = playingTemplate.tempHtml;
    console.log('Current Temp: ', playingTemplate.tempHtml);

    if(!$scope.$$phase) {
      $scope.$apply();
    }


    // $scope.CurrentTemplate = $

    var tempNameSpace = {
      '$scope': $scope,
      '$window': $window,
      '$timeout': $timeout,
      '$http': $http,
      'source': playingTemplate,
      "callback": $scope.templateShuffle,
      '$q': $q
    };

    var payl2 = [tempNameSpace['$scope'], tempNameSpace['$window'], tempNameSpace['$timeout'], tempNameSpace['$http'], tempNameSpace['source'], tempNameSpace['callback'], tempNameSpace['$q']];
    // var payl = [$scope, $window, $timeout, $http, playingTemplate.tempSrc, $scope.templateShuffle];

    // window[playingTemplate.tempInit].apply(null, payl2);

    LazyLoad.css(playingTemplate.tempCss, function () {
      LazyLoad.js(playingTemplate.tempJs, function () {
        window[playingTemplate.tempInit].apply(null, payl2);
      });
    });


  }

  $scope.templateShuffle();


  $scope.getTemplates = function(){
    //console.log('getTemplates');
    $http.get('/myID').then(function(response){


      var RpiID = response.data.RpiID;
      var RpiServer = response.data.RpiServer;

      //console.log(RpiServer);

      var data = {
        RpiID: RpiID
      }


      // $http.post(RpiServer+'/GetCampaigns', data, {headers: {

      // $http.post('https://api.aircast.ph/rpiGetCampaigns', data, {headers: {
      //               'Content-Type': 'application/json; charset=utf-8'
      //   }})

      $http({
          url: RpiServer+'/GetCampaigns',
          method: "POST",
          data: data,
          headers: {
                      'Content-Type': 'application/json'
          },
          timeout: 5000
      })
      .then(function(response){

        console.info('HAS INTERNET')
        var newTemplates = response.data;     
        
        $http({
          method: "POST",
          url: '/localContent',
          data: {
            status: true,
            content: newTemplates,
          },
        }).then(function(data){
            console.log(data);
            if (data.data.success) {
              $scope.insertData(RpiServer,newTemplates,'online'); 
            }else{
              console.log('ERROR WITH THE ONLINE SECTION')
            }
            
        },function(err){
          console.warn('error with the internet');
        })

        //localStorage.setItem('rpi_data',JSON.stringify(newTemplates));
        //$scope.insertData(RpiServer,newTemplates,'online');

      }, function(err){
        console.warn('No Internet Connection');

        //var temp_data = localStorage.getItem('rpi_data');
        //var response = JSON.parse(temp_data);
        //$scope.insertData(RpiServer,response,'offline')

        $http({
          method: "POST",
          url: '/localContent',
          data: {
            status: false,
            content: 'empty'
          },
        }).then(function(data){
            console.log(data);
            if (data.data.success) {
              console.log('DATA FROM SERVER: ',data)
              $scope.insertData(RpiServer,data.data.content,'offline');
            }else{
              console.log('ERROR WITH THE OFFLINE SECTION')
            }

        },function(err){
          console.warn('error with the internet');
        })


      });

          

    }, function(error){
      console.warn('error getting the id');
    });

      
  }


  $scope.insertData = function(RpiServer,newTemplates,status){
        
      //console.log('TEMPLATES: ', $scope.templates)
      console.log('New Templates: ', newTemplates)

      if (status == 'online') {
        console.log('ONLINE CONTENT KICKING IN...')
      }else {
        console.log('OFFLINE CONTENT KICKING IN...')

        var newTemplatesTemp = [];
        var scopeTemplateTemp = [];

        for (var i = 0; i < newTemplates.length; i++) {
          if (newTemplates[i].Template == 'temp2' || newTemplates[i].Template == 'temp4') {
            newTemplatesTemp.push(newTemplates[i]);
          }
        }

        // for (var i = 0; i < $scope.templates.length; i++) {
        //   if ($scope.templates[i].Template == 'temp2' || $scope.templates[i].Template == 'temp4') {
        //      scopeTemplateTemp.push($scope.templates[i]);
        //   }
        // }
        newTemplates = newTemplatesTemp;
      }
        
        // $scope.templates = scopeTemplateTemp;

        console.log('Current Content: ', $scope.templates)
        console.log('New Upcoming Content: ', newTemplates)

        var i=0;
        while(i<$scope.templates.length){
          var wasInside = false;
          for(var j=0; j<newTemplates.length; j++){
            // console.log("NEW: "+newTemplates[j].CampaignID+" OLD: "+$scope.templates[i].CampaignI);
            if(newTemplates[j].CampaignID == $scope.templates[i].CampaignID){

              $scope.templates[i] = newTemplates[j];
              wasInside = true;
              break;
            }
          }

          if(!wasInside){
            $scope.templates.shift();
          }
          else{
            i++;
          }
          // console.log('i: '+i);
          // console.log($scope.templates);
        }

        //console.log('CHECKING');
        //console.log($scope.templates);

        for(var i=0; i<newTemplates.length; i++){
          for(var j=0; j < $scope.TemplateData.length; j++){
            if(newTemplates[i].CampaignID == $scope.TemplateData[j].CampaignID){
              $scope.TemplateData[j].tempSrc = newTemplates[i].tempSrc;
            }
          }
        }

        //console.log('TempData GGG');
        //console.log($scope.TemplateData);


        // console.log('mid temp');
        // console.log($scope.templates);
        for(var i=0; i<newTemplates.length; i++){
          // console.log(newTemplates[i]);
          var wasInside = false;
          for(var j=0; j<$scope.templates.length; j++){
            if(newTemplates[i].CampaignID == $scope.templates[j].CampaignID){
              wasInside = true;
              break;
            }
          }
          if(!wasInside){

            if(newTemplates[i].needTempData){
              var hasTempData = false;
              for(var j=0; j < $scope.TemplateData.length; j++){
                if($scope.TemplateData[j].Template == newTemplates[i].Template && $scope.TemplateData[j].CampaignID == newTemplates[i].CampaignID){
                  hasTempData = true;
                  break;
                }
              }

              if(!hasTempData){
                var dummyTemp = {
                  Template: newTemplates[i].Template,
                  hasData: false,
                  tempSrc: newTemplates[i].tempSrc,
                  CampaignID: newTemplates[i].CampaignID
                }

                $scope.TemplateData.push(dummyTemp);
              }

              for(var j=0; j < $scope.TemplateData.length; j++){
                if($scope.TemplateData[j].Template == newTemplates[i].Template && $scope.TemplateData[j].hasData == true && $scope.TemplateData[j].CampaignID == newTemplates[i].CampaignID){
                  $scope.templates.unshift(newTemplates[i]);
                }
              }
            }
            else{
              $scope.templates.unshift(newTemplates[i]);
            }
            // console.log('inserted');
            // $scope.templates.unshift(newTemplates[i]);
          }

          // else
          //   console.log('not inserted');
        }

          
        if(!$scope.$$phase) {
          $scope.$apply();
        }


  }
  


  function getTempData(){
    var payl = [$http, $scope];

    // landscape-content
    // news-landscape-cnn
    window['temp10GetData'].apply(null, payl);
    //nearby-restaurant-landscape
    window['temp11GetData'].apply(null, payl);
    //weather-landscape
    window['temp12GetData'].apply(null, payl);
    //currency-landscape
    window['temp13GetData'].apply(null, payl);
    //twitter-landscape
    window['temp14GetData'].apply(null, payl);
    //hugot-landscape
    window['temp15GetData'].apply(null, payl);
    //movie-landscape
    window['temp16GetData'].apply(null, payl);
    window['temp17GetData'].apply(null, payl);
    window['temp18GetData'].apply(null, payl);
    window['temp19GetData'].apply(null, payl);
    window['temp20GetData'].apply(null, payl);
    window['temp22GetData'].apply(null, payl);
    window['temp24GetData'].apply(null, payl);
    window['temp26GetData'].apply(null, payl);  //instagram-post
    window['temp27GetData'].apply(null, payl);  //facebook-post
    window['temp28GetData'].apply(null, payl);  //facebook-events
    window['temp29GetData'].apply(null, payl);  //spotify-music
    window['temp30GetData'].apply(null, payl);  //facebook-selected-post
    window['temp31GetData'].apply(null, payl);  //instagram hashtag
    window['temp32GetData'].apply(null, payl);  //facebook full screen w/o reaction
    window['temp33GetData'].apply(null, payl);  //facebook full screen w/ reactions
    window['temp34GetData'].apply(null, payl);  //facebook live

    

    //portrait-content
    // window['temp17GetData'].apply(null, payl);
    // window['temp18GetData'].apply(null, payl);
    // window['temp19GetData'].apply(null, payl);
    // window['temp20GetData'].apply(null, payl);
    // window['temp22GetData'].apply(null, payl);
    // window['temp23GetData'].apply(null, payl);
  }

  getTempData();
  $interval(function(){getTempData();}, 10000);

  $interval(function(){$scope.getTemplates();}, 5000);



  // $interval(function(){
  //   var current = Date.now();
  //   if(current >= $scope.refresh + 900000){
  //     location.reload();
  //   }
  // }, 5000);


  $interval(function(){
    //console.log('check')
    $http.get('/myID').then(function(response){


      var RpiID = response.data.RpiID;
      var RpiServer = response.data.RpiServer;

      var data = {
        "RpiID": RpiID
      }

      $http({
          url: RpiServer+'/CheckBrowser',
          method: "POST",
          data: data,
          headers: {
                      'Content-Type': 'application/json'
          },
          timeout: 3000
      })

      .then(function(response){
        if(response.data.browserReboot){
          $window.location.reload();
        }
      })
      .catch(function(err){
        console.warn('Error in calling browser Refresh');
        console.log(err);
      })


    })
  }, 60000).catch(function(err){
    console.log('Error in calling browser Refresh');
    console.log(err);
  });


});