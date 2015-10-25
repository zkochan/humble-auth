'use strict';

var expect = require('chai').expect;
var Hapi = require('hapi');
var humbleAuth = require('../lib');

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
});
