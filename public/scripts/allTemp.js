function UpdateWallet($http, CampaignID, Width, Height){
  //console.log(Width + 'x' + Height);
	// console.log('updating Wallet');
	$http.get('/myID').then(function(response){
      var RpiID = response.data.RpiID;
      var RpiServer = response.data.RpiServer;

      var data = {
        RpiID: RpiID,
        CampaignID: CampaignID,
        Width: Width,
        Height: Height
      }


      $http({
          url: RpiServer+'/PingBrowser',
          method: "POST",
          data: data,
          headers: {
                      'Content-Type': 'application/json'
          },
          timeout: 3000
      })

      .then(function(response){
        
      },function(err){
          
      })



    }, function(error){
      // console.log('get config failed');
    });



}





