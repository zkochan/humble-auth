'use strict';

const Boom = require('boom');
const R = require('ramda');

module.exports = function(server, opts) {
  opts = opts || {};

  let scheme = {
    authenticate(req, reply) {
      let routeOpts = req.route.settings.plugins['humble-auth'] || {};
      let schemeOpts = R.merge(opts, routeOpts);
      if (typeof schemeOpts.appendNext === 'boolean') {
        schemeOpts.appendNext = (schemeOpts.appendNext ? 'next' : '');
      }

      function unauthenticated(err, result) {
        if (schemeOpts.redirectOnTry === false && // Defaults to true
            req.auth.mode === 'try') {
          return reply(err, null, result);
        }

        if (!schemeOpts.redirectTo) {
          return reply(err, null, result);
        }

        let uri = schemeOpts.redirectTo;
        if (schemeOpts.appendNext) {
          if (uri.indexOf('?') !== -1) {
            uri += '&';
          } else {
            uri += '?';
          }

          uri += schemeOpts.appendNext + '=' + encodeURIComponent(req.url.path);
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
    }
  };

  return scheme;
};
