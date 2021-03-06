function temp10GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp10" &&
      (!item.hasData || item.lastQuery < Date.now() - 14400000)
    ) {
      var dum = item.tempSrc.source.split("/");
      var source = dum[1];
      item.source = source;

      if (source == "local") {
        $http
          .get(
            "https://newsapi.org/v2/top-headlines?country=ph&apiKey=a3aa8dee6c814974b0cd33bd806ef301"
          )
          .then(
            function (response) {
              console.log("TEMP 10: News | Fetching Data Success");
              for (var i = 0; i < $scope.TemplateData.length; i++) {
                if (
                  $scope.TemplateData[i].Template == "temp10" &&
                  $scope.TemplateData[i].CampaignID == item.CampaignID
                ) {
                  $scope.TemplateData[i].TempData = response.data;
                  $scope.TemplateData[i].hasData = true;
                  $scope.TemplateData[i].currentPosition = 0;
                  $scope.TemplateData[i].lastQuery = Date.now();
                  break;
                }
              }
            },
            function (error) {
              console.warn("ERROR: TEMP 10 | News (Local)");
            }
          );
      } else {
        $http
          .get(
            "https://newsapi.org/v1/articles?source=" +
              source +
              "&sortBy=top&apiKey=a3aa8dee6c814974b0cd33bd806ef301"
          )
          .then(
            function (response) {
              console.log("TEMP 10: Fetching Data Success");
              for (var i = 0; i < $scope.TemplateData.length; i++) {
                if (
                  $scope.TemplateData[i].Template == "temp10" &&
                  $scope.TemplateData[i].CampaignID == item.CampaignID
                ) {
                  $scope.TemplateData[i].TempData = response.data;
                  $scope.TemplateData[i].hasData = true;
                  $scope.TemplateData[i].currentPosition = 0;
                  $scope.TemplateData[i].lastQuery = Date.now();
                  break;
                }
              }
            },
            function (error) {
              console.warn("ERROR: TEMP 10 | News (Foreign)");
            }
          );
      }
    }
  });
}

function temp11GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp11" &&
      (!item.hasData || item.lastQuery < Date.now() - 86400000)
    ) {
      var restaurantList = [];
      var restaurantNameList = [];
      var tempCount,
        counter = 0;

      var config = {
        lat: 14.609695,
        long: 121.0747,
        zomatoConfig: {
          headers: {
            "user-key": "1e3481187e26de091dfdb5f7f768312a",
            Accept: "application/json;odata=verbose",
          },
        },
      };

      config.url =
        "https://developers.zomato.com/api/v2.1/geocode?lat=" +
        config.lat +
        "&lon=" +
        config.long;

      fetchRestaurantData(config.url);

      function fetchRestaurantData(url) {
        var currentTimeStamp = moment().unix() + 2592000;
        $http.get(url, config.zomatoConfig).then(
          function (response) {
            if (response.data) {
              console.log("TEMP 11: Restaurant | Fetching Data Success");
              var restaurants = response.data.nearby_restaurants;

              for (var i = 0; i < restaurants.length; i++) {
                if (
                  restaurantNameList.indexOf(restaurants[i].restaurant.name) ==
                  -1
                ) {
                  restaurantNameList.push(restaurants[i].restaurant.name);
                  restaurantList.push(restaurants[i]);
                }
              }

              if (restaurantList.length < 100) {
                checkIfListReach50(restaurantList.length);
              } else {
                saveData(restaurantList);
              }
            } else {
              console.log("nothing returned");
            }
          },
          function (error) {
            console.warn("ERROR: TEMP 11 | Nearby Restaurants");
          }
        );
      }

      function checkIfListReach50(restaurantListLength) {
        var currentTimeStamp = moment().unix() + 2592000;

        config.lat += 0.01;

        if (tempCount == restaurantListLength) {
          config.long += 0.01;
          counter++;
        } else {
          tempCount = restaurantListLength;
          counter = 0;
        }
        if (counter > 5) {
          saveData(restaurantList);
        } else {
          url =
            "https://developers.zomato.com/api/v2.1/geocode?lat=" +
            config.lat +
            "&lon=" +
            config.long;
          fetchRestaurantData(url);
        }
      }

      function saveData(dummy) {
        for (var i = 0; i < $scope.TemplateData.length; i++) {
          if ($scope.TemplateData[i].Template == "temp11") {
            $scope.TemplateData[i].TempData = dummy;
            $scope.TemplateData[i].hasData = true;
            $scope.TemplateData[i].lastQuery = Date.now();
            localStorage.setItem("restaurant-position", 0);
            break;
          }
        }
      }
    }
  });
}

function temp12GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp12" &&
      (!item.hasData || item.lastQuery < Date.now() - 5400000)
    ) {
      var city_parameter = "Manila";
      if (item.tempSrc.hasOwnProperty("source")) {
        city_parameter = item.tempSrc.source.split("/")[1];
        item.source = city_parameter;
      } else {
        item.source = city_parameter;
      }

      $http
        .get(
          "http://api.openweathermap.org/data/2.5/forecast/daily?id=1701668&APPID=9f534971ae41269da3bdca6da5ad3a67&q=" +
            city_parameter +
            "&cnt=7"
        )
        .then(function (response1) {
          $http
            .get(
              "http://api.openweathermap.org/data/2.5/weather?id=1701668&APPID=9f534971ae41269da3bdca6da5ad3a67&q=" +
                city_parameter
            )
            .then(
              function (response2) {
                console.log("TEMP 12: Weather | Fetching Data Success");
                for (var i = 0; i < $scope.TemplateData.length; i++) {
                  if (
                    $scope.TemplateData[i].Template == "temp12" &&
                    $scope.TemplateData[i].CampaignID == item.CampaignID
                  ) {
                    var dummy = [];
                    dummy.push(response1);
                    dummy.push(response2);
                    $scope.TemplateData[i].TempData = dummy;
                    $scope.TemplateData[i].hasData = true;
                    $scope.TemplateData[i].lastQuery = Date.now();
                    break;
                  }
                }
              },
              function (err) {
                console.warn("ERROR: TEMP 12 | Weather");
              }
            );
        });
    }
  });
}

