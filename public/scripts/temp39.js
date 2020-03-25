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
      console.log($scope.COVID19);
    }
  }

  $timeout(callback, duration);
}
