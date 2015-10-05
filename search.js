var xhr = require('xhr');

function search(endpoint, source, accessToken, proximity, query, callback) {
  var searchTime = new Date();
  var uri = endpoint + '/v4/geocode/' +
    source + '/' + (query) + '.json' +
    '?access_token=' + accessToken +
    (proximity ? '&proximity=' + proximity : '');
  xhr({
    uri: uri,
    json: true
  }, function(err, res, body) {
    if(body) {
      body.map(function(elt) { elt.id = elt.place_id });
    }
    callback(err, res, body, searchTime);
  });
}

module.exports = search;