function temp13GetData($http, $scope) {
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp13" &&
      (!item.hasData || item.lastQuery < Date.now() - 10800000)
    ) {
      $scope.TemplateData.forEach(function (item) {
        if (item.Template == "temp13") {
          item.TempData = [];

          $http
            .get(
              "https://openexchangerates.org/api/latest.json?app_id=d076ca0158a348679fdaee487dff191e"
            )
            .then(
              function (response1) {
                item.TempData.push(response1.data.rates);

                var yesterday = new Date(Date.now() - 86400000);

                var yes = formatDate(yesterday);

                $http
                  .get(
                    "https://openexchangerates.org/api/historical/" +
                      yes +
                      ".json?app_id=d076ca0158a348679fdaee487dff191e"
                  )
                  .then(
                    function (response2) {
                      console.log("TEMP 13: Currency | Fetching Data Success");
                      item.TempData.push(response2.data.rates);
                      item.hasData = true;
                      item.lastQuery = Date.now();
                    },
                    function (err) {
                      console.warn("ERROR: TEMP 13 | Currency Update");
                    }
                  );
              },
              function (err) {
                console.warn("ERROR: TEMP 13 | Currency Update");
              }
            );
        }
      });
    }
  });
}

function temp14GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp14" &&
      (!item.hasData || item.lastQuery < Date.now() - 5400000)
    ) {
      var search_keyword = "";
      var formatted_keyword = encodeURI(
        "http://13.250.103.104:4600/" + search_keyword
      );
      $http.get(formatted_keyword).then(
        function (response) {
          if (response.status == 200 && response.data[0].statuses.length != 0) {
            $scope.TemplateData.forEach(function (item) {
              console.log("TEMP 124: Twitter | Fetching Data Success");
              if (item.Template == "temp14") {
                item.TempData = response.data;
                item.lastTweet = 0;
                item.lastArray = 0;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            });
          }
        },
        function (err) {
          console.warn("ERROR: TEMP 14 | Twitter");
        }
      );
    }
  });
}

function temp15GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp15" &&
      (!item.hasData || item.lastQuery < Date.now() - 21600000)
    ) {
      $http
        .get(
          "http://ec2-54-169-234-246.ap-southeast-1.compute.amazonaws.com/api/v0/hugot.php"
        )
        .then(
          function (response) {
            $scope.TemplateData.forEach(function (item) {
              if (item.Template == "temp15") {
                console.log("TEMP 15: Hugot | Fetching Data Success");
                if (response.data.length > 0) {
                  item.TempData = response.data;
                  item.hasData = true;
                  item.lastQuery = Date.now();
                }
              }
            });
          },
          function (err) {
            console.warn("ERROR: TEMP 15 | Hugot");
          }
        );
    }
  });
}

function temp16GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp16" &&
      (!item.hasData || item.lastQuery < Date.now() - 86400000)
    ) {
      $http
        .get(
          "https://api.themoviedb.org/3/movie/upcoming?api_key=f2ebc8131c456f6ee2f134ac299aa40f&language=en&US"
        )
        .then(
          function (response) {
            $scope.TemplateData.forEach(function (item) {
              if (item.Template == "temp16") {
                console.log("TEMP 16: Upcoming Movies | Fetching Data Success");
                item.TempData = response.data;
                item.moviePosition = 0;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            });
          },
          function (err) {
            console.warn("ERROR: TEMP 16 | Upcoming Movies");
          }
        );
    }
  });
}

function temp17GetData($http, $scope) {
  // console.log('temp10');

  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp17" &&
      (!item.hasData || item.lastQuery < Date.now() - 14400000)
    ) {
      var dum = item.tempSrc.source.split("/");
      var source = dum[1];
      item.source = source;

      if (source == "local") {
        $http
          .get(
            "https://newsapi.org/v2/top-headlines?country=ph&apiKey=a3aa8dee6c814974b0cd33bd806ef301"
          )
          .then(
            function (response) {
              console.log("TEMP 17: News Portrait | Fetching Data Success");
              for (var i = 0; i < $scope.TemplateData.length; i++) {
                if (
                  $scope.TemplateData[i].Template == "temp17" &&
                  $scope.TemplateData[i].CampaignID == item.CampaignID
                ) {
                  $scope.TemplateData[i].TempData = response.data;
                  $scope.TemplateData[i].hasData = true;
                  $scope.TemplateData[i].currentPosition = 0;
                  $scope.TemplateData[i].lastQuery = Date.now();
                  break;
                }
              }
            },
            function (error) {
              console.warn("ERROR: TEMP 17 | News Portrait (Local)");
            }
          );
      } else {
        $http
          .get(
            "https://newsapi.org/v1/articles?source=" +
              source +
              "&sortBy=top&apiKey=a3aa8dee6c814974b0cd33bd806ef301"
          )
          .then(
            function (response) {
              console.log("TEMP 17: News Portrait | Fetching Data Success");
              for (var i = 0; i < $scope.TemplateData.length; i++) {
                if (
                  $scope.TemplateData[i].Template == "temp17" &&
                  $scope.TemplateData[i].CampaignID == item.CampaignID
                ) {
                  $scope.TemplateData[i].TempData = response.data;
                  $scope.TemplateData[i].hasData = true;
                  $scope.TemplateData[i].currentPosition = 0;
                  $scope.TemplateData[i].lastQuery = Date.now();
                  break;
                }
              }
            },
            function (error) {
              console.warn("ERROR: TEMP 17 | News Portrait (Foreign)");
            }
          );
      }
    }
  });
}

function temp18GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp18" &&
      (!item.hasData || item.lastQuery < Date.now() - 10800000)
    ) {
      $http
        .get(
          "http://api.openweathermap.org/data/2.5/forecast/daily?id=1701668&APPID=9f534971ae41269da3bdca6da5ad3a67&q=Manila&cnt=7"
        )
        .then(function (response1) {
          $http
            .get(
              "http://api.openweathermap.org/data/2.5/weather?id=1701668&APPID=9f534971ae41269da3bdca6da5ad3a67"
            )
            .then(
              function (response2) {
                console.log(
                  "TEMP 18: Weather Portrait | Fetching Data Success"
                );
                for (var i = 0; i < $scope.TemplateData.length; i++) {
                  if ($scope.TemplateData[i].Template == "temp18") {
                    var dummy = [];
                    dummy.push(response1);
                    dummy.push(response2);
                    $scope.TemplateData[i].TempData = dummy;
                    $scope.TemplateData[i].hasData = true;
                    $scope.TemplateData[i].lastQuery = Date.now();
                    break;
                  }
                }
              },
              function (error) {
                console.warn("ERROR: TEMP 18 | Currency Portrait");
              }
            );
        });
    }
  });
}

