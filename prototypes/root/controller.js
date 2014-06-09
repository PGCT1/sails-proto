'use strict';

var protoResponse = require('./../response/index.js');

var root = function(){
	this.respond = protoResponse;
};

module.exports = root;
