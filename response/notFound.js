
module.exports = function forbidden(err){

  var req = this.req;
  var res = this.res;

  if(!err){
    res.json({"error":"Could not find model with specified ID."},404);
  }else if(typeof(err) == "string"){
  	res.json({"error":err},404);
  }else{
    res.json(err,404);
  }
};
