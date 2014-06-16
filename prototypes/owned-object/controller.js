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

	if(!config.publiclyVisible){

		this.find = function(req,res){

			extractOwnerIdFromRequest(config,req,res,function(ownerId){

				var findCriteria = {};

				findCriteria[config.owner + 'Id'] = ownerId;

				sails.models[config.model].find(findCriteria).sort({'createdAt':'desc'}).limit(config.pageSize).exec(function(err,ownedObjects){

					if(err){
						sails.controllers[config.model].respond.serverError.bind({'req':req,'res':res})(err);
					}else{
						sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})(ownedObjects);
					}

				});

			});

		}

	}

	if(config.updatable === undefined || config.updatable){

		this.update = function(req,res){

			var id = req.params.id;

			if(!id){
				return sails.controllers[config.model].respond.badRequest.bind({'req':req,'res':res})();
			}

			extractOwnerIdFromRequest(config,req,res,function(ownerId){

				var updateCriteria = {};

				updateCriteria[config.owner + 'Id'] = ownerId;
				updateCriteria.id = id;

				sails.models[config.model].update(updateCriteria,req.body,function(err){

					if(err){
						sails.controllers[config.model].respond.serverError.bind({'req':req,'res':res})(err);
					}else{
						sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})();
					}

				});

			});

		}

	}else{

		this.update = function(req,res){
			sails.controllers[config.model].respond.forbidden.bind({'req':req,'res':res})();
		};

	}

	this.create = function(req,res){

		extractOwnerIdFromRequest(config,req,res,function(ownerId){

			var attributes = req.body || {};

			attributes[config.owner + 'Id'] = ownerId;

			sails.models[config.model].create(attributes,function(err,obj){

				if(err){
					sails.controllers[config.model].respond.serverError.bind({'req':req,'res':res})(err);
				}else{
					sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})(obj);
				}

			});

		});

	}

}

controller.prototype = rootController;
controller.prototype.constructor = controller;

module.exports = controller;

function extractOwnerIdFromRequest(config,req,res,callback){

	var ownerId = req.session[config.owner + 'Id'];

	if(ownerId !== undefined){
		return callback(ownerId);
	}else{

		if(!req.headers || !req.headers.authorization){
			return sails.controllers[config.model].respond.unauthorized.bind({'req':req,'res':res})();
		}

		try{

			var credentials = basicAuth.interpretRequestCredentials(req);

			sails.models[config.owner].authorize(credentials.username,credentials.password,function(err,ownerId){
				callback(ownerId);
			});

		}catch(e){
			return sails.controllers[config.model].respond.unauthorized.bind({'req':req,'res':res})();
		}

	}

}