function temp19GetData($http, $scope) {
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp19" &&
      (!item.hasData || item.lastQuery < Date.now() - 3600000)
    ) {
      $scope.TemplateData.forEach(function (item) {
        if (item.Template == "temp19") {
          item.TempData = [];

          $http
            .get(
              "https://openexchangerates.org/api/latest.json?app_id=d076ca0158a348679fdaee487dff191e"
            )
            .then(
              function (response1) {
                console.log(
                  "TEMP 19: Currency Portrait | Fetching Data Success"
                );
                item.TempData.push(response1.data.rates);

                var yesterday = new Date(Date.now() - 86400000);

                var yes = formatDate(yesterday);

                $http
                  .get(
                    "https://openexchangerates.org/api/historical/" +
                      yes +
                      ".json?app_id=d076ca0158a348679fdaee487dff191e"
                  )
                  .then(
                    function (response2) {
                      item.TempData.push(response2.data.rates);
                      item.hasData = true;
                      item.lastQuery = Date.now();
                      console.log("Get Data Temp Data");
                      console.log(item);
                    },
                    function (error) {
                      console.warn("ERROR: TEMP 19 | Currency Portrait");
                    }
                  );
              },
              function (error) {
                console.warn("ERROR: TEMP 19 | Currency Portrait");
              }
            );
        }
      });
    }
  });
}

function temp20GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp20" &&
      (!item.hasData || item.lastQuery < Date.now() - 5400000)
    ) {
      var search_keyword = "";
      var formatted_keyword = encodeURI(
        "http://13.250.103.104:4600/" + search_keyword
      );
      $http.get(formatted_keyword).then(
        function (response) {
          console.log("TEMP 20: Twitter Portrait | Fetching Data Success");
          if (response.status == 200) {
            $scope.TemplateData.forEach(function (item) {
              if (item.Template == "temp14") {
                item.TempData = response.data;
                item.lastTweet = 0;
                item.lastArray = 0;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            });
          }
        },
        function (error) {
          console.warn("ERROR: TEMP 20 | Twitter Portrait");
        }
      );
    }
  });
}

function temp22GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp22" &&
      (!item.hasData || item.lastQuery < Date.now() - 21600000)
    ) {
      $http
        .get(
          "http://ec2-54-169-234-246.ap-southeast-1.compute.amazonaws.com/api/v0/hugot.php"
        )
        .then(
          function (response) {
            console.log("TEMP 22: Hugot Portrait | Fetching Data Success");
            $scope.TemplateData.forEach(function (item) {
              if (item.Template == "temp22") {
                item.TempData = response.data;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            });
          },
          function (error) {
            console.warn("ERROR: TEMP 22 | Hugot Portrait");
          }
        );
    }
  });
}

function temp23GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp23" &&
      (!item.hasData || item.lastQuery < Date.now() - 86400000)
    ) {
      var restaurantList = [];
      var restaurantNameList = [];
      var tempCount,
        counter = 0;

      var config = {
        lat: 14.609695,
        long: 121.0747,
        zomatoConfig: {
          headers: {
            "user-key": "1e3481187e26de091dfdb5f7f768312a",
            Accept: "application/json;odata=verbose",
          },
        },
      };

      config.url =
        "https://developers.zomato.com/api/v2.1/geocode?lat=" +
        config.lat +
        "&lon=" +
        config.long;

      fetchRestaurantData(config.url);

      function fetchRestaurantData(url) {
        var currentTimeStamp = moment().unix() + 2592000;
        $http.get(url, config.zomatoConfig).then(
          function (response) {
            console.log("TEMP 23: Restaurant Portrait| Fetching Data Success");

            if (response.data) {
              var restaurants = response.data.nearby_restaurants;

              for (var i = 0; i < restaurants.length; i++) {
                if (
                  restaurantNameList.indexOf(restaurants[i].restaurant.name) ==
                  -1
                ) {
                  restaurantNameList.push(restaurants[i].restaurant.name);
                  restaurantList.push(restaurants[i]);
                }
              }

              if (restaurantList.length < 5) {
                checkIfListReach50(restaurantList.length);
              } else {
                saveData(restaurantList);
              }
            } else {
              console.log("nothing returned");
            }
          },
          function (error) {
            console.warn("ERROR: TEMP 21 | Restaurant Portrait");
          }
        );
      }

      function checkIfListReach50(restaurantListLength) {
        var currentTimeStamp = moment().unix() + 2592000;

        config.lat += 0.01;

        if (tempCount == restaurantListLength) {
          config.long += 0.01;
          counter++;
        } else {
          tempCount = restaurantListLength;
          counter = 0;
        }

        if (counter > 5) {
          saveData(restaurantList);
        } else {
          url =
            "https://developers.zomato.com/api/v2.1/geocode?lat=" +
            config.lat +
            "&lon=" +
            config.long;
          fetchRestaurantData(url);
        }
      }

      function saveData(dummy) {
        for (var i = 0; i < $scope.TemplateData.length; i++) {
          if ($scope.TemplateData[i].Template == "temp23") {
            $scope.TemplateData[i].TempData = dummy;
            $scope.TemplateData[i].hasData = true;
            $scope.TemplateData[i].lastQuery = Date.now();
            localStorage.setItem("restaurant-position", 0);
            break;
          }
        }
      }
    }
  });
}

function temp24GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp24" &&
      (!item.hasData || item.lastQuery < Date.now() - 86400000)
    ) {
      $http
        .get(
          "https://api.themoviedb.org/3/movie/upcoming?api_key=f2ebc8131c456f6ee2f134ac299aa40f&language=en&US"
        )
        .then(function (response) {
          console.log("TEMP 24: Upcoming Movies | Fetching Data Success");
          $scope.TemplateData.forEach(function (item) {
            if (item.Template == "temp24") {
              item.TempData = response.data;
              console.log(response.data);
              item.moviePosition = 0;
              item.hasData = true;
              item.lastQuery = Date.now();
            }
          });
        });
    }
  });
}

