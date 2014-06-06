'use strict';

module.exports.user = {
	controller:require('./user/controller.js'),
	model:require('./user/model.js')
};

module.exports.response = {
	'badRequest':require('./response/badRequest.js'),
	'forbidden':require('./response/forbidden.js'),
	'notFound':require('./response/notFound.js'),
	'ok':require('./response/ok.js'),
	'serverError':require('./response/serverError.js'),
	'unauthorized':require('./response/unauthorized.js')
};
