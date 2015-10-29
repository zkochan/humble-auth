# humble-auth

A [hapi](http://hapijs.com/) authentication strategy using [humble-session](https://github.com/zkochan/humble-session).

[![Dependency Status](https://david-dm.org/zkochan/humble-auth/status.svg?style=flat)](https://david-dm.org/zkochan/humble-auth)
[![Build Status](https://travis-ci.org/zkochan/humble-auth.svg?branch=master)](https://travis-ci.org/zkochan/humble-auth)
[![npm version](https://badge.fury.io/js/humble-auth.svg)](http://badge.fury.io/js/humble-auth)


## Installation

```
npm i --save humble-auth
```


## Usage

The plugin has to be registered and the authentication scheme created.

Humble-auth also needs the [humble-session](https://github.com/zkochan/humble-session)
plugin for functioning.

```js
var server = new Hapi.Server();
server.connection({ port: 8000 });

server.register(require('humble-auth'), function(err) {
  server.auth.strategy('session', 'session');
});
```


## API

* [`login`](#login), `logIn`, `signIn`
* [`logout`](#logout), `logOut`, `signOut`


<a name="login" />
### reply.login(user, cb)

Saves the passed user to the session, making him logged in.

__Arguments__
`user` - The object the identifies the user.
`cb(err)` - A callback which is called once the user was saved to the session.

__Examples__

```js
/*...*/
request.login({
  id: user.id
}, function(err) {
  if (err) {
    return reply(Boom.wrap(err));
  }
  reply.redirect('/some-private-page');
});
```


<a name="logout" />
### reply.logout([cb])

Removes the current user from the session, terminating his login session.

__Arguments__

`cb(err)` - *Optional* A callback which is called once the user is removed from
the session.

__Examples__

```js
request.logout(function() {
  if (err) {
    return reply(Boom.wrap(err));
  }
  reply.redirect('/');
});
```


## License

MIT
