# Sails Proto - Object Prototypes for Sails

## -- WARNING: UNDER HEAVY DEVELOPMENT --

### Motivation

Certain application-level components are found in some form in nearly every application, for example, the concept of a user object. A user object has some sense of uniqueness -- an id or name, authentication, logging in, logging out, etc.

The goal of this project is to provide useful prototypes from which you can inherit. For example, the user prototype implements the concept of a unique name, a password which is hashed and stored in the database, logging in, logging out, and provides a way for access control for other objects.

### How it works

User.js

```sh
var proto = require('sails-proto');

var User = function(){
	
	this.attribute.attributeExtension = 'yourAttributeExtension';

	this.modelExtension = function(){
		// your code
	}
};

User.prototype = new proto.model.user();

module.exports = proto.compile(User);

```


UserController.js

```sh

var proto = require('sails-proto');

var UserController = function(){
	this.myExtension = function(req,res){
		res.send('this is an extension to the user controller!');
	}
}

UserController.prototype = new proto.user.controller();

module.exports = proto.compile(UserController);

```

License: MIT

Copyright (c) 2014 Project Gemini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

