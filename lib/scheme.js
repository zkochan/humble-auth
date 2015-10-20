'use strict';

var Boom = require('boom');

module.exports = function(server, opts) {
  var scheme = {};

  scheme.authenticate = function(req, reply) {
    req.getSession(function(session) {
      if (session && session.user) {
        return reply.continue({
          credentials: session.user
        });
      }
      reply(Boom.unauthorized());
    });
  };

  return scheme;
};
