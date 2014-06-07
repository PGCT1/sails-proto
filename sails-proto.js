'use strict';

module.exports.user = {
	controller:require('./prototypes/user/controller.js'),
	model:require('./prototypes/user/model.js')
};

module.exports.response = require('./prototypes/response/index.js');
