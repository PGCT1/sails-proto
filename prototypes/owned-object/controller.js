'use strict';

var rootController = require('../root/controller.js');

var controller = function(config){

	/*

		Configuration setup
			model - model name operated on by this controller; should inherit from ownedObject (required)
			owner - name of the owning model; should inherit from User (default: 'user')
			publiclyVisible - whether this object should be publicly visible or not (default: true)
			deletable - owner can delete this object (default:true)
			updatable - owner can update this object (default:true)
	
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

	if(config.publiclyVisible){
		publiclyVisible = config.publiclyVisible;
	}

	if(config.deletable !== undefined){
		deletable = config.deletable;
	}

	if(config.updatable !== undefined){
		updatable = config.updatable;
	}

	
	


}

controller.prototype = new rootController();

module.exports = controller;
