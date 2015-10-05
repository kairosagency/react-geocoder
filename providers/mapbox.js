var xhr = require('xhr'),
  uri = require('urijs');


var mapbox = function(access_token) {

  return {
    access_token: access_token,

    format: 'json',

    dataset: 'mapbox.places',

    limit: 5,

    endpoint: uri('http://api.mapbox.com/v4/geocode'),

    search: function(query, params, callback) {
      if(query) {

        var queryParams = {access_token: this.access_token};

        var request = this.endpoint.clone();

        if(params.dataset) {
          request.segment(params.dataset);
        } else {
          request.segment(this.dataset);
        }

        request.segment(query).suffix(this.format);

        if(params.proximity) {
          var longitude = params.proximity.lng||params.proximity.lon||params.proximity.longitude
          var latitude = params.proximity.lat||params.proximity.latitude
          queryParams.proximity = [longitude, latitude].join(',');
        }

        request.query(queryParams);
        var searchTime = new Date();

        xhr({
        uri: request.toString(),
        json: true
        }, function(err, res, body) {
          console.log(body);
          if(body && body.features && body.features.length > 0) {
            // filter by point results
            var results = body.features;
            results.map(function(elt, index) {
              if(elt.geometry.type != 'Point') {
                return null;
              };
              //alias variable
              elt.place_name = elt.address + " " + elt.text;
              elt.longitude = elt.geometry.coordinates[0];
              elt.latitude = elt.geometry.coordinates[1];
              return elt;
            }).reduce(function(a,b){b?a.push(b):''; return a;},[]);
          };
          callback(err, res, results, searchTime);
        });
      } else {
        throw new Error("null query");
      }

    }
  }
}


module.exports = mapbox;