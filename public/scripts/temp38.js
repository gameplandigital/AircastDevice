function temp38Controller(
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
    asOf: ""
  };

  for (var i = 0; i < $scope.TemplateData.length; i++) {
    if ($scope.TemplateData[i].Template == "temp38") {
      var data = {
        cdr: $scope.TemplateData[i].Data.cdr,
        ageRange: $scope.TemplateData[i].Data.ageRange,
        sex: $scope.TemplateData[i].Data.sex,
        locations: $scope.TemplateData[i].Data.locations
          .sort((a, b) => (a.count < b.count ? 1 : -1))
          .filter(location => location.loc != "?"),
        locationForValidation: $scope.TemplateData[i].Data.locations.find(
          location => location.loc === "?"
        ),
        hospitals: $scope.TemplateData[i].Data.hospitals
      };
      covid.data = data;
      $scope.COVID19 = covid;
      console.log($scope.COVID19);
    }
  }

  $timeout(callback, duration);
}
