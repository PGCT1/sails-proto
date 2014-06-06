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

module.exports.ok = function(f){
	
	this.json = function(x,y){
		if(y == 200 || y == 201){
			f();
		}
	}

}

module.exports.Unauthorized = function(f){

	this.json = function(x,y){
		if(y == 401){
			f();
		}
	}

}
