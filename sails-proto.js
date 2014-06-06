'use strict';

module.exports.user = {
	controller:require('./user/controller.js'),
	model:require('./user/model.js')
};

module.exports.response = require('./response/index.js');
