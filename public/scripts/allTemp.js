function UpdateWallet($http, CampaignID, Width, Height){

	$http.get('/myID').then(function(response){
      var RpiID = response.data.RpiID;
      var RpiServer = response.data.RpiServer;

      var data = {
        RpiID: RpiID,
        CampaignID: CampaignID,
        Width: Width,
        Height: Height,
        Status: 'online'
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
        
          // var data = {
          //   CampaignID: CampaignID,
          //   Status: 'online'
          // }
          // $http({
          //     url: '/logTimestamp',
          //     method: "POST",
          //     data: data,
          //     headers: {
          //         'Content-Type': 'application/json'
          //     }
          // })

      },function(err){
          //console.log('error updating the wallet due to internet problem', err);

        // var data = {
        //   CampaignID: CampaignID,
        //   Status: 'offline'
        // }

        // $http({
        //     url: '/logTimestamp',
        //     method: "POST",
        //     data: data,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(function(response){
        //     console.log('saved the details in the timestamp');
        // },function(err){
        //     console.log('error updating the wallet due to internet problem');
        // })


      })

    }, function(error){
      // console.log('get config failed');
    });

}





