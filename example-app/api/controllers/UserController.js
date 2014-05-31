'use strict';

let ProtoUserController = require('../../../proto.js').user.controller;

module.exports = new ProtoUserController({
	awesome:function(req,res){
		res.send('awesome');
	}
});
