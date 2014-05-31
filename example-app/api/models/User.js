'use strict';

let ProtoUserModel = require('../../../proto.js').user.model;

module.exports = new ProtoUserModel({
	isCool:function(){
		return true;
	}
});
