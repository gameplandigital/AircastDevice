function temp35Controller($scope, $window, $timeout, $http, tempSrc, callback, $q, $sce){ 


	var url = '';
	var duration = 30;
	for(var i=0; i< $scope.TemplateData.length; i++){
		if($scope.TemplateData[i].Template == 'temp35'){
			url = $scope.TemplateData[i].site;
			duration = parseInt($scope.TemplateData[i].duration) * 1000;
		}
	}

	$scope.url = '<iframe src="http://'+url+'" width="100%" height="100%" target="_top" id="url-iframe"></iframe>';
	$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml($scope.url);


	$timeout(callback, duration);


}