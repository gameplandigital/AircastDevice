function temp1Controller($scope, $window, $timeout, $http, temp1Src, callback){
	
	//programatic
	$http.get('/get-programmatic-campaign').then(function(data){
		console.log(data);
		if (data.data.response.statusCode == 200 && data.data.body.statuscode == 0) {


			var markup = data.data.response.body.seatbid[0].bid[0].adm;
 
		    document.write(
		        "<scr" + "ipt type='text/javascript'>" +
		        markup +
		        "</scr" + "ipt>"
		    );

		}
		

	})




}
