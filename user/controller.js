'use strict';

module.exports = function(child){

	this.login = function(req,res){
		
		var name = req.param('name');
		var password = req.param('password');

		User.authorize(name,password,function(err,userId){

			if(err){
				res.unauthorized(err);
			}else{
				req.session.userId = userId;
				res.ok();
			}

		});

	};

	this.logout = function(req,res){
		delete req.session.userId;
	};

	// overrides and extensions to be applied to the prototype

	var keys = Object.keys(child);

	for(var i=0;i<keys.length;++i){
		this[keys[i]] = child[keys[i]];
	}

};
