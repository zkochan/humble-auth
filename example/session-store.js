'use strict';

exports.register = function(server, opts, next) {
  server.expose((function() {
    var cache = {};
    return {
      get: function(sid, cb) {
        return cb(null, cache[sid] || {});
      },
      set: function(sid, session) {
        cache[sid] = session;
      }
    };
  })());

  next();
};

exports.register.attributes = {
  name: 'session-store'
};
