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
	
	this.json = function(responseJson,responseCode){
		if(responseCode == 200 || responseCode == 201){
			f();
		}
	}

}

module.exports.Unauthorized = function(f){

	this.json = function(responseJson,responseCode){
		if(responseCode == 401){
			f();
		}
	}

}
