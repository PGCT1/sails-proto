'use strict';

let ProtoUserModel = require('proto').user.model;

module.exports = new ProtoUserModel({
	isCool:function(){
		return true;
	}
});