function temp25GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp25" &&
      (!item.hasData || item.lastQuery < Date.now() - 3600000)
    ) {
      $http
        .get(
          "http://ec2-54-169-234-246.ap-southeast-1.compute.amazonaws.com/api/v0/ikomai_guest.php"
        )
        .then(
          function (response) {
            console.log("TEMP : Ikomai | Fetching Data Success");
            $scope.TemplateData.forEach(function (item) {
              if (item.Template == "temp25") {
                item.TempData = response.data;
                console.log(response.data);
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            });
          },
          function (err) {
            console.warn("ERROR: TEMP 25 | Ikomai Guest");
          }
        );
    }
  });
}

function temp26GetData($http, $scope) {
  $scope.new_source_ig = [];
  var dummyTemp = $scope.TemplateData;

  dummyTemp.forEach(function (item) {
    if (item.Template == "temp26") {
      $scope.new_source_ig = item.tempSrc.source.split("/");
    }
  });

  dummyTemp.forEach(function (item) {
    if ($scope.new_source_ig.length != 0) {
      if (item.Template == "temp26") {
        if (
          !item.hasData ||
          item.lastQuery < Date.now() - 300000 ||
          item.Source != $scope.new_source_ig[1]
        ) {
          var instagram_post = {
            username: $scope.new_source_ig[1],
            currentPosition: 0,
            postList: {},
            post_length: 0,
            display_limit: "auto",
            loopInterval: 10000,
            loop: true,
          };
          var user_info = {};

          var url =
            "https://stark-gorge-93872.herokuapp.com/" +
            instagram_post.username +
            "/?__a=1";

          $http.get(url).then(
            function (response) {
              console.log("TEMP 26: Instagram | Fetching Data Success");
              var arrOfData = [];
              var data = response.data;
              var temp = [];
              var counter = 0;
              arrOfData.push(data.user);

              for (var i = 0; i < data.user.media.nodes.length; i++) {
                if (instagram_post.display_limit === "auto") {
                  temp.push(data.user.media.nodes[i]);
                } else {
                  if (counter < instagram_post.display_limit) {
                    temp.push(data.user.media.nodes[i]);
                    counter++;
                  } else {
                    break;
                  }
                }
              }

              instagram_post.postList = temp;
              instagram_post.post_length = temp.length;
              arrOfData.push(instagram_post);
              saveData(arrOfData);
            },
            function (err) {
              console.warn("ERROR: TEMP 26 | Instagram");
            }
          );

          function saveData(data) {
            for (var i = 0; i < $scope.TemplateData.length; i++) {
              if ($scope.TemplateData[i].Template == "temp26") {
                $scope.TemplateData[i].Source = $scope.new_source_ig[1];
                $scope.TemplateData[i].TempData = data;
                $scope.TemplateData[i].currentPosition = 0;
                $scope.TemplateData[i].hasData = true;
                $scope.TemplateData[i].lastQuery = Date.now();
                break;
              }
            }
          } // end of function saveData
        } // end of ((!item.hasData || item.lastQuery < (Date.now()-3600000)) || item.Source != $scope.new_source_fb[1])
      } // end of if (item.Template=='temp27')
    } // end of if ($scope.new_source_ig.length != 0)
  }); // end of dummyTemp.forEach(function(item)
} // end of temp26GetData($http, $scope)

function temp27GetData($http, $scope) {
  $scope.new_source_fb = [];

  var dummyTemp = $scope.TemplateData;

  dummyTemp.forEach(function (item) {
    if ($scope.new_source_fb.length != 0 || 1) {
      if (item.Template == "temp27") {
        $scope.new_source_fb = item.tempSrc.source.split("/");

        if (!item.hasData || item.lastQuery < Date.now() - 3600000) {
          var fb_post = {
            access_token:
              "EAAGXpZCE7eaUBAOgiHouservfFztglfZCf0vZCbZAjbuC7VUwuAIig3ZAKgn6Kkt4kZB4XXXDcYsjmwfzpgldAEfSYqYp9t7ZCbuvZB0FI2JpPuNMaqf60EDhY8GnvKbaWEyKmS0ZBRDch7Uv0nylVOdrAdkBy5rHCMIpQADtLBNzeIiK8BZBdunidCmOOZAH61HXkZD",
            page_id: $scope.new_source_fb[1],
            api_version: "v3.3",
            currentPosition: 0,
            postList: {},
            post_length: 0,
            fb_limit: 30,
            display_limit: 10,
            has_comment: false,
            loopInterval: 10000,
            loop: true,
          };
          var page_info = {};
          var interval35, interval36;
          var arrOfData = [];
          var pos = Math.floor(Math.random() * 6);

          var url =
            "https://graph.facebook.com/" +
            fb_post.page_id +
            "?fields=name,fan_count,picture.width(100)&access_token=" +
            fb_post.access_token;

          $http
            .get(url)
            .then(function (response) {
              console.log("TEMP 27: Facebook Post | Fetching Data Success");
              if (response.data) {
                var data = response.data;
                page_info.name = data.name;
                page_info.page_likes = data.fan_count;
                page_info.picture = data.picture.data.url;
                arrOfData.push(page_info);
                console.log(url);
                console.log("getting first fb data");

                var url =
                  "https://graph.facebook.com/" +
                  fb_post.api_version +
                  "/" +
                  fb_post.page_id +
                  "/feed?fields=id,message,full_picture,shares.summary(true).as(reactions_shares).limit(0),comments.summary(true).limit(0).as(reactions_comments),reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like),reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad),reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry),reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love),reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow),reactions.type(HAHA).limit(0).summary(total_count).as(reactions_haha)&limit=" +
                  fb_post.fb_limit +
                  "&access_token=" +
                  fb_post.access_token;

                $http
                  .get(url)
                  .then(function (response) {
                    console.log(
                      "TEMP 27: Facebook Post | Fetching Data Success"
                    );
                    if (response.data) {
                      var data = response.data;
                      var temp = [];
                      var counter = 0;
                      console.log(url);
                      console.log("getting second fb data");

                      for (var i = 0; i < data.data.length; i++) {
                        if ("full_picture" in data.data[i]) {
                          if (counter < fb_post.display_limit) {
                            temp.push(data.data[i]);
                            counter++;
                          }
                        }
                      }
                      fb_post.postList = temp;
                      fb_post.post_length = temp.length;

                      arrOfData.push(fb_post);
                      saveData(arrOfData);
                    } else {
                      console.log("failed to get facebook data");
                    }
                  })

                  .catch(function (err) {
                    // handle error
                    console.log(
                      "error occured getting the facebook post 2",
                      err
                    );
                  });
              } else {
                console.log("failed to get facebook data");
              }
            })
            .catch(function (err) {
              // handle error
              console.log("error occured getting the facebook post 1", err);
            });

          function saveData(data) {
            for (var i = 0; i < $scope.TemplateData.length; i++) {
              if (
                $scope.TemplateData[i].Template == "temp27" &&
                $scope.TemplateData[i].CampaignID == item.CampaignID
              ) {
                $scope.TemplateData[i].Source = $scope.new_source_fb[1];
                // $scope.TemplateData[i].Source =
                $scope.TemplateData[i].TempData = data;
                $scope.TemplateData[i].currentPosition = 0;
                $scope.TemplateData[i].hasData = true;
                $scope.TemplateData[i].lastQuery = Date.now();
                break;
              }
            }

            // for(var i=0; i<$scope.TemplateData.length; i++){
            // 	if($scope.TemplateData[i].Template == 'temp10' && $scope.TemplateData[i].CampaignID == item.CampaignID){
            // 		$scope.TemplateData[i].TempData = response.data;
            // 		$scope.TemplateData[i].hasData = true;
            // 		$scope.TemplateData[i].lastQuery = Date.now();
            // 		// $scope.TemplateData[i].source = source;
            // 		console.log('Get Data Temp Data');
            // 		console.log($scope.TemplateData);
            // 		break;
            // 	}
          } // end of function saveData
        } // end of !item.hasData||item.lastQuery < (Date.now()-3600000) || item.Source1 != $scope.new_source_fb[1]
      } // end of (item.Template=='temp27')
    } //end of length if $scope.new_source_fb.length != 0
  }); // enf of dummyTemp.forEach(function(item)
} //end of the temp27GetData($http, $scope)

