function temp39Controller(
  $scope,
  $window,
  $timeout,
  $http,
  tempSrc,
  callback,
  $q
) {
  var duration = 30000;
  var covid = {
    data: {},
    city: "",
    asOf: ""
  };

  for (var i = 0; i < $scope.TemplateData.length; i++) {
    if ($scope.TemplateData[i].Template == "temp39") {
      var data = {
        cdr: $scope.TemplateData[i].Data.cdr
      };
      covid.data = data;
      covid.city = $scope.TemplateData[i].tempSrc.source.split("/")[1];
      covid.asOf = $scope.TemplateData[i].Data.as_of;
      $scope.COVID19 = covid;
      console.log(covid.city);
      switch (covid.city) {
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
    }
  }

  $timeout(callback, duration);
}
