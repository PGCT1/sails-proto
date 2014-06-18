'use strict';

var proto = require('sails-proto');

var controller = function(){
};

controller.prototype = new proto.possession.controller({'model':'possession',publiclyVisible:false});

module.exports = proto.compile(controller);
