'use strict';

var rootController = require('../root/controller.js');

var controller = function(config){

	this.login = function(req,res){
		
		var name = req.param('name');
		var password = req.param('password');

		User.authorize(name,password,function(err,userId){

			if(err){
				this.respond.unauthorized.bind({'req':req,'res':res})(err);
			}else{
				req.session.userId = userId;
				this.respond.ok.bind({'req':req,'res':res})();
			}

		}.bind(this));

	};

	this.logout = function(req,res){
		delete req.session.userId;
		this.respond.ok.bind({'req':req,'res':res})();
	};

};

controller.prototype = new rootController();

module.exports = controller;
