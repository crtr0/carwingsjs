var request  = require('request')
  , xpath    = require('xpath')
  , dom      = require('xmldom').DOMParser
  , fs       = require('fs')
  , mustache = require('mustache')
  , util     = require('util');

exports.login = function(config, callback) {

  fs.readFile(__dirname+'/payload.xml', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }

    var output = mustache.render(data, config);

    request.post({
      url: 'https://nissan-na-smartphone-biz.viaaq.com/aqPortal/smartphoneProxy/userService',
      headers: {
        'User-Agent': 'NissanLEAF/1.40 CFNetwork/485.13.9 Darwin/11.0.0 leafjs',
        'Content-Type': 'text/xml'
        },
      jar: true,
      body: output
      },
      function(error, response, body) {
        
        var doc = new dom().parseFromString(body)
          , select = xpath.useNamespaces({"ns3": "urn:com:hitachi:gdc:type:report:v1"})
          , loginResponse = {};

        loginResponse._rawXML = body;        
        loginResponse.batteryCapacity = select('//ns3:BatteryCapacity/text()', doc)[0].nodeValue;
        loginResponse.batteryChargingStatus = select('//ns3:BatteryChargingStatus/text()', doc)[0].nodeValue;
        loginResponse.pluginState = select('//ns3:PluginState/text()', doc)[0].nodeValue;
        loginResponse.timeRequiredToFull = select('//ns3:HourRequiredToFull/text()', doc)[0].nodeValue + ":" + select('//ns3:MinutesRequiredToFull/text()', doc)[0].nodeValue;

        callback(err, loginResponse);
      });
  });
};

