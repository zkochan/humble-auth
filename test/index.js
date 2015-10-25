'use strict';

var expect = require('chai').expect;
var Hapi = require('hapi');
var humbleAuth = require('../lib');
var humbleSession = require('humble-session');
var simpleSessionStore = require('simple-session-store');

describe('humble-auth', function() {
  it('passes', function(done) {
    var server = new Hapi.Server();
    server.connection();
    server.register(humbleAuth, function(err) {
      expect(err).to.not.exist;

      expect(function() {
        server.auth.strategy('default', 'session');
      }).to.not.throw();

      done();
    });
  });

  it('authenticates a request', function(done) {
    var cookieName = 'sid';
    var server = new Hapi.Server();
    server.connection();

    server.register([{
      register: simpleSessionStore
    }, {
      register: humbleSession,
      options: {
        cookie: cookieName,
        password: 'some-password',
        sessionStoreName: 'simple-session-store'
      }
    }, {
      register: humbleAuth
    }], function(err) {
      expect(err).to.not.exist;

      server.auth.strategy('default', 'session');

      server.route({
        method: 'GET',
        path: '/login/{user}',
        config: {
          auth: {
            mode: 'try',
            strategies: ['default']
          },
          handler: function(request, reply) {
            reply.setSession({ user: request.params.user }, function(err) {
              expect(err).to.not.exist;
              return reply(request.params.user);
            });
          }
        }
      });

      server.route({
        method: 'GET',
        path: '/resource',
        config: {
          auth: 'default',
          handler: function(request, reply) {
            done();
          }
        }
      });

      server.inject('/login/valid', function(res) {
        expect(res.result).to.equal('valid');
        var header = res.headers['set-cookie'];
        expect(header.length).to.equal(1);
        expect(header[0]).to.contain(cookieName + '=');
        var cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

        server.inject({
          method: 'GET',
          url: '/resource',
          headers: {
            cookie: cookieName + '=' + cookie[1]
          }
        }, function() {});
      });
    });
  });
});
