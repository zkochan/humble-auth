'use strict';

var Boom = require('boom');

module.exports = function(server, opts) {
  opts = opts || {};

  if (typeof opts.appendNext === 'boolean') {
    opts.appendNext = (opts.appendNext ? 'next' : '');
  }

  var scheme = {};

  scheme.authenticate = function(req, reply) {
    function unauthenticated(err, result) {
      if (opts.redirectOnTry === false && // Defaults to true
          req.auth.mode === 'try') {

        return reply(err, null, result);
      }

      var redirectTo = opts.redirectTo;
      if (req.route.settings.plugins['humble-auth'] &&
        req.route.settings.plugins['humble-auth'].redirectTo !== undefined) {

        redirectTo = req.route.settings.plugins['humble-auth'].redirectTo;
      }

      if (!redirectTo) {
        return reply(err, null, result);
      }

      var uri = redirectTo;
      if (opts.appendNext) {
        if (uri.indexOf('?') !== -1) {
          uri += '&';
        } else {
          uri += '?';
        }

        uri += opts.appendNext + '=' + encodeURIComponent(req.url.path);
      }

      return reply('You are being redirected...', null, result).redirect(uri);
    }

    req.getSession(function(err, session) {
      if (err) {
        return unauthenticated(Boom.unauthorized('Incorrect session ID'));
      }
      if (session && session.user) {
        return reply.continue({
          credentials: session.user
        });
      }
      return unauthenticated(Boom.unauthorized());
    });
  };

  return scheme;
};
