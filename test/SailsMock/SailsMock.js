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

	if(typeof(term) == 'string'){

		// Promise('term',f)

		obj[term] = delegate;

		return function(){
			return obj;
		};

	}else{

		// Promise(['chain','of','terms'],f)

		var iterator = function(){

			var obj = {};

			obj[term[term.length-1]] = delegate;

			return obj;
		};

		for(var i=term.length-2;i>=0;--i){

			iterator = function(i,f){

				var obj = {};

				obj[term[i]] = f;

				return obj;

			}.bind(void(0),i,iterator)

		}

		return iterator;

	}
	
};
