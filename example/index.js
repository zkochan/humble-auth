'use strict';
var Hapi = require('hapi');
var hapiVtree = require('hapi-vtree');
var humbleSession = require('humble-session');
var humbleAuth = require('../lib');
var h = require('virtual-dom/h');

var server = new Hapi.Server();

server.connection({ port: '6444' });

server.register([{
    register: require('simple-session-store')
  }, {
    register: humbleSession,
    options: {
      password: 'some-pass',
      isSecure: false,
      sessionStoreName: 'simple-session-store'
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

  server.auth.strategy('default', 'session');

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
        }, function(err) {
          reply.redirect('/private');
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/private',
    config: {
      auth: 'default',
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
