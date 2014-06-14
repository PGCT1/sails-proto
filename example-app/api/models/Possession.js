'use strict';

var proto = require('sails-proto');

var model = function(){
	this.schema = true;
};

model.prototype = new proto.ownedObject.model({model:'possession'});

module.exports = proto.compile(model);

