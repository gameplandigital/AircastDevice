function temp34Controller($scope, $window, $timeout, $http, tempSrc, callback,$q){ 

	var fb_live = {};
	var playVideo = true;
	var x;
	var instance = {};

	var loaded = false;

    for(var i=0; i< $scope.TemplateData.length; i++){
		if($scope.TemplateData[i].Template == 'temp34' && $scope.TemplateData[i].CampaignID == tempSrc.CampaignID){
		       	fb_live.hasData = $scope.TemplateData[i].hasData;
    			fb_live.page_id = $scope.TemplateData[i].page_id;
    			fb_live.video_id = $scope.TemplateData[i].video_id;
    			fb_live.status =  $scope.TemplateData[i].status;
    			fb_live.hasLoaded = $scope.TemplateData[i].hasLoaded
    			fb_live.pageInfo = $scope.TemplateData[i].pageInfo;
    			fb_live.pageName = $scope.TemplateData[i].pageName;
    			fb_live.CampaignID  = $scope.TemplateData[i].CampaignID;
    			fb_live.Loaded = $scope.TemplateData[i].Loaded;

    			showLoader();
    			

		}
	}

	if (!fb_live.Loaded) {

		(function(d, s, id) {
		    var js, fjs = d.getElementsByTagName(s)[0];
		    if (d.getElementById(id)) return;
		    js = d.createElement(s); js.id = id;
		    js.src = "https://connect.facebook.net/en_US/all.js";
		    fjs.parentNode.insertBefore(js, fjs);
		  }(document, 'script', 'facebook-jssdk'));

		    window.fbAsyncInit = function() {
		      FB.init({
		        appId      : '1999469800267021',
		        xfbml      : true,
		        version    : 'v2.6'
		      });
		    };

        	$scope.TemplateData.forEach(function(item){
				if(item.Template == 'temp34'){
						item.Loaded = true;
		    		}
			  })

        	setTimeout(function(){ 
        		insertDataToScope();
        	},3000)
        	

	}


	function showLoader() {
		console.log('SHOWING LIVE LOADER')
		$scope.name = fb_live.pageInfo.name;
		$scope.picture = fb_live.pageInfo.picture.data.url;
		$scope.urlName = fb_live.pageName;
		console.log('ADDING CLASS')
		setTimeout(function(){ 
			$(".live-loader").fadeOut(2000);
			console.log('ADD HIDDEN CLASS');
		}, 5000);

		
	}

	function showEndingLoader(){

		$.ajax({
			method: 'DELETE',
			url: 'http://palmsolutions-tools.herokuapp.com/api/facebook-live-stop',
			data: {id: fb_live.CampaignID },
			success: function(data){
				console.log(data);
			}
		})

		$scope.name = fb_live.pageInfo.name;
		$scope.picture = fb_live.pageInfo.picture.data.url;
		$scope.urlName = fb_live.pageName;
		$(".end-loader").removeClass('hidden');
		clearInterval(x);
		setTimeout(function(){
			callback();
		},5000)
		
	}


	function checkIfLiveStops() {

    	$scope.TemplateData.forEach(function(item){
				if(item.Template == 'temp34'){
						console.log('CHECK IF LIVE FUNCTION');
						console.log(item)
						if (item.status == '1') {
							console.log('returning true');
							playVideo =  true
						}else {
							console.log('returning false')
							playVideo = false
						}
		    		}
			  })

	}


	function insertDataToScope() {

		console.log('FB LIVE')
		$scope.page_id = fb_live.page_id;
		$scope.video_id = fb_live.video_id;

		console.log(FB)
		// Get Embedded Video Player API Instance
	      FB.Event.subscribe('xfbml.ready', function(msg) {
	      	console.log('fbxml ready');
	      	instance = msg.instance;
	        if (msg.type === 'video') {
	          console.log('video player');
	          msg.instance.play();
	          unmute(msg.instance);
	          //msg.instance.subscribe('paused', facebookPauseEventHandler);
	        }
	      });

		    function unmute(instance) {
		    	instance.unmute()
		    }

		setTimeout(function(){
			console.log('Calling FB.XFBML.parse after 5 seconds') 
			FB.XFBML.parse()
		}, 5000);

		x = setInterval(function(){

			checkIfLiveStops();
			if (playVideo == true) {
				console.log('LIVE IS STILL PLAYING: ', playVideo);
				
				if (instance.hasOwnProperty('getDuration')) {

					console.log('Duration: ', instance.getDuration());
					console.log('Current Position: ', instance.getCurrentPosition());

					if (Math.floor(instance.getCurrentPosition()) >= Math.floor(instance.getDuration())) {
						showEndingLoader();
					}


				}

			}else {
				showEndingLoader();


			}


		},5000)

	}




};