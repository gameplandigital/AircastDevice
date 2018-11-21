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
  var duration = 10000;
  for (var i = 0; i < $scope.TemplateData.length; i++) {
    if (
      $scope.TemplateData[i].Template == "temp36" &&
      $scope.TemplateData[i].CampaignID == tempSrc.CampaignID
    ) {
      dataFromGetData.Content = $scope.TemplateData[i].Content;
      dataFromGetData.ContentBy = $scope.TemplateData[i].ContentBy;
    }
  }

  $scope.quotevar = {
    quote: dataFromGetData.Content,
    credit: dataFromGetData.ContentBy
  };

  $timeout(callback, duration);
}
