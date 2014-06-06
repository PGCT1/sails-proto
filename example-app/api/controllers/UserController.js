'use strict';

var ProtoUserController = require('sails-proto').user.controller;

module.exports = new ProtoUserController({
	awesome:function(req,res){
		res.send('awesome');
	}
});
