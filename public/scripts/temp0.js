function temp0Controller($scope, $window, $timeout, $http, temp1Src, callback) {
  var CampaignID = $scope.currentPlayingCampaignID;

  $.ajax({
    method: "GET",
    url: "/update_programmatic/video/" + $scope.currentPlayingCampaignID,
    success: function(res) {
      console.log(res);
    }
  });

  jwplayer("mediaPlayer")
    .setConfig({
      repeat: false,
      autostart: "viewable",
      mute: false,
      volume: 100
    })
    .setup({
      file: "/assets/vid.mp4",
      image: "/assets/programmatic-house-campaign-1366x768.png",
      height: screen.height,
      width: screen.width,
      advertising: {
        client: "vast",
        tag: "/get-programmatic-campaign/video/" + CampaignID
      }
    })
    .on("adPlay", function() {
      this.setConfig({
        mute: false,
        volume: 100
      });
    })
    .on("adImpression", function(obj) {
      console.log(obj);
    })
    .on("complete adComplete", function() {
      callback();
    })
    .play();
}
