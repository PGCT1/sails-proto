'use strict';

module.exports = function(config,req,res,type,obj){

	var responseType = 'ok';

	if(type){
		responseType = type;
	}

	if(obj){
		sails.controllers[config.model].respond[responseType].bind({'req':req,'res':res})(obj);
	}else{
		sails.controllers[config.model].respond[responseType].bind({'req':req,'res':res})();
	}

}
