var request = require('request');
var http = require('http');
var fs = require('fs');
var async = require('async');
var path = require('path');
var df = require('download-file')
var needle = require('needle')

var RpiConfig = {
	RpiID: 0,
	RpiServer: "",
	ContentServer: "",
	SourceServer: "",
	CheckFile: "",
	UpdateFile: "",
	RpiDownloading: [],

	ContentFiles: [],
	ContentFileDownloading: false,
	ContentCampaign: {},

	SourceFiles: [],
	SourceFileDownloading: false,
	SourceTemplate: {},

	isLegit: false,
	mayDownload: false,
	RpiTempDownloading: []
}


var configLocation = path.join(__dirname, '../AircastConfig/config.json');

var getConfig = function(){
	var AircastConfig = require(configLocation);


	RpiConfig.RpiID = AircastConfig.RpiID;
	RpiConfig.RpiServer = AircastConfig.RpiServer;
	RpiConfig.ContentServer = AircastConfig.ContentServer;
	RpiConfig.SourceServer = AircastConfig.SourceServer;
	RpiConfig.CheckFile = AircastConfig.CheckFile;
	RpiConfig.UpdateFile = AircastConfig.UpdateFile;
	RpiConfig.Timeout = AircastConfig.Timeout;

	if(RpiConfig.RpiID != 0){
		RpiConfig.isLegit = true;
		return true;
	}
	else
		return false;
}


function downloadRequest(fileUrl, filePath, callsuc, callerr) {
	//console.log('download Request');

	try {

		    var timeout = 5000;

		    var hasTimedOut = false;
		    
		    var timeout_wrapper = function( req ) {
		        return function() {
		            hasTimedOut = true;
		            req.abort();
		            callerr();
		        };
		    };

		    var requ = http.get(fileUrl).on('response', function(res) { 

		        var file = fs.createWriteStream(filePath);

		        var downloaded = 0;
		        var len = parseInt(res
		            .headers['content-length'], 10);

		        res.on('data', function(chunk) {
		            file.write(chunk);
		            // downloaded += chunk.length;
		            // console.log('data: '+downloaded+'/'+len);
		            clearTimeout( timeoutId );
		            timeoutId = setTimeout( fn, timeout );
		        }).on('end', function () {
		            file.end();
		            if(!hasTimedOut){
		                clearTimeout( timeoutId );
		                callsuc();
		            }
		                
		        }).on('error', function (err) {
		            clearTimeout( timeoutId );                
		            callback(err.message);
		        });           
		    }).on('error', function(err){
		        clearTimeout( timeoutId ); 
		        callerr();
		    });
		    
		    // generate timeout handler
		    var fn = timeout_wrapper( requ );

		    // set initial timeout
		    var timeoutId = setTimeout( fn, timeout );


	}catch(error){
		console.log('ERROR DOWNLOADING FILE: ',error)
	}


}

function updateContent(CampaignID){
	var options = {
		uri: RpiConfig.RpiServer+'/UpdateContentFile',
		method: 'POST',
		json: { 
			RpiID: RpiConfig.RpiID,
			CampaignID: CampaignID
		}
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('CampaignID: '+CampaignID+' UPDATED');

			// console.log(JSON.stringify(RpiConfig.ContentFiles));
			console.log(RpiConfig.ContentFiles.length);
			console.log('before');

			for(var i = 0; i < RpiConfig.ContentFiles.length; i++){
				if(RpiConfig.ContentFiles[i].CampaignID == CampaignID){
					RpiConfig.ContentFiles.splice(i, 1);
					// console.log(JSON.stringify(RpiConfig.ContentFiles));
					console.log(RpiConfig.ContentFiles.length);
					console.log('after');
					RpiConfig.ContentFileDownloading = false;
					runContentDownload();
					break;
				}
			}
		}
		else{
			console.log('CampaignID: '+CampaignID+' UPDATE Failed');
			RpiConfig.ContentFileDownloading = false;
			runContentDownload();
		}
	});
}

function runContentDownload(){
	//console.log('runContentDownload');
	if(RpiConfig.ContentFileDownloading == false && RpiConfig.ContentFiles.length>0){
		console.log("Running Content Download");

		RpiConfig.ContentFileDownloading = true;

		processContentFile(RpiConfig.ContentFiles[0]);
	}
}

