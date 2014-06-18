'use strict';

var rootController = require('../root/controller.js');
var basicAuth = require('../lib/basicAuth.js');
var respond = require('../response/shorthand.js');

var controller = function(config){

	// default name for the model is 'user', but any name can be used

	if(config && !config.model){
		config.model = 'user';
	}else if(!config){
		config = {model:'user'};
	}

	rootController.apply(this,[config]);

	this.login = function(req,res){
		
		var username = req.param('username');
		var password = req.param('password');

		sails.models[config.model].authorize(username,password,function(err,userId){

			if(err){
				respond(config,req,res,'unauthorized',err);
			}else{
				req.session[config.model+'Id'] = userId;
				respond(config,req,res);
			}

		});

	};

	this.logout = function(req,res){
		delete req.session[config.model+'Id'];
		respond(config,req,res);
	};

	if(config.updatable === undefined || config.updatable === true){

		this.update = function(req,res){

			extractUserIdFromRequest(config,req,res,function(id){

				sails.models[config.model].update({id:id},req.body,function(err){

					if(err){
						respond(config,req,res,'serverError',err);
					}else{
						respond(config,req,res);
					}

				});

			});

		};

	}else{

		this.update = function(req,res){

			respond(config,req,res,'forbidden');

		}

	}

	if(config.deletable === true){

		this.destroy = function(req,res){

			extractUserIdFromRequest(config,req,res,function(id){

				delete req.session[config.model+'Id'];

				sails.models[config.model].destroy({id:id},req.body,function(err){

					if(err){
						respond(config,req,res,'serverError',err);
					}else{
						respond(config,req,res);
					}

				});

			});
				
		};

	}else{

		this.destroy = function(req,res){

			respond(config,req,res,'forbidden');

		}

	}

};

controller.prototype = rootController;
controller.prototype.constructor = controller;

module.exports = controller;

// private methods

function extractUserIdFromRequest(config,req,res,callback){

	var ownerId = req.session[config.model + 'Id'];

	if(ownerId !== undefined){
		return callback(ownerId);
	}else{

		if(!req.headers || !req.headers.authorization){
			return respond(config,req,res,'unauthorized');
		}

		try{

			var credentials = basicAuth.interpretRequestCredentials(req);

			sails.models[config.model].authorize(credentials.username,credentials.password,function(err,ownerId){
				callback(ownerId);
			});

		}catch(e){
			return respond(config,req,res,'unauthorized');
		}

	}

}