function temp28GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp28" &&
      (!item.hasData || item.lastQuery < Date.now() - 3600000)
    ) {
      var access_token =
        "EAADZBXIds1zwBADjMTCIwthGP7jEGguv3whJSI3TucMMBVFFkI7BC0ZBQKVH44F2oMuQtZB15NRdJxKBqbxTjii3SUhVjh7HXHJpR69NaOrnsvCkAzJ82ERdPMrs3uALWEjH9OkjESKzQdqZBx63OhaFzagZB4DUTCOEMShLouQZDZD";
      var events = {
        url:
          "https://graph.facebook.com/search?q=manila&type=event&limit=100&access_token=" +
          access_token,
        eventList: {},
        currentPosition: 1,
        eventListLength: 0,
        loopInterval: 15000,
        loop: true,
        latitude: 12.8797,
        longitude: 121.774,
      };

      console.log("GETTING TEMP 28");

      function getEvents() {
        $http.get(events.url).then(function (response) {
          console.log("TEMP 28: Facebook Events | Fetching Data Success");

          if (response.data.data.length > 0) {
            console.log("GET A RESPONSE AT TEMP 28");
            saveData(response);
          } else {
            console.log("nothing returned");
          }
        });
      }

      function saveData(data) {
        console.log("SAVING TEMP 28 DATA");
        for (var i = 0; i < $scope.TemplateData.length; i++) {
          if ($scope.TemplateData[i].Template == "temp28") {
            $scope.TemplateData[i].TempData = data.data;
            $scope.TemplateData[i].currentPosition = 0;
            $scope.TemplateData[i].hasData = true;
            $scope.TemplateData[i].lastQuery = Date.now();
            break;
          }
        }
      } // end of function saveData

      getEvents();
    }
  });
}

function temp29GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp29" &&
      (!item.hasData || item.lastQuery < Date.now() - 86400000)
    ) {
      function get_access_token() {
        $http
          .get("http://aircast-tool.herokuapp.com/api/spotify-token")
          .then(function (response) {
            if (response.data) {
              console.log("TEMP 29: Spotify | Fetching Data Success");
              get_result(response.data);
            } else {
              console.log("nothing returned on temp 29");
            }
          })
          .catch(function () {
            // handle error
            console.log("error in temp 29 - spotify music template");
          });
      }

      function get_result(access_token) {
        var url =
          "https://api.spotify.com/v1/recommendations?seed_tracks=0c6xIDDpzE81m2q797ordA&min_energy=0.4&seed_artists=4NHQUGzhtTLFvgF5SZesLK&max_popularity=80&limit=100&min_popularity=50&market=PH&access_token=" +
          access_token.access_token;

        $http
          .get(url)
          .then(function (response) {
            if (response.data.tracks.length > 0) {
              sortSpotifyData(response.data);
            } else {
              console.log("nothing returned on temp 29");
            }
          })
          .catch(function () {
            // handle error
            console.log("error in temp 29 - spotify music template");
          });
      }

      function sortSpotifyData(data) {
        var arr = [];

        for (var i = 0; i < data.tracks.length; i++) {
          if (data.tracks[i].preview_url != null) {
            arr.push(data.tracks[i]);
          }
        }

        for (var i = 0; i < $scope.TemplateData.length; i++) {
          if ($scope.TemplateData[i].Template == "temp29") {
            $scope.TemplateData[i].TempData = arr;
            $scope.TemplateData[i].currentPosition = 0;
            $scope.TemplateData[i].hasData = true;
            $scope.TemplateData[i].lastQuery = Date.now();
            break;
          }
        } // end of for loop
      }

      get_access_token();
    } // end of if(item.Template=='temp29'&&(!item.hasData||item.lastQuery < (Date.now()-86400000))){
  }); // end of $scope.TemplateData.forEach(function(item){
} // end of the temp29

