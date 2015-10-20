'use strict';
var Hapi = require('hapi');
var hapiVtree = require('hapi-vtree');
var humbleSession = require('../../humble-session/lib').plugin;
var humbleAuth = require('../lib');
var sessionStore = require('./session-store');
var h = require('virtual-dom/h');

var server = new Hapi.Server();

server.connection({ port: '6444' });

server.register([{
    register: sessionStore
  }, {
    register: humbleSession,
    options: {
      password: 'some-pass',
      isSecure: false,
      sessionStoreName: 'session-store'
    }
  }, {
    register: humbleAuth
  }, {
    register: hapiVtree
  }], function(err) {
  if (err) {
    console.log('Failed to start server.');
    return;
  }

  server.auth.strategy('simple', 'session');

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: function(req, reply) {
        reply.vtree(h('div', [
          h('div', 'Hey, this is a public page'),
          h('form', { method: 'post' }, [
            h('button', { type: 'submit' }, 'log in')
          ])
        ]));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    config: {
      handler: function(req, reply) {
        reply.setSession({
          user: {
            name: 'John'
          }
        });
        reply.redirect('/private');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/private',
    config: {
      auth: 'simple',
      handler: function(req, reply) {
        reply.vtree(h('div', [
          h('div', 'Hey, this is a private page'),
          h('div', [
            'your name is ',
            req.auth.credentials.name
          ]),
        ]));
      }
    }
  });

  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });
});
