'use strict';

var protoResponse = require('./../response/index.js');

var root = function(config){

	if(!config || !config.model){
		throw 'sails-proto: Error constructing root object - invalid configuration.';
	}

	var model = config.model;

	var pageSize = 20;

	if(config.pageSize){
		pageSize = config.pageSize;
	}

	this.find = function(req,res){

		sails.models[model].find({}).limit(pageSize).exec(function(err,models){
			if(!err){
				sails.controllers[model].respond.ok.bind({'req':req,'res':res})(models);
			}else{
				sails.controllers[model].respond.serverError.bind({'req':req,'res':res})(err);
			}
		});

	};

	this.respond = protoResponse;
};

module.exports = root;
