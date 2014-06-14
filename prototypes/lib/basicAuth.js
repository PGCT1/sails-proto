'use strict';

module.exports.interpretRequestCredentials = function(req){

	var basicAuthString = req.headers.authorization;

	if(!basicAuthString){
		throw 1;
	}

	var base64creds = basicAuthString.substring(basicAuthString.indexOf(" "));

	var credString = (new Buffer(base64creds, 'base64')).toString('utf8');

	if(credString.indexOf(":") == -1){
		throw 1;
	}

	var user = credString.substring(0,credString.indexOf(":"));
	var pass = credString.substring(credString.indexOf(":")+1);

	return {
		username:user,
		password:pass
	}

}
