'use strict';

var proto = require('sails-proto');

var model = function(){
	this.isCool = function(){
		return true;
	}
};

model.prototype = new proto.user.model();

module.exports = proto.compile(model);
