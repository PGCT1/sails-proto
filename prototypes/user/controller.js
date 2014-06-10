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

function basicAuth(objectName,req,res,callback){

	var id = req.params.id;

	function interpretBasicAuthCredentials(basicAuthString){

		if(!basicAuthString){
			throw 1;
		}

		var base64creds = basicAuthString.substring(basicAuthString.indexOf(" "));

		var credString = (new Buffer(base64creds, 'base64')).toString('utf8');

		if(credString.indexOf(":") == -1){
			throw 1;
		}

		var user = credString.substring(0,credString.indexOf(":"));
		var pass = credString.substring(credString.indexOf(":")+1);

		return {
			username:user,
			password:pass
		}

	}

	try{
  	
  	var credentials = interpretBasicAuthCredentials(req.headers.authorization);

  	sails.models[objectName].authorize(credentials.username,credentials.password,function(err,userId){
  		if(err || userId != id){
				sails.controllers[objectName].respond.unauthorized.bind({'req':req,'res':res})();
  		}else{
  			callback();
  		}
  	});

	}catch(e){
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

		function updateUser(){

			sails.models[objectName].update({id:id},req.body,function(err){

				if(err){
					sails.controllers[objectName].respond.serverError.bind({'req':req,'res':res})(err);
				}else{
					sails.controllers[objectName].respond.ok.bind({'req':req,'res':res})();
				}

			});

		}

		if(req.session[objectName+'Id']){

			idMatch(objectName,req,res,updateUser);

		}else{

			basicAuth(objectName,req,res,updateUser);

		}

	};

	this.destroy = function(req,res){

		var id = req.params.id;

		function destroyUser(){

			sails.models[objectName].destroy({id:id}).exec(function(err){

				if(!err){
					delete req.session[objectName+'Id'];
					sails.controllers[objectName].respond.ok.bind({'req':req,'res':res})();
				}else{
					sails.controllers[objectName].respond.serverError.bind({'req':req,'res':res})(err);
				}

			});
			
		}

		if(req.session[objectName+'Id']){

			idMatch(objectName,req,res,destroyUser);

		}else{

			basicAuth(objectName,req,res,destroyUser);

		}
			
	};

};

controller.prototype = rootController;
controller.prototype.constructor = controller;

module.exports = controller;
