
function temp10Controller($scope, $window, $timeout, $http, tempSrc, callback){

    var loopCounter = 0;
    var interval1, interval2;
    var cb = false;
    var localData;

    var newsSource;
            
    var config = {

        //source -> latest, top, popular
        'sourceList': [ 'buzzfeed','cnn','espn','google-news','entertainment-weekly','al-jazeera-english','bloomberg,','techcrunch','business-insider-uk'],
        'source': 'cnn',
        'sort':'top',
        'currentPosition': 0,
        'apiKey': '44e7bd68b7d74cef902f1d9c7cb96b72',
        'loop':true,
        'newsList': [],
        'loopInterval':12000,
        'image':{
            'buzzfeed': '/assets/logo-buzzfeed.png',
            'cnn': '/assets/logo-cnn.png',
            'espn': '/assets/logo-espn.png',
            'google-news': '/assets/logo-google-news.png',
            'entertainment-weekly': '/assets/logo-entertainment-weekly.png',
            'al-jazeera-english': '/assets/logo-aljazeera.png',
            'bloomberg': '/assets/logo-bloomberg.png',
            'techcrunch': '/assets/logo-techcrunch.png',
            'business-insider': '/assets/logo-business-insider.png'
        }

    }
    

        
    for(var i=0; i< $scope.TemplateData.length; i++){
    		if($scope.TemplateData[i].Template == 'temp10' && $scope.TemplateData[i].CampaignID == tempSrc.CampaignID){
    			localData = $scope.TemplateData[i].TempData;
          newsSource = $scope.TemplateData[i].source;
          config.currentPosition = $scope.TemplateData[i].currentPosition;
    			insertDataToScope();

    		}
    	}


          //insert all the data to the angular $scope
      function insertDataToScope() {
          console.log('temp 10 data insert');
  
              var parsedData = localData;
              config.newsList = parsedData.articles;
              var newsCount = config.newsList.length-1;
              var article = config.newsList[config.currentPosition];

              console.log(config.currentPosition + ' / ' + newsCount);

              var title = article.title;
              var author = article.author || "";

              var rawDate = article.publishedAt;
              var dateCreated;

              if (rawDate !== null) {
                    dateCreated = moment(article.publishedAt).format('LL');
              }else {
                    dateCreated = "";
              }

              var description = article.description || "";
              var featuredImage = article.urlToImage;

              if (featuredImage === null || featuredImage == "") {
                  featuredImage = "assets/news-background.jpeg";
              }

                var articleAside =  returnArticle(config.currentPosition,newsCount);
                var article1 = config.newsList[articleAside[0]];
                var article2 = config.newsList[articleAside[1]];
                var article3 = config.newsList[articleAside[2]];

                $scope.news = {
                    'title': title,
                    'author': author,
                    'dateCreated': dateCreated,
                    'description': description,
                    'featuredImage': featuredImage,
                    'article1': article1,
                    'article2':article2,
                    'article3':article3,
                    'sourceIcon': '/assets/news-logo.png'
                }

              if(title.length > 50) {
                  $(".news-headline h1").css("font-size","1.2em");
              }else {
                $(".news-headline h1").css("font-size","1.5em");
              }

              if (description.length > 200) {
                  $(".news-upper").css("margin-top","3em")
              }else {
                  $(".news-upper").css("margin-top","4em")
              }

              if (loopCounter == 0) {
              	loop();
                cb = true;
                callCallback();
              	loopCounter++;
              }
          
      }; // end of insertDataToScope
        


    function removeNewsClass(){

    $(".news .header").removeClass("fadeInLeft");
        $(".news .news").removeClass("news-animation");
        $(".news .news-aside-div").removeClass("fadeInRight");
        $(".news .divider-bottom").removeClass("fadeInUp");
        $(".news .news-item").removeClass("fadeInRight");
        $(".news .news-source-div").removeClass("fadeInDown");
    
    }

    function addNewsClass(){

        $(".news .header").addClass("fadeInLeft");
        $(".news .news").addClass("news-animation");
        $(".news .news-aside-div").addClass("fadeInRight");
        $(".news .divider-bottom").addClass("fadeInUp");
        $(".news .news-item").addClass("fadeInRight");
        $(".news .news-source-div").addClass("fadeInDown");

    } 

      function loop(){

          if (config.loop) {

                interval1 = setInterval(function () {
                  removeNewsClass();
                }, config.loopInterval/2);
            
                interval2 = setInterval(function () {

                    $scope.$apply(function(){

                        if (config.currentPosition >= config.newsList.length-1) {
                          config.currentPosition = 0;
                        }else {
                          config.currentPosition++;  
                        }
                          updateValues();
                          insertDataToScope();
                          addNewsClass();
                        
                      });
                      
                  }, config.loopInterval);
              
          }
      }


      function updateValues() {
          $scope.TemplateData.forEach(function(item){
          if(item.Template == 'temp10'){
              item.currentPosition = config.currentPosition;
              }
          })
      }
        
    function returnArticle(currentPosition,newsCount){

              var counter = parseInt(currentPosition)+1;
              var articleAsidePosition = []; 

              for (var i = 0; i < 3; i++ ) {
                  
                  if (counter <= newsCount) {
                      articleAsidePosition.push(counter);
                      counter++;
                  }else {
                      counter = 0;
                      articleAsidePosition.push(counter);
                      counter++;
                  }
                  
              }
             
             return articleAsidePosition;
          }
         
         


	function removeInterval() {

			clearInterval(interval1);
			clearInterval(interval2);		

		
	}

  function callCallback() {

    if (cb) {
      $timeout(removeInterval, 28000);      
      $timeout(callback, 30000);      
    }


  }



}