'use strict';

let ProtoUserModel = require('sails-proto').user.model;

module.exports = new ProtoUserModel({
	isCool:function(){
		return true;
	}
});
