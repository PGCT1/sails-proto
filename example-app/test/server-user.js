'use strict';

var should = require('should');

var SailsInstanceHelper = require('./SailsAssist/InstanceHelper.js');
var SailsMock = require('./SailsAssist/Mock.js');

var UserTemplate = {
	valid:{
		name:'user',
		password:'password'
	},
	invalid:{
		name:'u$er',
		password:'p'
	}
};

describe('User API Tests', function(){

	var app = {sails:null};
	var User;
	var UserController;

	before(SailsInstanceHelper.generate.bind(void(0),app));
	after(SailsInstanceHelper.destroy.bind(void(0),app));

	describe('User model', function(){

		before(function(){
			User = app.sails.models.user;
		});

		it('should find 0 users for empty database',function(done){

			User.find({},function(e,users){
				users.should.have.a.lengthOf(0);
				done();
			});

		});

		it('should fail create for invalid username',function(done){

				User.create(
					{
						'name':UserTemplate.invalid.name,
						'password':UserTemplate.valid.password
					},function(err){
						(err != null).should.be.true;
						done();
				});

		});

		it('should fail create for invalid password',function(done){

				User.create(
					{
						'name':UserTemplate.valid.name,
						'password':UserTemplate.invalid.password
					},function(err){
						(err != null).should.be.true;
						done();
				});

		});

		it('should create successfully for valid user',function(done){

			var newTemplate = JSON.parse(JSON.stringify(UserTemplate));

			User.create(newTemplate.valid,function(err){
				(err === null).should.be.true;
				done();
			});

		});

		it('should find 1 user',function(done){

			User.find({},function(e,users){
				users.should.have.a.lengthOf(1);
				done();
			});

		});

		it('should not store passwords',function(done){

			User.findOne({"name":UserTemplate.valid.name},function(e,user){
				user.should.not.have.a.property('password');
				done();
			});

		});

		it('should say return true if .isCool is called on User',function(done){

			if(User.isCool()){
				done();
			}

		});

	});

	describe('UserController',function(){

		before(function(){
			UserController = app.sails.controllers.user;
		});

		it('should successfully login with valid credentials',function(done){

			UserController.login(
				new SailsMock.PostRequest(UserTemplate.valid),
				new SailsMock.Ok(done)
			);

		});

		it('should not successfully login with invalid credentials',function(done){

			UserController.login(
				new SailsMock.PostRequest({
					'name':UserTemplate.valid.name,
					'password':UserTemplate.invalid.password
				}),
				new SailsMock.Unauthorized(done)
			);

		});

		// test prototype extensions

		it('should say send "awesome" if .awesome is called on controller',function(done){

			UserController.awesome(null,{send:function(msg){
				if(msg == 'awesome'){
					done();
				}
			}});

		});

	});

});
