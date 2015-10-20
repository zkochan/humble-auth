'use strict';

var scheme = require('./scheme');

exports.register = function(server, options, next) {
  server.auth.scheme('session', scheme);
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
