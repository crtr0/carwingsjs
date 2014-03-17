var request = require('request')
  , xml2js  = require('xml2js')
  , util    = require('util')
  , js2xml  = require('data2xml')()
  , parser  = new xml2js.Parser({explicitArray: false});

var PLUGIN_STATUS_DISCONNECTED  = 'NOT_CONNECTED'
  , PLUGIN_STATUS_CONNECTED     = 'CONNECTED';

/**
 * HTTP POST to the Carwings SOAP webservice
 * 
 * @param {String} service
 * @param {Object} payload
 * @param {Function} callback
 * @api private
 */
var _post = function(service, payload, callback) {
  request.post({
    url: 'https://nissan-na-smartphone-biz.viaaq.com/aqPortal/smartphoneProxy/' + service,
    headers: {
      'User-Agent': 'NissanLEAF/1.40 CFNetwork/485.13.9 Darwin/11.0.0 carwingsjs',
      'Content-Type': 'text/xml'
      },
    jar: true,
    body: js2xml(payload[0], payload[1]) },
    function(error, response, body) {
      if (error) {
        //console.log(error);
        callback(error);
      }
      else {  
        //console.log(response);
        console.log(body);
        parser.parseString(body, callback);
      }      
    });
};

/**
 * Extracts key bits of info from a <ns4:SmartphoneLatestBatteryStatusResponse> node
 *
 * @param {Object} node
 * @return {Object}
 * @api private
 */
var _getVehicle = function(node) {
  vehicleResponse = {};
  vehicleResponse.vin = node['SmartphoneBatteryStatusResponseType']['VehicleInfo']['Vin'];
  vehicleResponse.batteryChargingStatus = node['SmartphoneBatteryStatusResponseType']['ns3:BatteryStatusRecords']['ns3:BatteryStatus']['ns3:BatteryChargingStatus'];
  vehicleResponse.batteryCapacity = node['SmartphoneBatteryStatusResponseType']['ns3:BatteryStatusRecords']['ns3:BatteryStatus']['ns3:BatteryCapacity'];
  vehicleResponse.batteryRemainingAmount = node['SmartphoneBatteryStatusResponseType']['ns3:BatteryStatusRecords']['ns3:BatteryStatus']['ns3:BatteryRemainingAmount'];
  vehicleResponse.lastBatteryStatusCheckExecutionTime = node['SmartphoneBatteryStatusResponseType']['lastBatteryStatusCheckExecutionTime']
  vehicleResponse.pluginState = node['SmartphoneBatteryStatusResponseType']['ns3:BatteryStatusRecords']['ns3:PluginState'];
  if (vehicleResponse.pluginState != PLUGIN_STATUS_DISCONNECTED) {
    vehicleResponse.hoursRequiredToFull = node['SmartphoneBatteryStatusResponseType']['ns3:BatteryStatusRecords']['ns3:TimeRequiredToFull']['ns3:HourRequiredToFull'];
    vehicleResponse.minutesRequiredToFull = node['SmartphoneBatteryStatusResponseType']['ns3:BatteryStatusRecords']['ns3:TimeRequiredToFull']['ns3:MinutesRequiredToFull'];
  }
  return vehicleResponse;
};

/**
 * Login to the Carwings service. Please note that the vehicle data
 * returned is generally stale. You will need to call `requestUpdate` if you
 * want the most current data from the car.
 *
 * @param username
 * @param password
 * @param callback
 * @api public
 */
exports.login = function(username, password, callback) {

  var payload = [
    'ns2:SmartphoneLoginWithAdditionalOperationRequest', {
    _attr: { 'xmlns:ns2' : 'urn:com:airbiquity:smartphone.userservices:v1' },
    'SmartphoneLoginInfo' : {
      'UserLoginInfo' : {
        'userId' : username,
        'userPassword' : password },
      'DeviceToken': util.format('DUMMY%s', (new Date()).getTime()),
      'UUID': util.format('carwingsjs:%s', username),
      'Locale': 'US',
      'AppVersion': '1.40',
      'SmartphoneType': 'IPHONE'},
      'SmartphoneOperationType': 'SmartphoneLatestBatteryStatusRequest'
    }];

  _post('userService', payload, function(error, result) {
    if (error) {
      callback(error);
    }
    else {
      var loginResponse = _getVehicle(result['ns2:SmartphoneLoginWithAdditionalOperationResponse']['ns4:SmartphoneLatestBatteryStatusResponse']);
      loginResponse._full = result;
      callback(null, loginResponse);
    }
  });
};

/**
 * Tell Carwings to ping the car from a data refresh. This method
 * return no data. It will take anywhere from 30 seconds to 5 minutes
 * for the data in Carwings to get refreshed and cached.
 *
 * @param vin
 * @param callback
 * @api public
 */
exports.requestUpdate = function(vin, callback) {

  var payload = ['ns4:SmartphoneRemoteBatteryStatusCheckRequest', {
    _attr: { 
      'xmlns:ns4' : 'urn:com:airbiquity:smartphone.vehicleservice:v1',
      'xmlns:ns3' : 'urn:com:hitachi:gdc:type:vehicle:v1',
      'xmlns:ns2' : 'urn:com:hitachi:gdc:type:portalcommon:v1' },
    'ns3:BatteryStatusCheckRequest' : { 
      'ns3:VehicleServiceRequestHeader': {
        'ns2:VIN': vin }
      }
    }];

  _post('vehicleService', payload, callback);
};


/**
 * Return information about the car. Please note that the vehicle data
 * returned is generally stale. You will need to call `requestUpdate` if you
 * want the most current data from the car.
 *
 * @param vin
 * @param callback
 * @api public
 */
exports.vehicleStatus = function(vin, callback) {

  var payload = ['ns2:SmartphoneGetVehicleInfoRequest', {
    _attr: { 'xmlns:ns2' : 'urn:com:airbiquity:smartphone.userservices:v1' },
    'VehicleInfo' : {
      'Vin' : vin },
    'SmartphoneOperationType': 'SmartphoneLatestBatteryStatusRequest',
    'changeVehicle': 'false'      
    }];

  _post('userService', payload, function(error, result) {
    if (error) {
      callback(error);
    }
    else {
      var vehicleResponse = _getVehicle(result['ns2:SmartphoneGetVehicleInfoResponse']['ns4:SmartphoneLatestBatteryStatusResponse']);
      vehicleResponse._full = result;
      callback(null, vehicleResponse);
    }
  });
};
