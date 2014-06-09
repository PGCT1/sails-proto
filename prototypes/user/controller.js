'use strict';

var rootController = require('../root/controller.js');

var controller = function(config){

	// default name for the model is 'user', but any name can be used

	var model = 'user';

	if(config && config.model){
		model = config.model;
	}

	this.login = function(req,res){
		
		var username = req.param('username');
		var password = req.param('password');

		sails.models[model].authorize(username,password,function(err,userId){

			if(err){
				this.respond.unauthorized.bind({'req':req,'res':res})(err);
			}else{
				req.session[model+'Id'] = userId;
				this.respond.ok.bind({'req':req,'res':res})();
			}

		}.bind(this));

	};

	this.logout = function(req,res){
		delete req.session[model+'Id'];
		this.respond.ok.bind({'req':req,'res':res})();
	};

};

controller.prototype = new rootController();

module.exports = controller;
