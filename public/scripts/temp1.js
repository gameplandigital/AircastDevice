function temp1Controller($scope, $window, $timeout, $http, temp1Src, callback) {
  var CampaignID = $scope.currentPlayingCampaignID;
  var div = document.getElementById("programmatic_div");
  div.innerHTML = "";

  $.ajax({
    url: "/get-programmatic-campaign/" + CampaignID,
    method: "GET",
    success: function(res) {
      var markup = res.seatbid[0].bid[0].adm;
      var nurl = res.seatbid[0].bid[0].nurl || null;
      var imptrackers = res.seatbid[0].bid[0].ext.imptrackers || null;
      var div = document.getElementById("programmatic_div");

      var iframe = document.createElement("iframe");
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";

      var html =
        "<html><body></body>" +
        "<scr" +
        "ipt type='text/javascript'>" +
        markup +
        "</scr" +
        "ipt>" +
        "</html>";

      div.appendChild(iframe);
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(html);
      iframe.contentWindow.document.close();

      $.ajax({
        method: "GET",
        url: "/update_programmatic/" + $scope.currentPlayingCampaignID,
        success: function(res) {
          console.log(res);

          if (nurl) {
            var x = document.createElement("img");
            x.setAttribute("src", nurl);
            x.style.display = "none";
            div.appendChild(x);
          }

          if (imptrackers) {
            var trackers = [];
            for (var i = 0; i < imptrackers.length; i++) {
              trackers.push(document.createElement("img"));
            }
            for (var i = 0; i < imptrackers.length; i++) {
              trackers[i].setAttribute("src", imptrackers[i]);
              trackers[i].style.display = "none";
              div.appendChild(trackers[i]);
            }
          }
        }
      });

      setTimeout(callback, 15000);
    }
  });
}
