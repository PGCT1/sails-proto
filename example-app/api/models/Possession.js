'use strict';

var proto = require('sails-proto');

var model = function(){
	this.schema = true;

	this.attributes.integer = {
		type:'integer'
	};

};

model.prototype = new proto.possession.model({
	model:'possession',
	publiclyVisible:false
});

module.exports = proto.compile(model);

