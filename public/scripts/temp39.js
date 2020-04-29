function temp39Controller(
  $scope,
  $window,
  $timeout,
  $http,
  tempSrc,
  callback,
  $q
) {
  var duration = 15000;
  var pageNextTimeout;
  var sponsorNextinterval1, sponsorNextinterval2;
  var sponsor;

  for (var i = 0; i < $scope.TemplateData.length; i++) {
    if ($scope.TemplateData[i].Template == "temp39") {
      $scope.globalData = $scope.TemplateData[i].Data["Global"];
      city = $scope.TemplateData[i].tempSrc.source.split("/")[1];
      sponsor = $scope.TemplateData[i].tempSrc.source.split("/")[2];
      $scope.date = new Date($scope.TemplateData[i].Data["Date"])
        .toString()
        .substring(0, 15);
      countries = $scope.TemplateData[i].Data["Countries"];

      for (var key in countries) {
        if (countries[key].Country === "Philippines") {
          $scope.phData = countries[key];
          break;
        }
      }

      switch (city) {
        case "City of Manila":
          $scope.cityImage = "city-of-manila";
          break;
        case "Mandaluyong City":
          $scope.cityImage = "mandaluyong-city";
          break;
        case "Marikina City":
          $scope.cityImage = "marikina-city";
          break;
        case "Pasig City":
          $scope.cityImage = "pasig-city";
          break;
        case "Quezon City":
          $scope.cityImage = "quezon-city";
          break;
        case "San Juan City":
          $scope.cityImage = "san-juan-city";
          break;
        case "Caloocan City":
          $scope.cityImage = "caloocan-city";
          break;
        case "Malabon City":
          $scope.cityImage = "malabon-city";
          break;
        case "Navotas City":
          $scope.cityImage = "navotas-city";
          break;
        case "Valenzuela City":
          $scope.cityImage = "valenzuela-city";
          break;
        case "Las Piñas City":
          $scope.cityImage = "las-pinas-city";
          break;
        case "Makati City":
          $scope.cityImage = "makati-city";
          break;
        case "Muntinlupa City":
          $scope.cityImage = "muntinlupa-city";
          break;
        case "Parañaque City":
          $scope.cityImage = "paranaque-city";
          break;
        case "Pasay City":
          $scope.cityImage = "pasay-city";
          break;
        case "Taguig City":
          $scope.cityImage = "taguig-city";
          break;
        case "Rizal":
          $scope.cityImage = "rizal";
          break;
        case "Cavite":
          $scope.cityImage = "cavite";
          break;
        case "Laguna":
          $scope.cityImage = "laguna";
          break;
        case "Bulacan":
          $scope.cityImage = "bulacan";
          break;
        default:
          $scope.cityImage = "default";
          break;
      }

      if (sponsor) {
        $("#sponsor-image-2").attr(
          "src",
          "https://s3-ap-southeast-1.amazonaws.com/rpitv/Aircast/" + sponsor
        );
        $("#sponsor-image-4").attr(
          "src",
          "https://s3-ap-southeast-1.amazonaws.com/rpitv/Aircast/" + sponsor
        );
      }

      sponsorNextinterval1 = setInterval(function () {
        $("#sponsor-image-1").fadeOut(250, function () {
          $("#sponsor-image-2").fadeIn(250);
        });
      }, 3375);

      pageNextTimeout = setTimeout(function () {
        clearInterval(sponsorNextinterval1);
        $("#global").fadeOut(250, function () {
          $("#ph").fadeIn(250);

          sponsorNextinterval2 = setInterval(function () {
            $("#sponsor-image-3").fadeOut(250, function () {
              $("#sponsor-image-4").fadeIn(250);
            });
          }, 3375);
        });
      }, 7250);
    }
  }

  $timeout(function () {
    clearTimeout(pageNextTimeout);
    clearInterval(sponsorNextinterval2);
    callback();
  }, duration);
}