function temp30GetData($http, $scope) {
  $scope.new_source_fb = [];

  var dummyTemp = $scope.TemplateData;

  dummyTemp.forEach(function (item) {
    if ($scope.new_source_fb.length != 0 || 1) {
      if (item.Template == "temp30") {
        if (!item.hasData || item.lastQuery < Date.now() - 900000) {
          var url =
            "http://aircast-tool.herokuapp.com/api/read-fb-selected-post";
          $http
            .get(url)
            .then(function (response) {
              console.log(
                "TEMP 30: Facebook Selected Post | Fetching Data Success"
              );
              if (response.data.length > 0) {
                console.log(response.data);
                saveData(response.data);
              } else {
                console.log("nothing returned on temp 30");
              }
            })
            .catch(function () {
              // handle error
              console.log("error in temp 30 - facebook selected post");
            });

          function saveData(data) {
            for (var i = 0; i < $scope.TemplateData.length; i++) {
              if (
                $scope.TemplateData[i].Template == "temp30" &&
                $scope.TemplateData[i].CampaignID == item.CampaignID
              ) {
                console.log("saving");
                // $scope.TemplateData[i].Source =
                $scope.TemplateData[i].TempData = data;
                $scope.TemplateData[i].currentPosition = 0;
                $scope.TemplateData[i].hasData = true;
                $scope.TemplateData[i].lastQuery = Date.now();
                break;
              }
            }
          } // end of function saveData
        } // end of !item.hasData||item.lastQuery < (Date.now()-3600000) || item.Source1 != $scope.new_source_fb[1]
      } // end of (item.Template=='temp27')
    } //end of length if $scope.new_source_fb.length != 0
  }); // enf of dummyTemp.forEach(function(item)
} //end of the temp27GetData($http, $scope)

function temp31GetData($http, $scope) {
  $scope.new_source_ig = [];
  var dummyTemp = $scope.TemplateData;

  dummyTemp.forEach(function (item) {
    if (item.Template == "temp31") {
      $scope.new_source_ig = item.tempSrc.source.split("/");
    }
  });

  dummyTemp.forEach(function (item) {
    if ($scope.new_source_ig.length != 0) {
      if (item.Template == "temp31") {
        if (
          !item.hasData ||
          item.lastQuery < Date.now() - 600000 ||
          item.Source != $scope.new_source_ig[1]
        ) {
          console.log($scope.new_source_ig[1]);

          var param = $scope.new_source_ig[1];

          var instagram_post = {
            hashtag: param.toLowerCase(),
            currentPosition: 0,
            count: 30,
            postList: {},
          };

          var url =
            "https://www.instagram.com/explore/tags/" +
            instagram_post.hashtag +
            "/?__a=1";

          $http
            .get(url)
            .then(function (response) {
              console.log("TEMP 31: Instagram Hashtag | Fetching Data Success");
              if (
                response.status == 200 &&
                response.data.graphql.hashtag.edge_hashtag_to_media.edges
                  .length > 0
              ) {
                instagram_post.postList =
                  response.data.graphql.hashtag.edge_hashtag_to_media.edges;

                saveData(instagram_post.postList);
              } else {
                console.log("Error getting instagram by hashtag");
              }
            })
            .catch(function () {
              console.log("Error getting instagram by hashtag. Internal error");
            });

          function saveData(data) {
            for (var i = 0; i < $scope.TemplateData.length; i++) {
              if ($scope.TemplateData[i].Template == "temp31") {
                $scope.TemplateData[i].Source = param;
                $scope.TemplateData[i].TempData = data;
                $scope.TemplateData[i].currentPosition = 0;
                $scope.TemplateData[i].hasData = true;
                $scope.TemplateData[i].lastQuery = Date.now();
                break;
              }
            }
          } // end of function saveData
        } // end of ((!item.hasData || item.lastQuery < (Date.now()-3600000)) || item.Source != $scope.new_source_fb[1])
      } // end of if (item.Template=='temp27')
    } // end of if ($scope.new_source_ig.length != 0)
  }); // end of dummyTemp.forEach(function(item)
} // end of temp26GetData($http, $scope)

function temp32GetData($http, $scope) {
  $scope.new_source_fb = [];

  var dummyTemp = $scope.TemplateData;

  dummyTemp.forEach(function (item) {
    if ($scope.new_source_fb.length != 0 || 1) {
      if (item.Template == "temp32") {
        $scope.new_source_fb = item.tempSrc.source.split("/");

        if (!item.hasData || item.lastQuery < Date.now() - 3600000) {
          var fb_post = {
            access_token:
              "EAAGXpZCE7eaUBAOgiHouservfFztglfZCf0vZCbZAjbuC7VUwuAIig3ZAKgn6Kkt4kZB4XXXDcYsjmwfzpgldAEfSYqYp9t7ZCbuvZB0FI2JpPuNMaqf60EDhY8GnvKbaWEyKmS0ZBRDch7Uv0nylVOdrAdkBy5rHCMIpQADtLBNzeIiK8BZBdunidCmOOZAH61HXkZD",
            page_id: $scope.new_source_fb[1],
            api_version: "v3.3",
            currentPosition: 0,
            postList: {},
            post_length: 0,
            fb_limit: 30,
            display_limit: 10,
            has_comment: false,
            loopInterval: 10000,
            loop: true,
          };
          var page_info = {};
          var interval35, interval36;
          var arrOfData = [];

          var url =
            "https://graph.facebook.com/" +
            fb_post.page_id +
            "?fields=name,fan_count,picture.width(100)&access_token=" +
            fb_post.access_token;

          $http
            .get(url)
            .then(function (response) {
              console.log(
                "TEMP 32: Facebook Full Screen | Fetching Data Success"
              );
              if (response.data) {
                var data = response.data;
                page_info.name = data.name;
                page_info.page_likes = data.fan_count;
                page_info.picture = data.picture.data.url;
                arrOfData.push(page_info);
                console.log(url);
                console.log("getting first fb data");

                var url =
                  "https://graph.facebook.com/" +
                  fb_post.api_version +
                  "/" +
                  fb_post.page_id +
                  "/feed?fields=id,message,full_picture,shares.summary(true).as(reactions_shares).limit(0),comments.summary(true).limit(0).as(reactions_comments),reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like),reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad),reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry),reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love),reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow),reactions.type(HAHA).limit(0).summary(total_count).as(reactions_haha)&limit=" +
                  fb_post.fb_limit +
                  "&access_token=" +
                  fb_post.access_token;

                $http
                  .get(url)
                  .then(function (response) {
                    console.log(
                      "TEMP 32: Facebook Full Screen | Fetching Data Success"
                    );
                    if (response.data) {
                      var data = response.data;
                      var temp = [];
                      var counter = 0;
                      console.log(url);
                      console.log("getting second fb data");

                      for (var i = 0; i < data.data.length; i++) {
                        if ("full_picture" in data.data[i]) {
                          if (counter < fb_post.display_limit) {
                            temp.push(data.data[i]);
                            counter++;
                          }
                        }
                      }
                      fb_post.postList = temp;
                      fb_post.post_length = temp.length;

                      arrOfData.push(fb_post);
                      saveData(arrOfData);
                    } else {
                      console.log("failed to get facebook data");
                    }
                  })

                  .catch(function (err) {
                    // handle error
                    console.log(
                      "error occured getting the facebook post 2",
                      err
                    );
                  });
              } else {
                console.log("failed to get facebook data");
              }
            })
            .catch(function (err) {
              // handle error
              console.log("error occured getting the facebook post 1", err);
            });

          function saveData(data) {
            for (var i = 0; i < $scope.TemplateData.length; i++) {
              if (
                $scope.TemplateData[i].Template == "temp32" &&
                $scope.TemplateData[i].CampaignID == item.CampaignID
              ) {
                $scope.TemplateData[i].Source = $scope.new_source_fb[1];
                // $scope.TemplateData[i].Source =
                $scope.TemplateData[i].TempData = data;
                $scope.TemplateData[i].currentPosition = 0;
                $scope.TemplateData[i].hasData = true;
                $scope.TemplateData[i].lastQuery = Date.now();
                break;
              }
            }

            // for(var i=0; i<$scope.TemplateData.length; i++){
            // 	if($scope.TemplateData[i].Template == 'temp10' && $scope.TemplateData[i].CampaignID == item.CampaignID){
            // 		$scope.TemplateData[i].TempData = response.data;
            // 		$scope.TemplateData[i].hasData = true;
            // 		$scope.TemplateData[i].lastQuery = Date.now();
            // 		// $scope.TemplateData[i].source = source;
            // 		console.log('Get Data Temp Data');
            // 		console.log($scope.TemplateData);
            // 		break;
            // 	}
          } // end of function saveData
        } // end of !item.hasData||item.lastQuery < (Date.now()-3600000) || item.Source1 != $scope.new_source_fb[1]
      } // end of (item.Template=='temp32')
    } //end of length if $scope.new_source_fb.length != 0
  }); // enf of dummyTemp.forEach(function(item)
} //end of the temp32GetData($http, $scope)

