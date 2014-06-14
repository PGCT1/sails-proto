'use strict';

var Sails = require('sails');

module.exports.generate = function(output,done){

	// Lift Sails and start the server

	Sails.lift({

		log: {
			level: 'error'
		},
    connections:{

    	//use memory database for testing

    	default:{
    		adapter:'sails-memory'
    	}

    }

	},function(err, sails){

		if(err)return done(err)

		output.sails = Sails;

    done(err, sails);
	});

}

module.exports.destroy = function(sailsPointer,done){
	sailsPointer.sails.lower(done);
}
