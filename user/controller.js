'use strict';

var protoResponse = require('../sails-proto.js').response;

module.exports = function(child){

	this.login = function(req,res){
		
		var name = req.param('name');
		var password = req.param('password');

		User.authorize(name,password,function(err,userId){

			if(err){
				//res.unauthorized(err);
				protoResponse.unauthorized.bind({req,res})(err);
			}else{
				req.session.userId = userId;
				//res.ok();
				protoResponse.ok.bind({req,res})();
			}

		});

	};

	this.logout = function(req,res){
		delete req.session.userId;
		protoResponse.ok.bind({req,res})();
	};
	
	
	// overrides and extensions to be applied to the prototype

	var keys = Object.keys(child);

	for(var i=0;i<keys.length;++i){
		this[keys[i]] = child[keys[i]];
	}

};