function temp33GetData($http, $scope) {
  $scope.new_source_fb = [];

  var dummyTemp = $scope.TemplateData;

  dummyTemp.forEach(function (item) {
    if ($scope.new_source_fb.length != 0 || 1) {
      if (item.Template == "temp33") {
        $scope.new_source_fb = item.tempSrc.source.split("/");
        //console.log($scope.new_source_fb);

        if (!item.hasData || item.lastQuery < Date.now() - 3600000) {
          var fb_post = {
            access_token:
              "EAAGXpZCE7eaUBAOgiHouservfFztglfZCf0vZCbZAjbuC7VUwuAIig3ZAKgn6Kkt4kZB4XXXDcYsjmwfzpgldAEfSYqYp9t7ZCbuvZB0FI2JpPuNMaqf60EDhY8GnvKbaWEyKmS0ZBRDch7Uv0nylVOdrAdkBy5rHCMIpQADtLBNzeIiK8BZBdunidCmOOZAH61HXkZD",
            page_id: $scope.new_source_fb[1],
            api_version: "v3.3",
            currentPosition: 0,
            postList: {},
            post_length: 0,
            fb_limit: 30,
            display_limit: 10,
            has_comment: false,
            loopInterval: 10000,
            loop: true,
          };
          var page_info = {};
          var interval35, interval36;
          var arrOfData = [];

          var url =
            "https://graph.facebook.com/" +
            fb_post.page_id +
            "?fields=name,fan_count,picture.width(100)&access_token=" +
            fb_post.access_token;

          $http
            .get(url)
            .then(function (response) {
              console.log(
                "TEMP 33: Facebook Full Screen with Reaction | Fetching Data Success"
              );
              if (response.data) {
                var data = response.data;
                page_info.name = data.name;
                page_info.page_likes = data.fan_count;
                page_info.picture = data.picture.data.url;
                arrOfData.push(page_info);
                console.log(url);
                console.log("getting first fb data");

                var url =
                  "https://graph.facebook.com/" +
                  fb_post.api_version +
                  "/" +
                  fb_post.page_id +
                  "/feed?fields=id,message,full_picture,shares.summary(true).as(reactions_shares).limit(0),comments.summary(true).limit(0).as(reactions_comments),reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like),reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad),reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry),reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love),reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow),reactions.type(HAHA).limit(0).summary(total_count).as(reactions_haha)&limit=" +
                  fb_post.fb_limit +
                  "&access_token=" +
                  fb_post.access_token;

                $http
                  .get(url)
                  .then(function (response) {
                    if (response.data) {
                      var data = response.data;
                      var temp = [];
                      var counter = 0;
                      console.log(url);
                      console.log("getting second fb data");

                      for (var i = 0; i < data.data.length; i++) {
                        if ("full_picture" in data.data[i]) {
                          if (counter < fb_post.display_limit) {
                            temp.push(data.data[i]);
                            counter++;
                          }
                        }
                      }
                      fb_post.postList = temp;
                      fb_post.post_length = temp.length;

                      arrOfData.push(fb_post);
                      saveData(arrOfData);
                    } else {
                      console.log("failed to get facebook data");
                    }
                  })

                  .catch(function (err) {
                    // handle error
                    console.log(
                      "error occured getting the facebook post 2",
                      err
                    );
                  });
              } else {
                console.log("failed to get facebook data");
              }
            })
            .catch(function (err) {
              // handle error
              console.log("error occured getting the facebook post 1", err);
            });

          function saveData(data) {
            for (var i = 0; i < $scope.TemplateData.length; i++) {
              if (
                $scope.TemplateData[i].Template == "temp33" &&
                $scope.TemplateData[i].CampaignID == item.CampaignID
              ) {
                console.log("saving");
                console.log($scope.TemplateData[i].CampaignID);
                console.log($scope.new_source_fb[1]);
                $scope.TemplateData[i].Source = $scope.new_source_fb[1];
                // $scope.TemplateData[i].Source =
                $scope.TemplateData[i].TempData = data;
                $scope.TemplateData[i].currentPosition = 0;
                $scope.TemplateData[i].hasData = true;
                $scope.TemplateData[i].background =
                  $scope.new_source_fb[2] || "white";
                $scope.TemplateData[i].lastQuery = Date.now();
                break;
              }
            }

            // for(var i=0; i<$scope.TemplateData.length; i++){
            // 	if($scope.TemplateData[i].Template == 'temp10' && $scope.TemplateData[i].CampaignID == item.CampaignID){
            // 		$scope.TemplateData[i].TempData = response.data;
            // 		$scope.TemplateData[i].hasData = true;
            // 		$scope.TemplateData[i].lastQuery = Date.now();
            // 		// $scope.TemplateData[i].source = source;
            // 		console.log('Get Data Temp Data');
            // 		console.log($scope.TemplateData);
            // 		break;
            // 	}
          } // end of function saveData
        } // end of !item.hasData||item.lastQuery < (Date.now()-3600000) || item.Source1 != $scope.new_source_fb[1]
      } // end of (item.Template=='temp27')
    } //end of length if $scope.new_source_fb.length != 0
  }); // enf of dummyTemp.forEach(function(item)
} //end of the temp27GetData($http, $scope)