function processContentFile(Campaign){
	console.log('processContentFile');
	RpiConfig.ContentCampaign = Campaign;
	console.log(RpiConfig.ContentCampaign);
	if(RpiConfig.ContentCampaign.Files.length>0){

		console.log('Downloading '+RpiConfig.ContentCampaign.Files[0].FileName);

		var source = RpiConfig.ContentServer+RpiConfig.ContentCampaign.Files[0].FileName;
		var dest = path.join(__dirname+'/../AircastContent/'+RpiConfig.ContentCampaign.Files[0].FileName);

		// console.log(source);
		downloadRequest(source, 
						dest, 
						function(){
								try {
									removeContentFile(RpiConfig.ContentCampaign.Files[0].FileID);	
								} catch(error) {
									console.log(error);
								}
								
							},
						function(){
								setTimeout(function(){
									console.log('INTERVAL TRIGGER');
									RpiConfig.ContentFileDownloading = false;
									runContentDownload();
								}, 5000);
							});
	}
	else{
		updateContent(RpiConfig.ContentCampaign.CampaignID);
	}

}

function removeContentFile(FileID){
	console.log('removeContentFile');
	for(var i = 0; i < RpiConfig.ContentCampaign.Files.length; i++){
		RpiConfig.ContentCampaign.Files.splice(i, 1);
		console.log('splice');
		console.log(RpiConfig.ContentCampaign);
		processContentFile(RpiConfig.ContentCampaign);
	}
}

var getRpiFiles = function(){
	//console.log('getRpiFiles')
	var opt = {
	   headers: { 'Content-Type': 'application/json' }
	  }
	var data = {
	    RpiID: RpiConfig.RpiID
	  }


	var options = {
	  uri: RpiConfig.RpiServer+'/GetContentFiles',
	  method: 'POST',
	  json: {
	    RpiID: RpiConfig.RpiID
	  },
	  timeout: 3000
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// console.log(JSON.stringify(body));
			//console.log('get files success');
			var data = body.value;

			//console.log('Current Campaign: '+RpiConfig.ContentFiles.length)

			for(var i = 0; i < data.length; i++){
				var isQueuing = false;
				for(var j = 0; j< RpiConfig.ContentFiles.length; j++){
					if(data[i].CampaignID == RpiConfig.ContentFiles[j].CampaignID){
						isQueuing = true;
					}
				}

				if(isQueuing == false){
					RpiConfig.ContentFiles.push(data[i]);
				}

			}

			//console.log('New Campaign: '+RpiConfig.ContentFiles.length)

			runContentDownload();
		}
		else{
			console.log('connection failed get content');
		}
	});
}




function runSourceDownload(){
	//console.log('runSourceDownload');
	if(RpiConfig.SourceFileDownloading == false && RpiConfig.SourceFiles.length>0){
		console.log("Running Source Download");

		RpiConfig.SourceFileDownloading = true;

		processSourceFile(RpiConfig.SourceFiles[0]);
	}
}

function removeRequest(dest, callsuc, callerr){

	fs.unlink(dest, function(err) {
	    if(err && err.code == 'ENOENT') {
	        console.log("File doesn't exist, won't remove it.");
	        callerr();
	    } else if (err) {
	        console.log("Error occurred while trying to remove file");
	        callerr();
	    } else {
	    	console.log('file deleted');
	    	callsuc();
	    }
	});
}


function processSourceFile(Template){
	console.log('processSourceFile');
	RpiConfig.SourceTemplate = Template;
	console.log(RpiConfig.SourceTemplate);
	if(RpiConfig.SourceTemplate.Files.length>0){

		console.log('Downloading '+RpiConfig.SourceTemplate.Files[0].FileName);

		var source = RpiConfig.SourceServer+RpiConfig.SourceTemplate.Files[0].S3Location+'/'+RpiConfig.SourceTemplate.Files[0].FileName;
		if(RpiConfig.SourceTemplate.Files[0].isRoot){
			var dest = RpiConfig.SourceTemplate.Files[0].NodeLocation+'/'+RpiConfig.SourceTemplate.Files[0].FileName;
		}
		else{
			var dest = path.join(__dirname+'/'+RpiConfig.SourceTemplate.Files[0].NodeLocation+'/'+RpiConfig.SourceTemplate.Files[0].FileName);
		}

		console.log('source: '+source);
		console.log('dest: '+dest);
		

		// console.log(source);
		if(RpiConfig.SourceTemplate.Files[0].isDelete){
			removeRequest(dest,
							function(){
									removeSourceFile(RpiConfig.SourceTemplate.Files[0].FileID);
								}, 
							function(){
									setTimeout(function(){
										console.log('INTERVAL Source TRIGGER');
										RpiConfig.SourceFileDownloading = false;
										runSourceDownload();
									}, 5000);
								});
		}
		else{
			downloadRequest(source, 
							dest, 
							function(){
									removeSourceFile(RpiConfig.SourceTemplate.Files[0].FileID);
								}, 
							function(){
									setTimeout(function(){
										console.log('INTERVAL Source TRIGGER');
										RpiConfig.SourceFileDownloading = false;
										runSourceDownload();
									}, 5000);
								});
		}
			

			
	}
	else{
		updateSource(RpiConfig.SourceTemplate.ARTID);
	}

}

