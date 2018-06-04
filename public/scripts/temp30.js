function temp30Controller($scope, $window, $timeout, $http, tempSrc, callback,$q){ 

	// var fb_post, page_info;
	var loopCounter = 0;
	var cb = false;
	var interval41, interval42;
	var fb_post = {
		currentPosition: 0,
		postList: {},
		post_length: 0,
		loopInterval: 10000,
		loop: true,
	}


    for(var i=0; i< $scope.TemplateData.length; i++){
		if($scope.TemplateData[i].Template == 'temp30'){
			console.log("FB SELECTED POST")
			console.log($scope.TemplateData[i]);
			fb_post.postList = $scope.TemplateData[i].TempData;
			fb_post.currentPosition = $scope.TemplateData[i].currentPosition;
			fb_post.post_length = $scope.TemplateData[i].TempData.length;
			insertDataToScope();
		}
	}

	function insertDataToScope(){
		var data = fb_post.postList[fb_post.currentPosition];
		console.log(data);

		$scope.info = {
			id: data.id,
			full_picture: data.full_picture,
			message: removeEmojis(data.message)
		}

		console.log(fb_post.currentPosition+'/'+fb_post.post_length);


	       if (loopCounter == 0) {
	      	loop();
	      	cb = true;
	      	callCallback();
	      	loopCounter++;
	      }


	}


	  function fbpostAddClass() {
	  	$(".facebook-image-pic").addClass("rotateInUpLeft");
	  	$(".facebook-post-selected-top").addClass("bounceInDown");
	  	$(".facebook-post-selected-caption").addClass("bounceInUp");
	  	$(".facebook-post-selected-reactions").addClass("bounceInUp");
       	
      }

      function fbpostRemoveClass(){
		$(".facebook-image-pic").removeClass("rotateInUpLeft");
		$(".facebook-post-selected-top").removeClass("bounceInDown");
		$(".facebook-post-selected-caption").removeClass("bounceInUp");
		$(".facebook-post-selected-reactions").removeClass("bounceInUp");


      }



       function updateValues() {
        	$scope.TemplateData.forEach(function(item){
					if(item.Template == 'temp30'){
							item.currentPosition = fb_post.currentPosition;
			    		}
				  })
        }

    	function loop(){

	        if (fb_post.loop) {

                interval41 = setInterval(function () {
                  fbpostRemoveClass();
                }, fb_post.loopInterval/2);
            
	              interval42 = setInterval(function () {

	                  $scope.$apply(function(){

	                    	if (fb_post.currentPosition >= fb_post.post_length-1) {
	                    		fb_post.currentPosition = 0;
	                    	}else {
	                    		fb_post.currentPosition++;	
	                    	}
							updateValues();
	                    	insertDataToScope();
                            fbpostAddClass();
	                    	
	                    });
	                    
	                }, fb_post.loopInterval);
	            
	        }
    	}

   	function numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function nFormatter(num, digits) {
	  var si = [
	    { value: 1E18, symbol: "E" },
	    { value: 1E15, symbol: "P" },
	    { value: 1E12, symbol: "T" },
	    { value: 1E9,  symbol: "G" },
	    { value: 1E6,  symbol: "M" },
	    { value: 1E3,  symbol: "k" }
	  ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
	  for (i = 0; i < si.length; i++) {
	    if (num >= si[i].value) {
	      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
	    }
	  }
	  return num.toFixed(digits).replace(rx, "$1");
	}

	 function removeEmojis (string) {

      if (string) {
    	var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;  	
 		return string.replace(regex, '');
      }else {
      	return string;
      }
  }


      	function removeInterval2(){

			clearInterval(interval41);
			clearInterval(interval42);		
			
		}

		function callCallback(){

			if (cb) {
				$timeout(removeInterval2, 28000);      
				$timeout(callback, 30000);
			}
			
		}


};