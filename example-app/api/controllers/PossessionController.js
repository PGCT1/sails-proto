'use strict';

var proto = require('sails-proto');

var controller = function(){
};

controller.prototype = new proto.ownedObject.controller({'model':'possession'});

module.exports = proto.compile(controller);
