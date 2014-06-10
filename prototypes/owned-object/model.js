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

	var model = config.model;
	var owner = 'user';
	var publiclyVisible = true;
	var deletable = true;
	var updatable = true;

	if(config.owner){
		owner = config.owner;
	}

	this.attributes[owner+'Id'] = {
		model:owner
	};

	


}

model.prototype = new root();

module.exports = model;
