
module.exports = function unauthorized(err){

  var req = this.req;
  var res = this.res;

  if(!err){
    res.json({"error":"Invalid authorization."},401);
  }else if(typeof(err) == "string"){
  	res.json({"error":err},401);
  }else{
    res.json(err,401);
  }
};
