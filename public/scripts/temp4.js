function temp4Controller($scope, $window, $timeout, $http, tempSrc, callback){

	// $scope.temp4DivStyle = {
	//     "position": "relative",
	//     "top":      "0px",
	//     "left":     "0px",
	//     "width":    $window.innerWidth+"px",
	//     "height":   $window.innerHeight+"px",
	//     "background-color": "black",
	//     "background-image": "url('"+tempSrc.tempSrc.gif+"')",
	//     "background-repeat": "no-repeat",
	//     "background-size": "100% 100%"
	// }
	// $scope.temp4Text = {
	//     "position": "absolute",
	//     "top":      "200px",
	//     "left":     $window.innerWidth*.4+"px",
	//     // "width":    $window.innerWidth+"px",
	//     // "height":   $window.innerHeight+"px",
	//     "font-size": "2em"
	// }

	$scope.imgSrc = tempSrc.tempSrc.gif;


	$scope.errorplayingFile = function() {
		console.log('Error with Image')
		$http.get('/myID').then(function(response){
			$.ajax({
				method: 'POST',
				url: 'http://palmsolutions-tools.herokuapp.com/api/crash-item',
				data: {
					src: tempSrc.tempSrc.gif,
					id: response.data.RpiID
				},
				success: function(data){
					console.log(data);
				}
			})
		},function(error){
			console.log(error)
		})

		callback();
	}

	$timeout(function(){
		$timeout(function(){
			
		}, 10);
	}, 10);

	$timeout(callback, 15000);
}