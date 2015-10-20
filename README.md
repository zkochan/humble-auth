# humble-auth

A hapi authentication strategy using humble-session.

[![Dependency Status](https://david-dm.org/zkochan/humble-auth/status.svg?style=flat)](https://david-dm.org/zkochan/humble-auth)
[![Build Status](https://travis-ci.org/zkochan/humble-auth.svg?branch=master)](https://travis-ci.org/zkochan/humble-auth)
[![npm version](https://badge.fury.io/js/humble-auth.svg)](http://badge.fury.io/js/humble-auth)


# Installation

```
npm i --save hapi-auth
```


# Usage

The plugin has to be registered and the authentication scheme created.

Humble-auth also needs the [humble-session](https://github.com/zkochan/humble-session)
for functioning.

```js
var server = new Hapi.Server();
server.connection({ port: 8000 });

server.register(require('humble-auth'), function(err) {
  server.auth.strategy('session', 'session');
});
```


# License

MIT
