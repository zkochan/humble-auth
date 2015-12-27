'use strict';

const scheme = require('./scheme');

let decorator = {
  login(user, cb) {
    var reply = this;

    if (!user) {
      return cb(new Error('user is required.'));
    }
    if (!cb) {
      throw new Error('cb is required.');
    }

    reply.request.getSession(function(err, session) {
      if (err) {
        return cb(err);
      }

      session.user = user;
      reply.setSession(session, function(err) {
        if (err) {
          return cb(err);
        }

        cb();
      });
    });
  },
  logout(cb) {
    cb = cb || function() {};
    var reply = this;

    reply.request.getSession(function(err, session) {
      if (err) {
        return cb(err);
      }

      delete session.user;
      reply.setSession(session, function(err) {
        if (err) {
          return cb(err);
        }

        cb();
      });
    });
  }
};

exports.register = function(server, options, next) {
  server.decorate('reply', 'login', decorator.login);
  server.decorate('reply', 'logIn', decorator.login);
  server.decorate('reply', 'signIn', decorator.login);

  server.decorate('reply', 'logout', decorator.logout);
  server.decorate('reply', 'logOut', decorator.logout);
  server.decorate('reply', 'signOut', decorator.logout);

  server.auth.scheme('session', scheme);
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
