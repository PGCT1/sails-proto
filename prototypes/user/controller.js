'use strict';

var rootController = require('../root/controller.js');

var idMatch = function(objectName,req,res,next){

	var id = req.params.id;

	if(!id){
		return sails.controllers[objectName].respond.badRequest.bind({'req':req,'res':res})('Missing id parameter.');
	}

	if(id == req.session[objectName+'Id']){
		next();
	}else{
		sails.controllers[objectName].respond.unauthorized.bind({'req':req,'res':res})();
	}

}

var controller = function(config){

	// default name for the model is 'user', but any name can be used

	var objectName = 'user';

	if(config && config.model){
		objectName = config.model;
	}else if(config){
		config.model = objectName;
	}else{
		config = {model:objectName};
	}

	rootController.apply(this,[config]);

	this.login = function(req,res){
		
		var username = req.param('username');
		var password = req.param('password');

		sails.models[objectName].authorize(username,password,function(err,userId){

			if(err){
				sails.controllers[objectName].respond.unauthorized.bind({'req':req,'res':res})(err);
			}else{
				req.session[objectName+'Id'] = userId;
				sails.controllers[objectName].respond.ok.bind({'req':req,'res':res})();
			}

		});

	};

	this.logout = function(req,res){
		delete req.session[objectName+'Id'];
		sails.controllers[objectName].respond.ok.bind({'req':req,'res':res})();
	};

	this.update = function(req,res){

		var id = req.params.id;

		idMatch(objectName,req,res,function(){

			sails.models[objectName].update({id:id},req.body,function(err){

				if(err){
					sails.controllers[objectName].respond.serverError.bind({'req':req,'res':res})(err);
				}else{
					sails.controllers[objectName].respond.ok.bind({'req':req,'res':res})();
				}

			});

		});

	};

	this.destroy = function(req,res){

		var id = req.params.id;

		idMatch(objectName,req,res,function(){

			sails.models[objectName].destroy({id:id}).exec(function(err){

				if(!err){
					delete req.session[objectName+'Id'];
					sails.controllers[objectName].respond.ok.bind({'req':req,'res':res})();
				}else{
					sails.controllers[objectName].respond.serverError.bind({'req':req,'res':res})(err);
				}

			});

		});
			
	};

};

controller.prototype = rootController;
controller.prototype.constructor = controller;

module.exports = controller;
