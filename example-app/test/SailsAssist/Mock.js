'use strict';

var Sails = require('sails');

module.exports.PostRequest = function(params){
	return {
		session:{},
		param:function(key){
			return params[key];
		},
		params:params
	};
}

// mock responses

module.exports.Ok = function(f){

	this.ok = function(){
		f();
	};

	this.unauthorized = function(){
		throw 1;
	};

	this.forbidden = function(){
		throw 1;
	};

	this.notFound = function(){
		throw 1;
	};
}

module.exports.Unauthorized = function(f){

	this.unauthorized = function(){
		f();
	};

	this.ok = function(){
		throw 1;
	};

	this.forbidden = function(){
		throw 1;
	};

	this.notFound = function(){
		throw 1;
	};
}
