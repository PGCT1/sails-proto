'use strict';

module.exports = function(config){

	if(!config || !config.model){
		throw 'sails-proto: Error constructing root object - invalid configuration.';
	}

	var model = config.model;

	this.attributes = {};
}
