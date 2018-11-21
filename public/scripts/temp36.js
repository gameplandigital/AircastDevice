function temp36Controller(
  $scope,
  $window,
  $timeout,
  $http,
  tempSrc,
  callback,
  $q
) {
  var dataFromGetData = {};
  var duration = 15000;
  for (var i = 0; i < $scope.TemplateData.length; i++) {
    if (
      $scope.TemplateData[i].Template == "temp36" &&
      $scope.TemplateData[i].CampaignID == tempSrc.CampaignID
    ) {
      dataFromGetData.Content = $scope.TemplateData[i].Content;
      dataFromGetData.position = $scope.TemplateData[i].position;
    }
  }

  $scope.quotevar = {
    data: dataFromGetData.Content[dataFromGetData.position]
  };
  updateValues();

  function updateValues() {
    $scope.TemplateData.forEach(function(item) {
      if (item.Template == "temp36") {
        if (dataFromGetData.position === dataFromGetData.Content.length - 1) {
          dataFromGetData.position = 0;
        } else {
          dataFromGetData.position += 1;
        }
        item.position = dataFromGetData.position;
      }
    });
  }

  $timeout(callback, duration);
}
