var aircast = require("./aircastServer.js");
var request = require("request");
var fs = require("fs");
var publicIP = require("public-ip");

var myIP = "";
(async () => {
  myIP = await publicIP.v4();
})();

var saveLog = (RpiID, CampaignID, statuscode, has_ad, log) => {
  var data = {
    RpiID: RpiID,
    CampaignID: CampaignID,
    statuscode: statuscode,
    has_ad: has_ad,
    log: JSON.stringify(log)
  };

  var option = {
    method: "POST",
    url: aircast.config.RpiServer + "/insert_programmatic_log",
    json: true,
    body: data
  };

  function callback(error, response, body) {
    if (!error) {
      null;
    } else {
      throw error;
    }
  }

  request(option, callback);
};

var readData = (CampaignID, cb) => {
  // FUNCTION TO READ AD RESPONSE DATA FROM A FILE
  const filePath = __dirname + "/scratch/programmatic_" + CampaignID;
  fs.readFile(filePath, { encoding: "utf8" }, function(err, data) {
    if (!err) {
      cb(JSON.parse(data));
    }
  });
};

var saveData = (CampaignID, data) => {
  // FUNCTION TO SAVE AD RESPONSE IN A FILE
  const filePath = __dirname + "/scratch/programmatic_" + CampaignID;
  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.writeFile(filePath, data, function(err) {
        if (!err) {
          console.log("Saved new programmatic response.");
        }
      });
    } else {
      fs.writeFile(filePath, data, function(err) {
        if (!err) {
          console.log("Saved new programmatic response.");
        }
      });
    }
  });
};

var get = (CampaignID, cb) => {
  // FUNCTION TO GET PROGRAMMATIC CAMPAIGN
  readData(CampaignID, result => {
    cb(result);
  });
};

var enable = (CampaignID, programmaticOptions, cb) => {
  var has_ad = false;
  // GET IF THERES A PROGRAMMATIC CAMPAIGN ENABLE IT
  function callback(error, response, body) {
    if (!error && response.statusCode) {
      const programmaticResponse = body;
      // console.log(programmaticResponse);
      if (body != undefined) {
        if (body.seatbid[0].bid.length > 0) {
          has_ad = true;
          saveData(CampaignID, JSON.stringify(programmaticResponse));
          request(
            {
              method: "PUT",
              url: aircast.config.RpiServer + "/update_programmatic",
              json: true,
              body: {
                rpi_id: aircast.config.RpiID,
                campaign_id: CampaignID,
                value: 1
              }
            },
            (error, response, body) => {
              if (error) throw error;
              cb(`Programmatic Campaign ID: ${CampaignID} on.`);
            }
          );
        }
      }
      saveLog(
        aircast.config.RpiID,
        CampaignID,
        programmaticResponse.statuscode,
        has_ad,
        programmaticResponse
      );
    } else {
      saveLog(aircast.config.RpiID, CampaignID, null, has_ad, error);
    }
  }

  request(programmaticOptions, callback);
};

var disable = (CampaignID, cb) => {
  // FUNCTION TO DISABLE PROGRAMMATIC TEMPLATE
  request(
    {
      method: "PUT",
      url: aircast.config.RpiServer + "/update_programmatic",
      json: true,
      body: {
        rpi_id: aircast.config.RpiID,
        campaign_id: CampaignID,
        value: 0
      }
    },
    (error, response, body) => {
      if (error) throw error;
      cb({ status: "sucess" });
    }
  );
};

var initialize = CampaignID => {
  // FUNCTION TO GET PROGRAMMATIC CONFIGURATION AND ENABLE WITH AD RESPONSE
  request(
    {
      method: "GET",
      url:
        aircast.config.RpiServer +
        "/programmatic_campaign_config/image/" +
        CampaignID
    },
    (error, response, body) => {
      if (error) throw error;
      var data = JSON.parse(body);
      configData = data[0];

      if (configData.isActive == 1) {
        var programmaticData = {
          id: configData.ProgrammaticID,
          imp: [
            {
              id: configData.ImpressionID,
              banner: {
                id: configData.BannerID,
                w: configData.BannerWidth,
                h: configData.BannerHeight,
                ext: {
                  rp: {
                    size_id: configData.SizeID,
                    usenurl: 1,
                    useimptrackers: 1
                  }
                }
              },
              ext: {
                rp: {
                  zone_id: configData.ZoneID
                }
              }
            }
          ],
          site: {
            name: "Aircast Test",
            page: "http://palmsolutions.co",
            publisher: {
              ext: {
                rp: {
                  account_id: configData.AccountID
                }
              }
            },
            ext: {
              rp: {
                site_id: configData.SiteID
              }
            }
          },
          device: {
            name: "GTM 0001",
            ip: myIP,
            ua: "Aircast 1.0",
            geo: {
              lat: parseFloat(configData.DeviceGeoLat),
              lon: parseFloat(configData.DeviceGeoLong),
              city: configData.DeviceGeoCity
            },
            ext: {
              dooh: {
                impmultiply: configData.ImpressionMultiplier
              }
            }
          }
        };

        var programmaticOptions = {
          method: "POST",
          uri: "http://exapi-apac.rubiconproject.com/a/api/exchange.json",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Aircast 1.0",
            Authorization: "Basic YWlyY2FzdDoyRzBQVjBJUE1D"
          },
          json: true,
          body: programmaticData
        };

        enable(CampaignID, programmaticOptions, response => {
          console.log(response);
        });
      }
    }
  );
};

var check = cb => {
  // FUNCTION TO CHECK PROGRAMMATIC CAMPAIGN IN A TV AND GET THE CAMPAIGN ID.
  request(
    {
      method: "GET",
      url:
        aircast.config.RpiServer +
        "/programmatic_template/image/" +
        aircast.config.RpiID
    },
    (error, response, body) => {
      if (!error) {
        var data = JSON.parse(body);
        cb(data);
      }
    }
  );
};

module.exports = {
  check,
  initialize,
  enable,
  disable,
  get
};
