'use strict';

module.exports = function(config){

	if(!config || !config.model){
		throw 'sails-proto: Error constructing root object - invalid configuration.';
	}

	this.attributes = {};
}
