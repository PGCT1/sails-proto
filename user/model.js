'use strict';

var bcrypt = require('bcrypt');

function setValuePasswordHash(values,next){

	bcrypt.hash(values.password,10,function(err, hash){

		if(err)return next(err);

		delete values.password;
		values.passwordHash = hash;

		next();

	});

}

module.exports = function(child){

	this.attributes = {

		name:{
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

		delete values.name;	//disable name changing

		//if there is a password, update passwordHash

		if(!values.password){
			return next();
		}

		setValuePasswordHash(values,next);

	};

	this.authorize = function(name,password,callback){
		
		User.findOne({name:name}).exec(function(err,user){

			if(err){
				console.log(err);
				callback(err);
			}

			if(!user){
				return callback({"error":"User "+name+" not found."});
			}

			bcrypt.compare(password, user.passwordHash, function(err, match){

				if(err)throw err;

				if(match){
					callback(null,user.id);
				}else{
					callback('Incorrect password for user ' + name + '.');
				}

			});

		});

	};

	// overrides and extensions to be applied to the prototype

	var keys = Object.keys(child);

	for(var i=0;i<keys.length;++i){
		this[keys[i]] = child[keys[i]];
	}

};

