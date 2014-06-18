'use strict';

var responses = {
	'badRequest':require('./badRequest.js'),
	'forbidden':require('./forbidden.js'),
	'notFound':require('./notFound.js'),
	'ok':require('./ok.js'),
	'serverError':require('./serverError.js'),
	'unauthorized':require('./unauthorized.js')
};

module.exports = responses;
