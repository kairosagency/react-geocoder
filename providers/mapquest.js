var xhr = require('xhr');
var uri = require('urijs');


var mapquest = function(_access_token) {
  return  {
    access_token: _access_token,

    format: 'json',

    limit: 5,

    endpoint: uri('http://open.mapquestapi.com/nominatim/v1/search.php'),

    search: function(query, callback) {

      if(query) {
        var request = this.endpoint.clone().query({q: query, format: this.format, limit: 5, key: this.access_token});
        var searchTime = new Date();

        xhr({
        uri: request.toString(),
        json: true
        }, function(err, res, body) {
          if(body) {
            body.map(function(elt) { elt.id = elt.place_id; elt.place_name = elt.display_name });
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