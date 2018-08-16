function temp29Controller($scope, $window, $timeout, $http, tempSrc, callback, $sce){ 

	var loopCounter = 0;
	var cb = true;
	var interval39, interval40;
  
  var spotify = {
    currentPosition: 0,
    postList: {},
    post_length: 0,
    loopInterval: 30000,
    loop: true,
  }


function SineWaveGenerator(options) {
      $.extend(this, options || {});
      
      if(!this.el) { throw "No Canvas Selected"; }
      this.ctx = this.el.getContext('2d');
      
      if(!this.waves.length) { throw "No waves specified"; }
      
      // Internal
      this._resizeWidth();
      window.addEventListener('resize', this._resizeWidth.bind(this));
      // User
      this.resizeEvent();
      window.addEventListener('resize', this.resizeEvent.bind(this));
      
      if(typeof this.initialize === 'function') {
        this.initialize.call(this);
      }
      // Start the magic
      this.loop();
    }

    // Defaults
    SineWaveGenerator.prototype.speed = 10;
    SineWaveGenerator.prototype.amplitude = 50;
    SineWaveGenerator.prototype.wavelength = 50;
    SineWaveGenerator.prototype.segmentLength = 10;

    SineWaveGenerator.prototype.lineWidth = 2;
    SineWaveGenerator.prototype.strokeStyle  = 'rgba(255, 255, 255, 0.2)';

    SineWaveGenerator.prototype.resizeEvent = function() {};

    // fill the screen
    SineWaveGenerator.prototype._resizeWidth = function() {
      this.dpr = window.devicePixelRatio || 1;
      
      this.width = this.el.width = window.innerWidth * this.dpr;
      this.height = this.el.height = window.innerHeight * this.dpr;
      this.el.style.width = window.innerWidth + 'px';
      this.el.style.height = window.innerHeight + 'px';
      
      this.waveWidth = this.width * 0.95;
      this.waveLeft = this.width * 0.025;
    }

    SineWaveGenerator.prototype.clear = function () {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    SineWaveGenerator.prototype.time = 0;

    SineWaveGenerator.prototype.update = function(time) {  
      this.time = this.time - 0.007;
      if(typeof time === 'undefined') {
        time = this.time;
      }

      var index = -1;
      var length = this.waves.length;

      while(++index < length) {
        var timeModifier = this.waves[index].timeModifier || 1;
        this.drawSine(time * timeModifier, this.waves[index]);
      }
      index = void 0;
      length = void 0;
    }

    // Constants
    var PI2 = Math.PI * 2;
    var HALFPI = Math.PI / 2;

    SineWaveGenerator.prototype.ease = function(percent, amplitude) {
      return amplitude * (Math.sin(percent * PI2 - HALFPI) + 1) * 0.5;
    }

    SineWaveGenerator.prototype.drawSine = function(time, options) {
      options = options || {};
      amplitude = options.amplitude || this.amplitude;
      wavelength = options.wavelength || this.wavelength;
      lineWidth = options.lineWidth || this.lineWidth;
      strokeStyle = options.strokeStyle || this.strokeStyle;
      segmentLength = options.segmentLength || this.segmentLength;
      
      var x = time;
      var y = 0;  
      var amp = this.amplitude;
     
      // Center the waves
      var yAxis = this.height / 2; 
      
      // Styles
      this.ctx.lineWidth = lineWidth * this.dpr;
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      
      // Starting Line
      this.ctx.moveTo(0, yAxis);
      this.ctx.lineTo(this.waveLeft, yAxis);
      
      for(var i = 0; i < this.waveWidth; i += segmentLength) {
        x = (time * this.speed) + (-yAxis + i) / wavelength; 
        y = Math.sin(x); 
        
        // Easing
        amp = this.ease(i / this.waveWidth, amplitude); 
        
        this.ctx.lineTo(i + this.waveLeft, amp * y + yAxis);
        
        amp = void 0;
      }
      
      // Ending Line
      this.ctx.lineTo(this.width, yAxis);
      
      // Stroke it
      this.ctx.stroke();
      
      // Clean up
      options = void 0;
      amplitude = void 0;
      wavelength = void 0;
      lineWidth = void 0;
      strokeStyle = void 0;
      segmentLength = void 0;
      x = void 0;
      y = void 0;
    } 

    SineWaveGenerator.prototype.loop = function() {
      this.clear();
      this.update();
      
      window.requestAnimationFrame(this.loop.bind(this));
    }

    var canvas = document.getElementById('waves');
    canvas.width  = 700;
    canvas.height = 300;

    new SineWaveGenerator({
      el: document.getElementById('waves'),
      
      speed: 8,
      
      waves: [
        {
          timeModifier: 1,
          lineWidth: 11,
          amplitude: 150,
          wavelength: 200,
          segmentLength: 20,
    //       strokeStyle: 'rgba(255, 255, 255, 0.5)'
        },
        {
          timeModifier: 1,
          lineWidth: 13,
          amplitude: 150,
          wavelength: 100,
    //       strokeStyle: 'rgba(255, 255, 255, 0.3)'
        },
        {
          timeModifier: 1,
          lineWidth: 18,
          amplitude: -150,
          wavelength: 50,
          segmentLength: 10,
    //       strokeStyle: 'rgba(255, 255, 255, 0.2)'
        },
        {
          timeModifier: 1,
          lineWidth: 15,
          amplitude: -100,
          wavelength: 100,
          segmentLength: 10,
    //       strokeStyle: 'rgba(255, 255, 255, 0.1)'
        }
      ],
      
      initialize: function (){

      },
      
      resizeEvent: function() {
        var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0,"rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.5,"rgba(255, 255, 255, 0.5)");
        gradient.addColorStop(1,"rgba(0, 0, 0, 0)");
        
        var index = -1;
        var length = this.waves.length;
        while(++index < length){
          this.waves[index].strokeStyle = gradient;
        }
        
        // Clean Up
        index = void 0;
        length = void 0;
        gradient = void 0;
      }
    });


    //console.log($scope.TemplateData);

    for(var i=0; i< $scope.TemplateData.length; i++){
  		if($scope.TemplateData[i].Template == 'temp29'){

  			spotify.postList = $scope.TemplateData[i].TempData;
        spotify.currentPosition = $scope.TemplateData[i].currentPosition;
        spotify.post_length = $scope.TemplateData[i].TempData.length;
  			insertDataToScope();

  		}
	}

    	function insertDataToScope(){
        
        var data = spotify.postList[spotify.currentPosition];

        $scope.preview_url = data.preview_url;
        $scope.album_cover = data.album.images[0].url;
        $scope.album_title = data.album.name;
        $scope.song_name = data.name;
        $scope.artist = data.artists[0].name;
        $scope.popularity = data.popularity;
        //console.log(data.preview_url);
        //console.log($sce);
        $scope.audio = '<audio src="'+data.preview_url+'" controls autoplay=""></audio>';
        //console.log($scope.audio);

        if ($scope.song_name.length > 20) {
          $(".spotify-template .spotify-music .spotify-music-name h2").css('font-size','1.4em');
        }else if ($scope.song_name.length > 30){
          $(".spotify-template .spotify-music .spotify-music-name h2").css('font-size','1.7em');
        }else {
          $(".spotify-template .spotify-music .spotify-music-name h2").css('font-size','2em');
        }

        $(".spotify-background").css("background-image","linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,1)),url("+$scope.album_cover+")");


           	if (loopCounter == 0) {
  		      	loop();
  		      	cb = true;
  		      	callCallback();
  		      	loopCounter++;
  		      }

    	}

    function spotifyAddClass() {

          
      }

      function spotifyRemoveClass(){


      }


       function updateValues() {
        	$scope.TemplateData.forEach(function(item){
					if(item.Template == 'temp29'){
							item.currentPosition = spotify.currentPosition;
			    		}
				  })
        }

    	function loop(){

	        if (spotify.loop) {

                interval37 = setInterval(function () {
                  spotifyRemoveClass();
                }, spotify.loopInterval/2);
            
	              interval38 = setInterval(function () {

	                  $scope.$apply(function(){

	                    	if (spotify.currentPosition >= spotify.eventListLength-1) {
	                    		spotify.currentPosition = 1;
	                    	}else {
	                    		spotify.currentPosition++;	
	                    	}

	                    	updateValues();
	                    	insertDataToScope();
                        spotifyAddClass();
	                    	
	                    });
	                    
	                }, spotify.loopInterval);   
	        }
    	}


    function removeInterval2(){

			clearInterval(interval39);
			clearInterval(interval40);		
			
		}

		function callCallback(){

			if (cb) {
				$timeout(removeInterval2, 28000);      
				$timeout(callback, 30000);
			}
			
		}


};