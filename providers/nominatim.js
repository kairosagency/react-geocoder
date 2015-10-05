var xhr = require('xhr');
var uri = require('urijs');


var nominatim = {
  format: 'json',

  limit: 5,

  endpoint: uri('http://nominatim.openstreetmap.org/search'),

  search: function(query, params, callback) {
    if(query) {
      var queryParams = {q: query, format: this.format, limit: this.limit};
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

module.exports = nominatim;