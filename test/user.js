'use strict';

var should = require('should');
var proto = require('../sails-proto.js');

describe('Proto User Tests', function(){

	var UserModel = function(){
		this.attributes.attributeExtension = true;
		this.modelExtension = function(){
			return true;
		}
	};

	UserModel.prototype = new proto.user.model();

	var User = new UserModel();
	var UserController = new proto.user.controller();

	describe('User model', function(){

		it('should implement function extensions',function(){
			User.modelExtension().should.be.true;
		});

		it('should implement attribute extensions',function(){
			console.log(User.attributes);
			User.attributes.attributeExtension.should.be.true;
		});

		it('should retain proto attributes which are not specifically overridden',function(){
			(User.attributes.username === undefined).should.be.false;
		});

	});

});