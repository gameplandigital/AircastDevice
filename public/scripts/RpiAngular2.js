var app = angular.module("MainModule", ["ui.bootstrap", "ui.event"]);

app.filter("cut", function() {
  return function(value, wordwise, max, tail) {
    if (!value) return "";

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(" ");
      if (lastspace !== -1) {
        //Also remove . and , so its gives a cleaner result.
        if (
          value.charAt(lastspace - 1) === "." ||
          value.charAt(lastspace - 1) === ","
        ) {
          lastspace = lastspace - 1;
        }
        value = value.substr(0, lastspace);
      }
    }

    return value + (tail || " …");
  };
});

app.config(function($httpProvider) {
  console.log("cors");
  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;
});

app.controller("MainController", function(
  $scope,
  $http,
  $interval,
  $timeout,
  $window,
  $q,
  $sce
) {
  reloader = 1;

  $scope.demoState = 0;

  $scope.mainDiv = {
    position: "absolute",
    top: "0px",
    left: "0px",
    width: $window.innerWidth + "px",
    height: $window.innerHeight + "px",
    "background-color": "black"
  };

  $scope.TemplateData = [];

  $scope.templates = [];
  $scope.temporary = [];

  var payload = {
    CampaignID: 3,
    tempHtml: "templates/temp2.html",
    tempSrc: {
      video: "Aircast/loading.mp4"
    },
    tempJs: "scripts/temp2.js",
    tempCss: "css/temp2.css",
    tempInit: "temp2Controller"
  };

  $scope.Default = payload;

  $scope.templates.push(payload);

  $scope.currentCampaignID = 0;

  var isStart = true;
  $scope.templatePosition = 0;
  $scope.templateShuffle = function() {
    // $scope.refresh = Date.now();

    if ($scope.templates.length == 0) {
      $scope.templates.push($scope.Default);
    }

    var playingTemplate = $scope.templates[0];
    $scope.templates.shift();
    $scope.templates.push(playingTemplate);
    $scope.currentPlayingCampaignID = playingTemplate.CampaignID;

    UpdateWallet(
      $http,
      playingTemplate.CampaignID,
      $window.innerWidth,
      $window.innerHeight
    );

    $scope.currentTemp = playingTemplate.tempHtml;
    //console.log('Current Temp: ', playingTemplate.tempHtml);

    if (!$scope.$$phase) {
      $scope.$apply();
    }

    var tempNameSpace = {
      $scope: $scope,
      $window: $window,
      $timeout: $timeout,
      $http: $http,
      source: playingTemplate,
      callback: $scope.templateShuffle,
      $q: $q,
      $sce: $sce
    };

    var payl2 = [
      tempNameSpace["$scope"],
      tempNameSpace["$window"],
      tempNameSpace["$timeout"],
      tempNameSpace["$http"],
      tempNameSpace["source"],
      tempNameSpace["callback"],
      tempNameSpace["$q"],
      tempNameSpace["$sce"]
    ];

    LazyLoad.css(playingTemplate.tempCss, function() {
      LazyLoad.js(playingTemplate.tempJs, function() {
        window[playingTemplate.tempInit].apply(null, payl2);
      });
    });
  };

  $scope.templateShuffle();

  $scope.saveDataInTheServer = function(RpiServer, newTemplates) {
    $http({
      method: "POST",
      url: "/localContent",
      data: {
        status: true,
        content: newTemplates
      }
    }).then(
      function(data) {
        if (data.data.success) {
          //console.log('Successfully saved in the server.');
        } else {
          //console.log('ERROR WITH THE ONLINE SECTION')
        }
      },
      function(err) {
        //console.warn('error with the internet',err);
      }
    );
  };

  $scope.getTemplates = function() {
    //console.log('getTemplates');
    $http.get("/myID").then(
      function(response) {
        var RpiID = response.data.RpiID;
        var RpiServer = response.data.RpiServer;

        var data = {
          RpiID: RpiID
        };

        $http({
          url: RpiServer + "/GetCampaigns",
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 5000
        }).then(
          function(response) {
            //console.info('HAS INTERNET')
            var newTemplates = response.data;

            $scope.temporary = newTemplates;

            var campaignList = [];

            for (var i = 0; i < $scope.templates.length; i++) {
              if (campaignList.indexOf($scope.templates[i].CampaignID) == -1) {
                campaignList.push($scope.templates[i].CampaignID);
              }
            }

            for (var i = 0; i < $scope.temporary.length; i++) {
              if (campaignList.indexOf($scope.temporary[i].CampaignID) == -1) {
                //console.log('there is a change, saving data in the server');
                $scope.saveDataInTheServer(RpiServer, newTemplates);
              }
            }

            //call function to save the changes in the localstorage

            $scope.insertData(RpiServer, newTemplates, "online");
          },
          function(err) {
            //console.warn('No Internet Connection');

            var campaignList = [];

            if ($scope.temporary.length == 0) {
              //console.log('no content... fetching data in the localstorage');
              $http({
                method: "POST",
                url: "/localContent",
                data: {
                  status: false,
                  content: []
                }
              }).then(
                function(data) {
                  //console.log(data);
                  if (data.data.success) {
                    //console.log('DATA FROM SERVER: ',data)
                    $scope.insertData(RpiServer, data.data.content, "offline");
                  } else {
                    console.log("ERROR WITH THE OFFLINE SECTION");
                  }
                },
                function(err) {
                  console.warn("error with the internet", err);
                }
              );
            } else {
              //console.log('Using data in the temporary storage..');
              $scope.insertData(RpiServer, $scope.temporary, "offline");
            }
          }
        );
      },
      function(error) {
        console.warn("error getting the id");
      }
    );
  };

  $scope.insertData = function(RpiServer, newTemplates, status) {
    console.log("TEMPLATES: ", $scope.templates);
    console.log("New Templates: ", newTemplates);

    if (status == "online") {
      //console.log('ONLINE CONTENT KICKING IN...')
    } else {
      //console.log('OFFLINE CONTENT KICKING IN...')

      var newTemplatesTemp = [];
      var scopeTemplateTemp = [];

      for (var i = 0; i < newTemplates.length; i++) {
        if (
          newTemplates[i].Template == "temp2" ||
          newTemplates[i].Template == "temp4"
        ) {
          newTemplatesTemp.push(newTemplates[i]);
        }
      }

      newTemplates = newTemplatesTemp;
    }

    // $scope.templates = scopeTemplateTemp;

    //console.log('Current Content: ', $scope.templates)
    //console.log('New Upcoming Content: ', newTemplates)

    var i = 0;
    while (i < $scope.templates.length) {
      var wasInside = false;
      for (var j = 0; j < newTemplates.length; j++) {
        // console.log("NEW: "+newTemplates[j].CampaignID+" OLD: "+$scope.templates[i].CampaignI);
        if (newTemplates[j].CampaignID == $scope.templates[i].CampaignID) {
          $scope.templates[i] = newTemplates[j];
          wasInside = true;
          break;
        }
      }

      if (!wasInside) {
        $scope.templates.shift();
      } else {
        i++;
      }
      // console.log('i: '+i);
      // console.log($scope.templates);
    }

    //console.log('CHECKING');
    //console.log($scope.templates);

    for (var i = 0; i < newTemplates.length; i++) {
      for (var j = 0; j < $scope.TemplateData.length; j++) {
        if (newTemplates[i].CampaignID == $scope.TemplateData[j].CampaignID) {
          $scope.TemplateData[j].tempSrc = newTemplates[i].tempSrc;
        }
      }
    }

    //console.log('TempData GGG');
    //console.log($scope.TemplateData);
    // console.log('mid temp');
    // console.log($scope.templates);
    for (var i = 0; i < newTemplates.length; i++) {
      // console.log(newTemplates[i]);
      var wasInside = false;
      for (var j = 0; j < $scope.templates.length; j++) {
        if (newTemplates[i].CampaignID == $scope.templates[j].CampaignID) {
          wasInside = true;
          break;
        }
      }
      if (!wasInside) {
        if (newTemplates[i].needTempData) {
          var hasTempData = false;
          for (var j = 0; j < $scope.TemplateData.length; j++) {
            if (
              $scope.TemplateData[j].Template == newTemplates[i].Template &&
              $scope.TemplateData[j].CampaignID == newTemplates[i].CampaignID
            ) {
              hasTempData = true;
              break;
            }
          }

          if (!hasTempData) {
            var dummyTemp = {
              Template: newTemplates[i].Template,
              hasData: false,
              tempSrc: newTemplates[i].tempSrc,
              CampaignID: newTemplates[i].CampaignID
            };

            $scope.TemplateData.push(dummyTemp);
          }

          for (var j = 0; j < $scope.TemplateData.length; j++) {
            if (
              $scope.TemplateData[j].Template == newTemplates[i].Template &&
              $scope.TemplateData[j].hasData == true &&
              $scope.TemplateData[j].CampaignID == newTemplates[i].CampaignID
            ) {
              $scope.templates.unshift(newTemplates[i]);
            }
          }
        } else {
          $scope.templates.unshift(newTemplates[i]);
        }
        // console.log('inserted');
        // $scope.templates.unshift(newTemplates[i]);
      }

      // else
      //   console.log('not inserted');
    }

    if (!$scope.$$phase) {
      $scope.$apply();
    }

    $scope.temporary = $scope.templates;
  };

  function getTempData() {
    var payl = [$http, $scope];

    // landscape-content
    // news-landscape-cnn
    window["temp10GetData"].apply(null, payl);
    //nearby-restaurant-landscape
    window["temp11GetData"].apply(null, payl);
    //weather-landscape
    window["temp12GetData"].apply(null, payl);
    //currency-landscape
    window["temp13GetData"].apply(null, payl);
    //twitter-landscape
    window["temp14GetData"].apply(null, payl);
    //hugot-landscape
    window["temp15GetData"].apply(null, payl);
    //movie-landscape
    window["temp16GetData"].apply(null, payl);
    window["temp17GetData"].apply(null, payl);
    window["temp18GetData"].apply(null, payl);
    window["temp19GetData"].apply(null, payl);
    window["temp20GetData"].apply(null, payl);
    window["temp22GetData"].apply(null, payl);
    window["temp24GetData"].apply(null, payl);
    window["temp26GetData"].apply(null, payl); //instagram-post
    window["temp27GetData"].apply(null, payl); //facebook-post
    window["temp28GetData"].apply(null, payl); //facebook-events
    window["temp29GetData"].apply(null, payl); //spotify-music
    window["temp30GetData"].apply(null, payl); //facebook-selected-post
    window["temp31GetData"].apply(null, payl); //instagram hashtag
    window["temp32GetData"].apply(null, payl); //facebook full screen w/o reaction
    window["temp33GetData"].apply(null, payl); //facebook full screen w/ reactions
    window["temp34GetData"].apply(null, payl); //facebook live
    window["temp35GetData"].apply(null, payl); //Content URL
    window["temp36GetData"].apply(null, payl); //Value
    window["temp38GetData"].apply(null, payl); // COVID-19 Tracker (Landscape)
    window["temp39GetData"].apply(null, payl); // COVID-19 Tracker (Portrait)

    //portrait-content
    // window['temp17GetData'].apply(null, payl);
    // window['temp18GetData'].apply(null, payl);
    // window['temp19GetData'].apply(null, payl);
    // window['temp20GetData'].apply(null, payl);
    // window['temp22GetData'].apply(null, payl);
    // window['temp23GetData'].apply(null, payl);
  }

  getTempData();
  $interval(function() {
    getTempData();
  }, 15000);

  $interval(function() {
    $scope.getTemplates();
  }, 15000);

  // $interval(function(){
  //   var current = Date.now();
  //   if(current >= $scope.refresh + 900000){
  //     location.reload();
  //   }
  // }, 5000);

  $interval(function() {
    //console.log('check')
    $http.get("/myID").then(function(response) {
      var RpiID = response.data.RpiID;
      var RpiServer = response.data.RpiServer;

      var data = {
        RpiID: RpiID
      };

      $http({
        url: RpiServer + "/CheckBrowser",
        method: "POST",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 3000
      })
        .then(function(response) {
          if (response.data.browserReboot) {
            $window.location.reload();
          }
        })
        .catch(function(err) {
          //console.warn('Error in calling browser Refresh');
          console.log(err);
        });
    });
  }, 60000).catch(function(err) {
    //console.log('Error in calling browser Refresh');
    //console.log(err);
  });
});
