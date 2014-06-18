'use strict';

var should = require('should');

var SailsInstanceHelper = require('./SailsAssist/InstanceHelper.js');
var SailsMock = require('./SailsAssist/Mock.js');

var defaultUserCredentials = {
	username:'user1',
	password:'password1'
};

defaultUserCredentials.basicAuth = (new Buffer(defaultUserCredentials.username + ':' + defaultUserCredentials.password)).toString('base64');

describe('Possession API Tests', function(){

	var app = {};
	var User;
	var userId;
	var Possession;
	var PossessionController;

	before(SailsInstanceHelper.generate.bind(void(0),app));
	after(SailsInstanceHelper.destroy.bind(void(0),app));

	describe('Possession model', function(){

		before(function(done){
			User = app.sails.models.user;
			Possession = app.sails.models.possession;

			User.create(defaultUserCredentials,function(err,user){
				userId = user.id;
				done();
			});

		});

		it('should be owned by user by default',function(){
			Possession.attributes.userId.should.have.a.property('model','user');
		});

	});

	describe('Possession controller', function(){

		var createdPossessionId;

		before(function(){
			PossessionController = app.sails.controllers.possession;
		});

		it('should not be anonymously creatable',function(done){

			PossessionController.create(
				new SailsMock.PostRequest({}),
				new SailsMock.Unauthorized(done)
			);

		});

		it('should not be publicly visible',function(done){

			PossessionController.find(
				new SailsMock.PostRequest({}),
				new SailsMock.Unauthorized(done)
			);

		});

		it('should not be publicly updatable',function(done){

			PossessionController.find(
				new SailsMock.PutRequest({}),
				new SailsMock.Unauthorized(done)
			);

		});

		it('should be creatable by an authenticated user',function(done){

			var req = new SailsMock.PostRequest({});
			req.body = {};

			req.headers = {
				'authorization':'Basic ' + defaultUserCredentials.basicAuth
			};

			PossessionController.create(
				req,
				new SailsMock.Ok(function(err,possession){
					createdPossessionId = possession.id;
					done();
				})
			);

		});

		it('should be visible to its owner',function(done){

			var req = new SailsMock.PostRequest({});

			req.headers = {
				'authorization':'Basic ' + defaultUserCredentials.basicAuth
			};

			PossessionController.find(
				req,
				new SailsMock.Ok(function(err,possessions){

					possessions.should.be.an.instanceOf(Array).with.lengthOf(1);

					done();

				})
			);

		});

		it('should be updatable by its owner',function(done){

			var req = new SailsMock.PutRequest({id:createdPossessionId});

			req.headers = {
				'authorization':'Basic ' + defaultUserCredentials.basicAuth
			};

			var randomInt = parseInt(Math.random());

			req.body = {
				integer:randomInt
			}

			PossessionController.update(
				req,
				new SailsMock.Ok(function(){

					PossessionController.find(
						req,
						new SailsMock.Ok(function(err,possessions){

							possessions[0].should.have.a.property('integer',randomInt);

							done();

						})
					);

				})
			);

		});

	});

});
