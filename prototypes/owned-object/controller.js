'use strict';

var rootController = require('../root/controller.js');
var basicAuth = require('../lib/basicAuth.js');

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

	if(!config.owner){
		config.owner = 'user';
	}

	rootController.apply(this,[config]);

	this.create = function(req,res){

		function createObject(req,res,id){

			var attributes = req.body;

			attributes[config.owner + 'Id'] = id;

			sails.models[config.model].create(attributes,function(err){

				if(err){
					sails.controllers[config.model].respond.serverError.bind({'req':req,'res':res})(err);
				}else{
					sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})();
				}

			});

		}

		// check for a valid session user id or basic auth credentials

		if(req.session[config.owner + 'Id']){
			createObject(req,res,req.session[config.owner + 'Id']);
		}else{

			try{

				basicAuth.interpretRequestCredentials(req,function(username,password){

					sails.models[config.owner].authorize(username,password,function(err,ownerId){

						if(err){
							sails.controllers[config.model].respond.unauthorized.bind({'req':req,'res':res})(err);
						}else{
							createObject(req,res,req.session[config.owner + 'Id']);
						}

					});

				});

			}catch(err){
				sails.controllers[config.model].respond.unauthorized.bind({'req':req,'res':res})();
			}

		}

	}

}

controller.prototype = rootController;
controller.prototype.constructor = controller;

module.exports = controller;
