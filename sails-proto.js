'use strict';

module.exports.user = {
	controller:require('./user/controller.js'),
	model:require('./user/model.js')
};

module.exports.response = {
	"badRequest":"./response/badRequest.js",
	"forbidden":"./response/forbidden.js",
	"notFound":"./response/notFound.js",
	"ok":"./response/ok.js",
	"serverError":"./response/serverError.js",
	"unauthorized":"./response/unauthorized.js"
};
