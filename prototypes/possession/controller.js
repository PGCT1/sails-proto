'use strict';

var rootController = require('../root/controller.js');
var basicAuth = require('../lib/basicAuth.js');
var respond = require('../response/shorthand.js');

var controller = function(config){

	/*

		Configuration setup
			model - model name operated on by this controller; should inherit from Possession (required)
			owner - name of the owning model; should inherit from User (default: 'user')
			publiclyVisible - whether this object should be publicly visible or not (default: true)
			deletable - owner can delete this object (default:true)
			updatable - owner can update this object (default:true)
	
	*/

	if(!config || !config.model){
		throw 'sails-proto: Invalid model configuration - an owned object must have a model configured.';
	}

	if(!config.owner){
		config.owner = 'user';
	}

	rootController.apply(this,[config]);


	this.create = function(req,res){

		extractOwnerIdFromRequest(config,req,res,function(ownerId){

			var attributes = req.body || {};

			attributes[config.owner + 'Id'] = ownerId;

			sails.models[config.model].create(attributes,function(err,obj){

				if(err){
					respond(config,req,res,'serverError',err);
				}else{
					respond(config,req,res,'ok',obj);
				}

			});

		});

	}

	// read -- publicly enabled by default

	if(config.publiclyVisible === false){

		this.find = function(req,res){

			extractOwnerIdFromRequest(config,req,res,function(ownerId){

				var findCriteria = {};

				findCriteria[config.owner + 'Id'] = ownerId;

				if(req.params.id){
					findCriteria.id = req.params.id;
				}

				sails.models[config.model].find(findCriteria).sort({'createdAt':'desc'}).limit(config.pageSize).exec(function(err,possessions){
					
					if(err){
						respond(config,req,res,'serverError',err);
					}else{
						respond(config,req,res,'ok',possessions);
					}

				});

			});

		}

	}

	// updatable -- enabled by default

	if(config.updatable === false){

		this.update = function(req,res){
			respond(config,req,res,'forbidden');
		};

	}else{

		this.update = function(req,res){

			var id = req.params.id;

			if(!id){
				return respond(config,req,res,'badRequest');
			}

			extractOwnerIdFromRequest(config,req,res,function(ownerId){

				var updateCriteria = {};

				updateCriteria[config.owner + 'Id'] = ownerId;
				updateCriteria.id = id;

				if(req.body){
					delete req.body[config.owner + 'Id'];	// do not allow ownership transfer here
					delete req.body.id;	// primary key should not be updatable
				}

				sails.models[config.model].update(updateCriteria,req.body,function(err){

					if(err){
						respond(config,req,res,'serverError',err);
					}else{
						respond(config,req,res,'ok');
					}

				});

			});

		}

	}

	// destroy -- enabled by default

	if(config.deletable === false){

		this.destroy = function(req,res){
			respond(config,req,res,'forbidden');
		};

	}else{

		this.destroy = function(req,res){

			var id = req.params.id;

			if(!id){
				return respond(config,req,res,'badRequest');
			}

			extractOwnerIdFromRequest(config,req,res,function(ownerId){

				var destroyCriteria = {};

				destroyCriteria[config.owner + 'Id'] = ownerId;
				destroyCriteria.id = id;

				sails.models[config.model].destroy(destroyCriteria,function(err){

					if(err){
						respond(config,req,res,'serverError',err);
					}else{
						respond(config,req,res,'ok');
					}

				});

			});

		}

	}

}

controller.prototype = rootController;
controller.prototype.constructor = controller;

module.exports = controller;

// private methods

function extractOwnerIdFromRequest(config,req,res,callback){

	var ownerId = req.session[config.owner + 'Id'];

	if(ownerId !== undefined){
		return callback(ownerId);
	}else{

		if(!req.headers || !req.headers.authorization){
			return respond(config,req,res,'unauthorized');
		}

		try{

			var credentials = basicAuth.interpretRequestCredentials(req);

		}catch(e){
			return respond(config,req,res,'unauthorized');
		}
		
		sails.models[config.owner].authorize(credentials.username,credentials.password,function(err,id){
			
			if(err || !id){
				respond(config,req,res,'unauthorized');
			}else{
				callback(id);
			}

		});

	}

}
