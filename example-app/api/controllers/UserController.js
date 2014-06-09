'use strict';

var proto = require('sails-proto');

var controller = function(){
	this.awesome = function(req,res){
		res.send('awesome');
	};
};

controller.prototype = new proto.user.controller({'model':'user'});

module.exports = proto.compile(controller);
