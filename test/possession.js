'use strict';

var should = require('should');
var bcrypt = require('bcrypt');

var proto = require('../sails-proto.js');
var Sails = require('./SailsMock/SailsMock.js');
var Req = require('./ExpressMock/Req.js');
var Response = require('./ProtoMock/Response.js');

var modelName = 'item';
var ownerName = 'member';

describe('Possession Tests', function(){

	var Possession;
	var PossessionController;
	var model;
	var ownerModel;

	before(function(){

		var ItemModel = function(){};

		ItemModel.prototype = new proto.possession.model({
			model:modelName,
			owner:ownerName
		});

		Possession = new ItemModel();

	});

	describe('Model',function(){

		before(function(){

			GLOBAL.sails = new Sails.Framework([modelName,ownerName]);

			// simple mock model

			model = sails.models[modelName];

			model.update = function(filter,updates,callback){
				callback(null);
			};

			model.destroy = function(filter,callback){
				callback(null);
			};

			ownerModel = sails.models[ownerName];

		});

		it('should have a reference to its owner\'s model',function(){
			(Possession.attributes[ownerName + 'Id'] === undefined).should.be.false;
		});

	});

	describe('Controller',function(){

		var controller;

		before(function(){

			controller = sails.controllers[modelName];

		});

		describe('configuration',function(){

			it('should be publicly accessible if publiclyVisible is true',function(done){
			
				model.find = Sails.Promise(['limit','exec'],function(callback){
					callback(null,[]);
				});

				PossessionController = new proto.possession.controller({
					model:modelName,
					owner:ownerName,
					publiclyVisible:true
				});

				controller.respond = new Response('ok',done);

				PossessionController.find(
					new Req()
				);

			});

			it('should not be publicly accessible if publiclyVisible is false',function(done){

				PossessionController = new proto.possession.controller({
					model:modelName,
					owner:ownerName,
					publiclyVisible:false
				});

				controller.respond = new Response('unauthorized',done);

				PossessionController.find(
					new Req()
				);

			});

			it('should always be privately accessible, even if publiclyVisible is false',function(done){

				ownerModel.authorize = function(user,pass,callback){
					callback(null,1);
				}

				model.find = Sails.Promise(['sort','limit','exec'],function(callback){
					callback(null,[]);
				});

				PossessionController = new proto.possession.controller({
					model:modelName,
					owner:ownerName,
					publiclyVisible:false
				});

				controller.respond = new Response('ok',done);

				PossessionController.find(
					new Req({},{},{authorization:'Basic dXNlcm5hbWU6cGFzc3dvcmQ='})
				);

			});

			it('should allow updates if updatable is true',function(done){

				var session = {};

				session[ownerName + 'Id'] = 1;

				PossessionController = new proto.possession.controller({
					model:modelName,
					owner:ownerName,
					updatable:true
				});

				controller.respond = new Response('ok',done);

				PossessionController.update(
					new Req({id:1},session)
				);

			});

			it('should not allow updates if updatable is false',function(done){

				var session = {};

				session[ownerName + 'Id'] = 1;

				PossessionController = new proto.possession.controller({
					model:modelName,
					owner:ownerName,
					updatable:false
				});

				controller.respond = new Response('forbidden',done);

				PossessionController.update(
					new Req({id:1},session)
				);

			});

			it('should allow deletion if deletable is true',function(done){

				var session = {};

				session[ownerName + 'Id'] = 1;

				PossessionController = new proto.possession.controller({
					model:modelName,
					owner:ownerName,
					deletable:true
				});

				controller.respond = new Response('ok',done);

				PossessionController.destroy(
					new Req({id:1},session)
				);

			});

			it('should not allow deletion if deletable is false',function(done){

				var session = {};

				session[ownerName + 'Id'] = 1;

				PossessionController = new proto.possession.controller({
					model:modelName,
					owner:ownerName,
					deletable:false
				});

				controller.respond = new Response('forbidden',done);

				PossessionController.destroy(
					new Req({id:1},session)
				);

			});

		});

	});

});