function temp34GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (item.Template == "temp34") {
      var fb_post = {
        access_token:
          "EAAGXpZCE7eaUBAOgiHouservfFztglfZCf0vZCbZAjbuC7VUwuAIig3ZAKgn6Kkt4kZB4XXXDcYsjmwfzpgldAEfSYqYp9t7ZCbuvZB0FI2JpPuNMaqf60EDhY8GnvKbaWEyKmS0ZBRDch7Uv0nylVOdrAdkBy5rHCMIpQADtLBNzeIiK8BZBdunidCmOOZAH61HXkZD",
      };

      console.log("facebook live query");

      console.log(item);
      var dum = item.tempSrc.source.split("/");
      console.log(dum);
      var source = dum[1].split("*");
      var page_id = source[0];
      var video_id = source[1];
      var status = source[2];
      var pageInfo = {};
      console.log("PAGE ID: ", page_id);
      console.log("STATUS: ", status);

      console.log(item.hasLoaded);

      if (!item.hasData) {
        var url =
          "https://graph.facebook.com/" +
          page_id +
          "?fields=name,fan_count,picture.width(500)&access_token=" +
          fb_post.access_token;

        console.log("LIVE CURRENTLY PLAYING");

        $http.get(url).then(function (response) {
          console.log("TEMP 34: Facebook Live | Fetching Data Success");
          console.log("PAGE DETAILS");
          console.log(response.data);
          pageInfo = response.data;

          for (var i = 0; i < $scope.TemplateData.length; i++) {
            if (
              $scope.TemplateData[i].Template == "temp34" &&
              $scope.TemplateData[i].CampaignID == item.CampaignID
            ) {
              $scope.TemplateData[i].hasData = true;
              $scope.TemplateData[i].page_id = page_id;
              $scope.TemplateData[i].video_id = video_id;
              $scope.TemplateData[i].status = 1;
              $scope.TemplateData[i].pageInfo = pageInfo;
              $scope.TemplateData[i].hasShownLoader = 0;
              $scope.TemplateData[i].pageName = page_id;
              $scope.TemplateData[i].CampaignID = item.CampaignID;

              break;
            }
          }
        });
      }

      if (status == "0") {
        console.log("LIVE CURRENTLY STOP");

        for (var i = 0; i < $scope.TemplateData.length; i++) {
          if (
            $scope.TemplateData[i].Template == "temp34" &&
            $scope.TemplateData[i].CampaignID == item.CampaignID
          ) {
            $scope.TemplateData[i].status = 0;
            console.log("UPDATING STATUS TO ZERO: ", $scope.TemplateData[i]);
            break;
          }
        }
      }
    }
  });
}

function temp35GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp35" &&
      (!item.hasData || item.lastQuery < Date.now() - 21600000)
    ) {
      $http
        .get(
          "http://ec2-54-169-234-246.ap-southeast-1.compute.amazonaws.com/api/v0/hugot.php"
        )
        .then(
          function (response) {
            $scope.TemplateData.forEach(function (item) {
              if (item.Template == "temp35") {
                var dum = item.tempSrc.source.split("/");
                console.log(dum);
                dum.shift();
                var c = dum.join("/");
                var a = c.split("*");
                item.site = a[0];
                item.duration = a[1];
                console.log("TEMP 35: URL CONTENT | Fetching Data Success");
                item.TempData = response.data;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            });
          },
          function (err) {
            console.warn("ERROR: TEMP 35 | Hugot");
          }
        );
    }
  });
}

function temp36GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp36" &&
      (!item.hasData || item.lastQuery < Date.now() - 21600000)
    ) {
      $http.get("http://13.250.103.104:3500/get-aircast-values").then(
        function (response) {
          $scope.TemplateData.forEach(function (item) {
            if (item.Template == "temp36") {
              console.log("TEMP 36: Aircast-Values | Fetching Data Success");
              if (response.data.success && response.data.data.length > 0) {
                item.Content = response.data.data;
                item.position = 0;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            }
          });
        },
        function (err) {
          console.warn("ERROR: TEMP 36 | Aircast-Values");
        }
      );
    }
  });
}

function temp38GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp38" &&
      (!item.hasData || item.lastQuery < Date.now() - 7200000)
    ) {
      $http.get("http://api.gp-nagata.ph/v0/covid19").then(
        function (response) {
          $scope.TemplateData.forEach(function (item) {
            if (item.Template == "temp38") {
              console.log(
                "TEMP 38: COVID-19 PH Data Tracker | Fetching Data Success"
              );
              if (response.status == 200 && response.data) {
                item.Data = response.data;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            }
          });
        },
        function (err) {
          console.warn("ERROR: TEMP 38 | COVID-19 Tracker (Landscape)");
        }
      );
    }
  });
}

function temp39GetData($http, $scope) {
  $scope.TemplateData.forEach(function (item) {
    if (
      item.Template == "temp39" &&
      (!item.hasData || item.lastQuery < Date.now() - 7200000)
    ) {
      $http.get("https://api.covid19api.com/summary").then(
        function (response) {
          $scope.TemplateData.forEach(function (item) {
            if (item.Template == "temp39") {
              console.log(
                "TEMP 39: COVID-19 Per City Data Tracker | Fetching Data Success"
              );
              if (response.status == 200 && response.data) {
                item.Data = response.data;
                item.hasData = true;
                item.lastQuery = Date.now();
              }
            }
          });
        },
        function (err) {
          console.warn("ERROR: TEMP 39 | COVID-19 Per City Data Tracker");
        }
      );
    }
  });
}
