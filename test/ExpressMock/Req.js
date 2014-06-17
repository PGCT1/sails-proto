'use strict';

// Simple mock of Express's req

module.exports = function(params,session,headers){

	var req = {
		headers:(headers ? headers : {}),
		session:(session ? session : {}),
		param:function(key){
			return params[key];
		},
		params:params
	};

	return req;
}
