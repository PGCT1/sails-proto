'use strict';

var should = require('should');
var bcrypt = require('bcrypt');

var proto = require('../sails-proto.js');
var Sails = require('./SailsMock/SailsMock.js');
var Req = require('./ExpressMock/Req.js');

var modelName = 'userz';

describe('Proto User Tests', function(){

	var User;
	var UserController;
	var model;

	var password = 'password';
	var username = 'username';
	var userId = 1;

	before(function(){

		var UserModel = function(){

			this.attributes.attributeExtension = true;

			this.modelExtension = function(){
				return true;
			}

		};

		UserModel.prototype = new proto.user.model({
			model:modelName
		});

		User = new UserModel();

		UserController = new proto.user.controller({
			model:modelName
		});

	});

	describe('Model', function(){

		before(function(){

			GLOBAL.sails = new Sails.Framework([modelName]);
			model = sails.models[modelName];

		});

		it('should implement function extensions',function(){
			User.modelExtension().should.be.true;
		});

		it('should implement attribute extensions',function(){
			User.attributes.attributeExtension.should.be.true;
		});

		it('should retain proto attributes which are not specifically overridden',function(){
			(User.attributes.username === undefined).should.be.false;
		});

		it('should authorize valid credentials',function(done){

			bcrypt.hash(password,10,function(err, hash){

				model.findOne = Sails.Promise('exec',function(callback){
					callback(null,{
						id:userId,
						passwordHash:hash
					});
				});

				User.authorize(username,password,function(err,userId){

					(null === err).should.be.true;
					(userId === 1).should.be.true;

					done();

				});

			});

		});

		it('should not authorize incorrect password',function(done){

			bcrypt.hash(password,10,function(err, hash){

				model.findOne = Sails.Promise('exec',function(callback){
					callback(null,{
						id:userId,
						passwordHash:hash
					});
				});

				User.authorize(username,password+'1',function(err,userId){

					(null === err).should.be.false;
					(userId === 1).should.be.false;

					done();

				});

			});

		});

	});

	describe('Controller',function(){

		var controller;

		var Response = function(verb,callback){

			var res = {};

			res[verb] = function(){
				callback();
			};

			return res;
		};

		before(function(){

			GLOBAL.sails = new Sails.Framework([modelName]);

			model = sails.models[modelName];
			controller = sails.controllers[modelName];

			model.update = function(filter,updates,callback){
				callback(null);
			};

			model.destroy = function(filter,updates,callback){
				callback(null);
			};

			controller.respond = {};

		});

		it('should allow session login for authorized users',function(done){

			model.authorize = function(username,password,callback){
				callback(null,userId);
			};

			controller.respond = new Response('ok',done);

			UserController.login(
				new Req({
					username:username,
					password:password
				})
			);

		});

		it('should not allow session login for unauthorized users',function(done){

			model.authorize = function(username,password,callback){
				callback({});
			};

			controller.respond = new Response('unauthorized',done);

			UserController.login(
				new Req({
					username:username,
					password:password
				})
			);

		});

		it('should add a session variable when logging in',function(done){

			model.authorize = function(username,password,callback){
				callback(null,1);
			};

			controller.respond = new Response('ok',done);

			var req = new Req({
					username:username,
					password:password
				});

			UserController.login(
				req
			);

			req.session.should.have.a.property(modelName + 'Id',1);

		});

		it('should remove the session variable when logging out',function(done){

			controller.respond = new Response('ok',done);

			var req = new Req({
					username:username,
					password:password
				},{
					userId:1
				});

			UserController.logout(
				req
			);

			req.session.should.not.have.a.property(modelName + 'Id');

		});

		it('should not allow updating without authorization',function(done){

			controller.respond = new Response('unauthorized',done);

			UserController.update(
				new Req()
			);

		});

		it('should allow updating with session authorization',function(done){

			controller.respond = new Response('ok',done);

			var session = {};

			session[modelName + 'Id'] = 1;

			UserController.update(
				new Req({},session)
			);

		});

		it('should allow updating with basic authorization',function(done){

			controller.respond = new Response('ok',done);

			UserController.update(
				new Req({},{},{
					authorization:'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
				})
			);

		});

		it('should not allow destroying without authorization',function(done){

			controller.respond = new Response('unauthorized',done);

			UserController.destroy(
				new Req()
			);

		});

		it('should allow destroying with session authorization',function(done){

			controller.respond = new Response('ok',done);

			var session = {};

			session[modelName + 'Id'] = 1;

			UserController.destroy(
				new Req({},session)
			);

		});

		it('should allow destroying with basic authorization',function(done){

			controller.respond = new Response('ok',done);

			UserController.destroy(
				new Req({},{},{
					authorization:'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
				})
			);

		});

	});

});
