var aircast = require("./aircastServer.js");
var request = require("request");
var ip = require("ip");

var get = (programmaticOptions, cb) => {
  function callback(error, response, body) {
    if (!error && response.statusCode)
      cb({
        error,
        response,
        body
      });
  }

  request(programmaticOptions, callback);
};

var enable = (CampaignID, programmaticOptions, cb) => {
  //GET IF THERES A PROGRAMMATIC CAMPAIGN
  function callback(error, response, body) {
    if (!error && response.statusCode) {
      if (body.seatbid[0].bid.length > 0) {
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
            cb("Programmatic campaign on.");
          }
        );
      }
    }
  }

  request(programmaticOptions, callback);
};

var disable = (CampaignID, cb) => {
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

var initialize = (option, cb) => {
  // FUNCTION TO GET PROGRAMMATIC CONFIGURATION
  request(
    {
      method: "GET",
      url:
        aircast.config.RpiServer +
        "/programmatic_config/" +
        aircast.config.RpiID
    },
    (error, response, body) => {
      if (error) throw error;
      var data = JSON.parse(body);
      if (data.length > 0) {
        configData = data[0];

        var programmaticData = {
          id: configData.ProgrammaticID,
          imp: [
            {
              id: configData.BannerID,
              banner: {
                id: configData.BannerID,
                w: configData.BannerWidth,
                h: configData.BannerHeight,
                ext: {
                  rp: {
                    size_id: configData.SizeID
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
            ip: ip.address(),
            ua: "Aircast 1.0",
            geo: {
              lat: configData.DeviceGeoLat,
              lon: configData.DeviceGeoLong,
              city: configData.DeviceGeoCity
            }
          }
        };

        var programmaticOptions = {
          method: "POST",
          uri: "http://staged-by.rubiconproject.com/a/api/exchange.json",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Aircast 1.0",
            Authorization: "Basic YWlyY2FzdDoyRzBQVjBJUE1D"
          },
          json: true,
          body: programmaticData
        };

        if (option == "ENABLE") {
          enable(data[0].CampaignID, programmaticOptions, result => {
            cb(result);
          });
        } else if (option == "DISABLE") {
          disable(data[0].CampaignID, result => {
            cb(result);
          });
        } else if (option == "GET") {
          get(programmaticOptions, response => {
            cb(response);
          });
        }
      } else {
        cb("No programmatic config.");
      }
    }
  );
};

module.exports = {
  initialize
};
