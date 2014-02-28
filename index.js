var request  = require('request')
  , xml2js   = require('xml2js')
  , fs       = require('fs')
  , mustache = require('mustache')
  , util     = require('util')
  , config   = require('./config');

fs.readFile('payload.xml', 'utf-8', function (err, data) {
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
    body: output
    },
    function(error, response, body) {
      console.log(error);
      obj = xml2js.parseString(body, function (err, result) {
        console.log(util.inspect(result, false, null))
      });
    });

});
