function temp0Controller($scope, $window, $timeout, $http, temp1Src, callback) {
  var CampaignID = $scope.currentPlayingCampaignID;

  // var mediaPlayer = jwplayer("mediaPlayer");

  // mediaPlayer.setConfig({
  //   repeat: false,
  //   autostart: "viewable",
  //   mute: false,
  //   volume: 100
  // });

  $.ajax({
    url: "/get-programmatic-campaign/video/" + CampaignID,
    method: "GET",
    success: function(res) {
      var markup = res.seatbid[0].bid[0].adm;

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
            tag: markup
          }
        })
        .on("adPlay", function() {
          mediaPlayer.setConfig({
            mute: false,
            volume: 100
          });
        })
        .on("adImpression", function(obj) {
          console.log(obj);
        })
        .on("complete adComplete", function() {
          // mediaPlayer.remove();
          console.log("meow");
          callback();
        })
        .play();

      $.ajax({
        method: "GET",
        url: "/update_programmatic/video/" + $scope.currentPlayingCampaignID,
        success: function(res) {
          console.log(res);
        }
      });
    }
  });

  // mediaPlayer.on("complete adComplete adError", function() {
  //   // mediaPlayer.remove();
  //   console.log("meow");
  //   callback();
  // });
}
