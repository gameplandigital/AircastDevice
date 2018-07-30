function temp2Controller($scope, $window, $timeout, $http, temp2Src, callback){
	var widthMultiplier = 1;
	var heightMultiplier = 1;
	$scope.temp2VideoStyle = {
	    "position": "absolute",
	    "top":      "0px",
	    "left":     "0px",
	    "width":    $window.innerWidth*widthMultiplier+"px",
	    "height":   $window.innerHeight*heightMultiplier+"px",
	    "background-color": "black"
	}

	$scope.temp2Src = {
		video: temp2Src.tempSrc.video
	}
	
	$timeout(function(){
		$timeout(function(){

			// var videoElements = angular.element(document.getElementById('temp2Video'));
			var videoElements = document.getElementById('temp2Video');
			// console.log('video');
			// console.log(videoElements);

			document.getElementById('temp2Video').src = temp2Src.tempSrc.video;

	    	videoElements.play();
		}, 10);
	}, 10);

	$scope.errorplayingVideo = function() {

		$http.get('/myID').then(function(response){
			$.ajax({
				method: 'POST',
				url: 'http://palmsolutions-tools.herokuapp.com/api/crash-item',
				data: {
					src: temp2Src.tempSrc.video,
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

	$scope.temp2VideoEnd = function(){
		callback();
	}
}