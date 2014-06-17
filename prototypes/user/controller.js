'use strict';

var rootController = require('../root/controller.js');
var basicAuth = require('../lib/basicAuth.js');

function extractUserIdFromRequest(config,req,res,callback){

	var ownerId = req.session[config.model + 'Id'];

	if(ownerId !== undefined){
		return callback(ownerId);
	}else{

		if(!req.headers || !req.headers.authorization){
			return sails.controllers[config.model].respond.unauthorized.bind({'req':req,'res':res})();
		}

		try{

			var credentials = basicAuth.interpretRequestCredentials(req);

			sails.models[config.model].authorize(credentials.username,credentials.password,function(err,ownerId){
				callback(ownerId);
			});

		}catch(e){
			return sails.controllers[config.model].respond.unauthorized.bind({'req':req,'res':res})();
		}

	}

}

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
				sails.controllers[config.model].respond.unauthorized.bind({'req':req,'res':res})(err);
			}else{
				req.session[config.model+'Id'] = userId;
				sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})();
			}

		});

	};

	this.logout = function(req,res){
		delete req.session[config.model+'Id'];
		sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})();
	};

	this.update = function(req,res){

		extractUserIdFromRequest(config,req,res,function(id){

			sails.models[config.model].update({id:id},req.body,function(err){

				if(err){
					sails.controllers[config.model].respond.serverError.bind({'req':req,'res':res})(err);
				}else{
					sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})();
				}

			});

		});

	};

	this.destroy = function(req,res){

		extractUserIdFromRequest(config,req,res,function(id){

			delete req.session[config.model+'Id'];

			sails.models[config.model].destroy({id:id},req.body,function(err){

				if(err){
					sails.controllers[config.model].respond.serverError.bind({'req':req,'res':res})(err);
				}else{
					sails.controllers[config.model].respond.ok.bind({'req':req,'res':res})();
				}

			});

		});
			
	};

};

controller.prototype = rootController;
controller.prototype.constructor = controller;

module.exports = controller;
