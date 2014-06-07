
module.exports = function ok(message,responseCode){

  var req = this.req;
  var res = this.res;

  var code = 200;

  if(responseCode){
    code = responseCode;
  }

  if(!message){
    res.json({},code);
  }else if(typeof(message) == "string"){
    res.json({"message":message},code);
  }else{
    res.json(message,code);
  }
};
