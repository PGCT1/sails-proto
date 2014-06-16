'use strict';

var Sails = require('sails');

// mock requests

module.exports.PostRequest = function(params){
	return {
		method:'POST',
		session:{},
		param:function(key){
			return params[key];
		},
		params:params
	};
}

module.exports.PutRequest = function(params){
	return {
		method:'PUT',
		session:{},
		param:function(key){
			return params[key];
		},
		params:params
	};
}

// mock responses

module.exports.Ok = function(f){

	var statusCode;
	
	this.json = function(responseJson,responseCode){
		if(responseCode == 200 || responseCode == 201 || (responseCode === undefined && (statusCode == 200 || statusCode == 201))){
			f(null,responseJson);
		}else{
			console.log('Unexpected error:');
			console.log(responseJson);
		}
	}

	this.status = function(code){
		statusCode = code;
	}

}

module.exports.Unauthorized = function(f){

	var statusCode;

	this.json = function(responseJson,responseCode){
		if(responseCode == 401){
			f();
		}
	}

	this.status = function(code){
		statusCode = code;
	}

}
