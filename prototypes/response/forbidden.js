
module.exports = function forbidden(err){

  var req = this.req;
  var res = this.res;

  if(!err){
    res.json({"error":"This action is not allowed."},403);
  }else if(typeof(err) == "string"){
  	res.json({"error":err},403);
  }else{
    res.json(err,403);
  }
};
