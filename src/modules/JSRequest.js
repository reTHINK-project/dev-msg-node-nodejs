'use strict';
class JSRequest {
    constructor() {
      this._client = require('request');
    }

    get(url, callback) {
      this._client.get(url)
          .on('response', function(response) {
            callback(null, response);
          });
    }

    put(url, message, callback) {
      this._client.post({
        headers: {'content-type': 'application/json'},
        url: url,
        body: message
      }, function(err, response, body) {
        if (err) {
          callback(err, null, null);
        }

        callback(null, body, response.statusCode);
      });
    }

    del(url, callback) {
      this._client.del(url)
        .on('response', function(response) {
          callback(null, response.statusCode);
        });
    }
}
module.exports = JSRequest;