function removeSourceFile(FileID){
	console.log('removeSourceFile');
	for(var i = 0; i < RpiConfig.SourceTemplate.Files.length; i++){
		RpiConfig.SourceTemplate.Files.splice(i, 1);
		console.log('splice');
		console.log(RpiConfig.SourceTemplate);
		processSourceFile(RpiConfig.SourceTemplate);
	}
}


function updateSource(ARTID){
	var options = {
		uri: RpiConfig.RpiServer+'/UpdateSourceFile',
		method: 'POST',
		json: {
			RpiID: RpiConfig.RpiID,
			ARTID: ARTID
		}
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('ART: '+ARTID+' UPDATED');

			// console.log(JSON.stringify(RpiConfig.ContentFiles));
			console.log(RpiConfig.SourceFiles.length);
			console.log('before');

			for(var i = 0; i < RpiConfig.SourceFiles.length; i++){
				if(RpiConfig.SourceFiles[i].ARTID == ARTID){
					RpiConfig.SourceFiles.splice(i, 1);
					// console.log(JSON.stringify(RpiConfig.ContentFiles));
					console.log(RpiConfig.SourceFiles.length);
					console.log('after');
					RpiConfig.SourceFileDownloading = false;
					runSourceDownload();
					break;
				}
			}
		}  
		else{
			console.log('ARTID: '+ARTID+' UPDATE Failed');
			RpiConfig.SourceFileDownloading = false;
			runSourceDownload();
		}
	});
}


var getSourceFiles = function(){
	//console.log('getSourceFiles')
	
	var opt = {
	   headers: { 'Content-Type': 'application/json' }
	  }
	var data = {
	    RpiID: RpiConfig.RpiID
	  }

	var options = {
		uri: RpiConfig.RpiServer+'/GetSourceFiles',
		method: 'POST',
		json: {
			RpiID: RpiConfig.RpiID
		},
	  	timeout: 3000
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log('get source success');
			// console.log('rpiCheckTempFile Success');
			// console.log(resp.body.value[0].Files);

			var data = body.value;

			//console.log('Current Source: '+RpiConfig.SourceFiles.length)

			for(var i = 0; i < data.length; i++){
				var isQueuing = false;
				for(var j = 0; j< RpiConfig.SourceFiles.length; j++){
					if(data[i].ARTID == RpiConfig.SourceFiles[j].ARTID){
						isQueuing = true;
					}
				}

				if(isQueuing == false){
					RpiConfig.SourceFiles.push(data[i]);
				}

			}

			//console.log('New Source: '+RpiConfig.SourceFiles.length)

			runSourceDownload();

			
		}
		else{
			console.log('connection failed get source file');
		}
	});
}



var nodeAlive = function(){
	//console.log('nodeAlive')
	// var opt = {
	//    headers: { 'Content-Type': 'application/json' }
	//   }
	// var data = {
	//     RpiID: RpiConfig.RpiID
	//   }

	// needle.post('https://api.aircast.ph'+'/rpiLastNodeAlive', data, opt, function(err, resp) {
	// 	console.log('done');
	// })


	var options = {
		uri: RpiConfig.RpiServer+'/LastNodeAlive',
		method: 'POST',
		json: {
			RpiID: RpiConfig.RpiID
		},
	  	timeout: 3000
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log('alive done')

			
		}
		else{
			console.log('connection failed last alive');
		}
	});


}




module.exports = {
	config: RpiConfig,
	getConfig: getConfig,
	getRpiFiles: getRpiFiles,
	getSourceFiles: getSourceFiles,
	nodeAlive: nodeAlive,
	// removeFile: removeFile
};