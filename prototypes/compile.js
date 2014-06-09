'use strict';

// since sails doesn't properly process prototyped attributes, construct a clone object
// with the same attributes but without any prototype inheritance

module.exports = function(prototype){

	var returnObj = {};
	var incomingObj = new prototype();

	for(var x in incomingObj){
		returnObj[x] = incomingObj[x];
	}

	return returnObj;

}
