'use strict';

var should = require('should');

var SailsInstanceHelper = require('./SailsAssist/InstanceHelper.js');
var SailsMock = require('./SailsAssist/Mock.js');

describe('OwnedObject API Tests', function(){

	var app = {sails:null};
	var User;
	var userId;
	var OwnedObject;
	var OwnedObjectController;

	before(SailsInstanceHelper.generate.bind(void(0),app));
	after(SailsInstanceHelper.destroy.bind(void(0),app));

	describe('OwnedObject model', function(){

		before(function(done){
			User = app.sails.models.user;
			OwnedObject = app.sails.models.possession;

			User.create({username:'user1',password:'password1'},function(err,user){
				userId = user.id;
				done();
			});

		});

		it('should be owned by user by default',function(){
			OwnedObject.attributes.userId.should.have.a.property('model','user');
		});

	});

	describe('OwnedObject controller', function(){

		before(function(){
			OwnedObjectController = app.sails.controllers.possession;
		});

		it('should not be anonymously creatable',function(done){

			OwnedObjectController.create(
				new SailsMock.PostRequest({}),
				new SailsMock.Unauthorized(done)
			);

		});

	});

});
