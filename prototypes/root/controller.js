'use strict';

var protoResponse = require('./../response/index.js');

var root = function(config){
	this.respond = protoResponse;
};

module.exports = root;
