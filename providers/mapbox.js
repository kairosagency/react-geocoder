var xhr = require('xhr'),
  uri = require('uri');


var mapbox = function(access_token){

  return {
    access_token: access_token,

    format: 'json',

    limit: 5,

    endpoint: uri('http://api.mapbox.com/v4/geocode'),

    search: function(query, callback, source, proximity) {
      if(query) {

        var request = this.endpoint.clone();

        if(source) {
          request.segment(source);
        }

        request.segment(query).suffix(this.format);

        if(proximity) {
          if(typeof proximity === "object") {
            var longitude = proximity.lng || proximity.long || proximity.longitude
            var latitude = proximity.lat || proximity.latitude
            request.query({proximity: [longitude, latitude].join(',')});
          } else {
            request.query({proximity: proximity);
          }
        }

        request.query({access_token: this.access_token});

        var searchTime = new Date();

        xhr({
        uri: request.toString(),
        json: true
        }, function(err, res, body) {
          callback(err, res, body, searchTime);
        });
      } else {
        throw new Error("null query");
      }

    }
  }
}


module.exports mapbox;