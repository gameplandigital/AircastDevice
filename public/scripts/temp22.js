function temp22Controller($scope, $window, $timeout, $http, temp2Src, callback, $q){

    

    

    var config = {
        'loop':'true',
        'loopInterval': 10000,
        'animationEnter': 'flipInX',
        'animationOut' : 'flipOutX'
    }

    var bgList = ['/assets/hugot-background-1.png','/assets/hugot-background-2.png','/assets/hugot-background-3.png','/assets/hugot-background-4.png','/assets/hugot-background-5.png'];
    

    var interval5, interval6;

    var hugotList;
    
    
    // var hugotList = [
    //     "Sabi ko na nga ba sabon ka! Kasi I'm SOAPer in love with you!",
    //     "Sana gravity nalang ako para kahit lumayo ka babalik at babalik ka din sa akin.",
    //     "Don't waste your time to the person who doesn't even cares to your feelings.",
    //     "Kung dalawa ang mahal mo, piliin mo yung pangalawa.. kasi, hindi ka naman magmamahal ng iba kung mahal mo talaga yung una.",
    //     "Sa Tindi ng Trapik sa EDSA, naniniwala na ako sa FOREVER.",
    //     "Ang Paglalakbay natin sa buhay ay tulad sa batas trapiko. Alam natin kung kailan maghahanda, ititigil at magpapatuloy, higit sa lahat ng sumusunod sa batas.",
    //     "Ang landian ay parang pagkain lang. Pag nasobrahan, nakakalaki ng tiyan.",
    //     "Liliko ako kahit saan, Makarating lang sa Kinaroroonan mo.",
    //     "Hintayin mo ang True Love mo. Na Traffic lang yun sa malalanding tao.",
    //     "If you want to be part of my life, make sure that you are ready to accept not only the good parts but also my stupid side.",
    //     "How can you love someone else. If you’re returning to the past.",
    //     "In a relationship, no matter how carefully you hold the one.. Yet you have lost it.. Because he had released the hold earlier.",
        
    // ]
    
    for(var i=0; i< $scope.TemplateData.length; i++){
    		if($scope.TemplateData[i].Template == 'temp22'){
    			hugotList = $scope.TemplateData[i].TempData;
    			console.log(hugotList);
    		}
    	}


    var uniqueRandoms = [];
    var numRandoms = hugotList.length;
        
    //generate random number that is not repeating    
    function makeUniqueRandom() {

        if (!uniqueRandoms.length) {
            for (var i = 0; i < numRandoms; i++) {
                uniqueRandoms.push(i);
            }
        }
        var index = Math.floor(Math.random() * uniqueRandoms.length);
        var val = uniqueRandoms[index];


        uniqueRandoms.splice(index, 1);

        return val;

    }        
        function insertDataToScope() {
            
             $scope.hugotText = hugotList[makeUniqueRandom()];
             $scope.hugotBackground  = bgList[Math.floor(Math.random() * bgList.length)];

             
        }

	         if (config.loop) {
	            
	            insertDataToScope();
	    
	            interval5 = setInterval(function(){
	                hugotRemoveClass();
	            },config.loopInterval/2);

	            interval6 = setInterval(function(){

	                insertDataToScope();
	                hugotAddClass();
	                $scope.$apply();

	            },config.loopInterval);
	    
	        }       	
        
        


        function hugotRemoveClass(){
            $(".hugot-text").delay(2000).removeClass(config.animationEnter);
        }

        function hugotAddClass(){
            $(".hugot-text").addClass(config.animationEnter);
        }
       




	function removeInterval() {

		clearInterval(interval5);
		clearInterval(interval6);			



	}

    $timeout(removeInterval, 19000);   
    $timeout(callback, 20000);

};