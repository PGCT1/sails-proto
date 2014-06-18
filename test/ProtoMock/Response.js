'use strict';

module.exports = function(verb,callback){

	var res = {};

	res[verb] = function(){
		callback();
	};

	return res;
};
