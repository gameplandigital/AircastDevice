//programatic
function temp7Controller($scope, $window, $timeout, $http, tempSrc, callback){

	$http('/get-programmatic-campaign').then(function(data){
		console.log(data);
	})


}