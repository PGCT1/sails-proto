'use strict';

var bcrypt = require('bcrypt');
var root = require('../root/model.js');

function setValuePasswordHash(values,next){

	bcrypt.hash(values.password,10,function(err, hash){

		if(err)return next(err);

		delete values.password;
		values.passwordHash = hash;

		next();

	});

}

var model = function(config){

	// default name for the model is 'user', but any name can be used

	var objectName = 'user';

	if(config && config.model){
		objectName = config.model;
	}

	this.attributes = {

		username:{
			type:'string',
			required:true,
			unique:true,
			minLength:3,
			maxLength:20,
			regex:/^[A-Z0-9]+$/i
		},

		password:{
			type:'string',
			required:true,
			minLength:7,
			maxLength:20
		},

		passwordHash:{
			type:'string'
		},

		toJSON:function(){
			var obj = this.toObject();
			delete obj.password;
			delete obj.passwordHash;
			return obj;
		}

	};

	this.beforeCreate = function(values, next){

		setValuePasswordHash(values,next);

	};

	this.beforeUpdate = function(values, next){

		delete values.username;	//disable name changing

		//if there is a password, update passwordHash

		if(!values.password){
			return next();
		}

		setValuePasswordHash(values,next);

	};

	this.authorize = function(username,password,callback){
		
		sails.models[objectName].findOne({username:username}).exec(function(err,user){

			if(err){
				console.log(err);
				callback(err);
			}

			if(!user){
				return callback({"error":"User "+username+" not found."});
			}

			bcrypt.compare(password, user.passwordHash, function(err, match){

				if(err)throw err;

				if(match){
					callback(null,user.id);
				}else{
					callback('Incorrect password for user ' + username + '.');
				}

			});

		});

	};

};

module.exports = model;

