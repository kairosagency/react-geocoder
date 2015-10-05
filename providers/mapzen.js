var xhr = require('xhr'),
  uri = require('urijs');

var mapzen = function(_access_token){

  return {
    access_token: _access_token,

    limit: 5,

    endpoint: uri('http://search.mapzen.com/v1/search'),

    search: function(query, params, callback) {
      var self = this;
      if(query) {
        var queryParams = {
          api_key: this.access_token,
          text: query
        };
        var request = this.endpoint.clone();

        if(params.sources) {
          if(typeof params.sources === "string") {
            params.sources = [params.sources];
          }
          queryParams.sources = params.sources.join(',');
        }

        if(params.proximity) {
          queryParams["focus.point.lat"] = params.proximity.lat||params.proximity.latitude;
          queryParams["focus.point.lon"] = params.proximity.lon||params.proximity.lng||params.proximity.longitude;
        }

        if(params.country) {
          queryParams["boundary.country"] = params.country;
        }

        if(params.rect) {
          queryParams["boundary.rect.min_lat"] = params.rect.min_lat;
          queryParams["boundary.rect.min_lon"] = params.rect.min_lon;
          queryParams["boundary.rect.max_lat"] = params.rect.max_lat;
          queryParams["boundary.rect.max_lon"] = params.rect.max_lon;
        }

        if(params.circle) {
          queryParams["boundary.circle.lat"] = params.circle.lat;
          queryParams["boundary.circle.lon"] = params.circle.lon;
          queryParams["boundary.circle.radius"] = params.circle.radius;
        }
        request.query(queryParams);
        var searchTime = new Date();

        xhr({
        uri: request.toString(),
        json: true
        }, function(err, res, body) {
          if(body && body.features && body.features.length > 0) {
            // filter by point results
            var results = body.features;
            results.map(function(elt, index) {
              if(elt.geometry.type != 'Point') {
                return null;
              };
              //alias variable
              elt.id = elt.properties.id;
              elt.place_name = elt.properties.label;
              elt.longitude = elt.geometry.coordinates[0];
              elt.latitude = elt.geometry.coordinates[1];
              return elt;
            }).reduce(function(a,b){b?a.push(b):''; return a;},[]);

          };

          callback(err, res, results.splice(self.limit), searchTime);
        });
      } else {
        throw new Error("null query");
      }
    }
  }
}
module.exports = mapzen;