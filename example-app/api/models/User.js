'use strict';

var ProtoUserModel = require('sails-proto').user.model;

module.exports = new ProtoUserModel({
	isCool:function(){
		return true;
	}
});
