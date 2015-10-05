var xhr = require('xhr');
var uri = require('urijs');


var nominatim = {
  format: 'json',

  limit: 5,

  endpoint: uri('http://nominatim.openstreetmap.org/search'),

  search: function(query, callback) {
    console.log(this);
    if(query) {

      var request = this.endpoint.clone().query({q: query, format: this.format, limit: 5});
      var searchTime = new Date();
      console.log(query, request.toString());
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

module.exports = nominatim;