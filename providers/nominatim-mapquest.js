var xhr = require('xhr');
var uri = require('urijs');


var mapquest = function(_access_token) {
  return  {
    access_token: _access_token,

    format: 'json',

    limit: 5,

    endpoint: uri('http://open.mapquestapi.com/nominatim/v1/search.php'),

    search: function(query, params, callback) {

      if(query) {
        var queryParams = {q: query, format: this.format, limit: this.limit, key: this.access_token};
        var request = this.endpoint.clone();

        if(params.countrycodes) {
          if(typeof params.countrycodes == "string") {
            params.countrycodes = [params.countrycodes];
          }
          queryParams.countrycodes = params.countrycodes.join(',');
        }


        request.query(params);

        var searchTime = new Date();
        xhr({
        uri: request.toString(),
        json: true
        }, function(err, res, body) {
          if(body) {
            body.map(function(elt) {
              //alias variable
              elt.id = elt.place_id;
              elt.place_name = elt.display_name;
              elt.lng = elt.lon;
              elt.longitude = elt.lon;
              elt.latitude = elt.lat;
            });
          }
          callback(err, res, body, searchTime);
        });
      } else {
        throw new Error("null query");
      }
    }
  }
}

module.exports = mapquest;