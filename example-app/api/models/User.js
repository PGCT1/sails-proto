'use strict';

var proto = require('sails-proto');

var model = function(){

	this.schema = true;

	this.isCool = function(){
		return true;
	}
};

model.prototype = new proto.user.model({model:'user'});

module.exports = proto.compile(model);
