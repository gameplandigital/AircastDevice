function temp1Controller($scope, $window, $timeout, $http, temp1Src, callback) {
  $.ajax({
    method: "GET",
    url: "/update_programmatic",
    success: function(res) {
      console.log(res);
    }
  });
  setTimeout(callback, 15000);
}
