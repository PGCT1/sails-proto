'use strict';

module.exports.Framework = function(objects){

	var sails = {
		models:{},
		controllers:{}
	};

	for(var i=0;i<objects.length;++i){

		sails.models[objects[i]] = {};
		sails.controllers[objects[i]] = {};

	}

	return sails;

};

module.exports.Promise = function(term,delegate){

	var obj = {};

	obj[term] = delegate;

	return function(){
		return obj;
	};
};
