function temp1Controller($scope, $window, $timeout, $http, temp1Src, callback) {
  var CampaignID = $scope.currentPlayingCampaignID;
  document.getElementById("programmatic_div").innerHTML =
    '<iframe src="/programmatic/' +
    CampaignID +
    '" style="width: 100vw; height: 100vh;"></iframe>';

  $.ajax({
    method: "GET",
    url: "/update_programmatic/" + $scope.currentPlayingCampaignID,
    success: function(res) {
      console.log(res);
    }
  });
  setTimeout(callback, 15000);
}
