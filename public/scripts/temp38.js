function temp38Controller(
  $scope,
  $window,
  $timeout,
  $http,
  tempSrc,
  callback,
  $q
) {
  var duration = 15000;
  var covid = {
    data: {},
    asOf: ""
  };
  var sponsor;
  var sponsorContents = "";

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
      covid.asOf = $scope.TemplateData[i].Data.as_of;
      sponsor = $scope.TemplateData[i].tempSrc.source.split("/")[1];
      $scope.COVID19 = covid;

      if (sponsor) {
        sponsorContents +=
          '<div class="sponsor-image-item"><img class="sponsor-image" src="https://s3-ap-southeast-1.amazonaws.com/rpitv/Aircast/' +
          sponsor +
          '" /></div>';
      }

      sponsorContents +=
        '<div class="sponsor-image-item"><img class="sponsor-image" src="/assets/aircast-logo-white.png" /></div>';

      $("#sponsors").html(sponsorContents);

      pageInterval = setInterval(function() {
        $("#data").fadeOut(250, function() {
          $("#sponsor").fadeIn(250);
        });
      }, 11500);
    }
  }

  $timeout(function() {
    clearInterval(pageInterval);
    callback();
  }, duration);
}
