'use strict';
let JSRequest = require('./../../../modules/JSRequest');

class PEP {
  constructor() {
    this.request = new JSRequest();
  }

  send(message) {
    return new Promise((resolv, reject) => {
        this.request.get('/PDP-request', (err, response, statusCode) => {
            if (err) {
              reject(err);
            } else {
              resolv(response.status, (typeof response.msg !== 'undefined' ? response.msg : message));
            }
          });
      });
  }

}
