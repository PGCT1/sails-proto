'use strict';

var should = require('should');
var proto = require('../proto.js');

describe('Proto User Tests', function(){

	var User = new proto.user.model({
		attributes:{
			attributeExtension:true
		},
		modelExtension:function(){
			return true;
		}
	});

	var UserController = new proto.user.controller({});

	describe('User model', function(){

		it('should implement function extensions',function(){
			User.modelExtension().should.be.true;
		});

		it('should implement attribute extensions',function(){
			User.attributes.attributeExtension.should.be.true;
		});

		it('should retain proto attributes which are not specifically overridden',function(){
			(User.attributes.name === undefined).should.be.false;
		});

	});

});