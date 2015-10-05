var xhr = require('xhr');
var uri = require('urijs');


var mapquest = function(_access_token) {
  return  {
    access_token: _access_token,

    format: 'json',

    limit: 5,

    endpoint: uri('http://open.mapquestapi.com/geocoding/v1/address'),

    search: function(query, callback) {

      if(query) {
        var request = this.endpoint.clone().query({location: query, outFormat: this.format, key: this.access_token, maxResults: this.limit});
        var searchTime = new Date();

        xhr({
        uri: request.toString(),
        json: true
        }, function(err, res, body) {
          var locations = [];
          if(body && body.results && body.results.locations.length > 0) {
            locations = body.results.locations;
            locations.map(function(elt, index) {
              //alias variable
              elt.id = elt.providedLocation.id;
              elt.place_name = elt.street + " " + elt.postalCode ;
              elt.lng = elt.latLng.lng;
              elt.longitude = elt.lng;
              elt.lon = elt.lng;
              elt.latitude = elt.latLng.lat;
              elt.lat = elt.latitude;
            });
          }
          callback(err, res, locations, searchTime);
        });
      } else {
        throw new Error("null query");
      }
    }
  }
}

module.exports = mapquest;