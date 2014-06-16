'use strict';

var root = require('../root/model.js');

var model = function(config){

	/*

		Configuration setup
			model - model name for the new object (required)
			owner - name of the owning model; should inherit from User (default: 'user')
	
	*/

	if(!config || !config.model){
		throw 'sails-proto: Invalid model configuration - an owned object must have an objectName configured.';
	}

	if(!config.owner){
		config.owner = 'user';
	}

	root.apply(this,[config]);

	this.attributes[config.owner+'Id'] = {
		model:config.owner,
		required:true
	};

}

model.prototype = root;
model.prototype.constructor = model;

module.exports = model;
