var validator = require ('./validator');

module.exports = {
  validateUnique: function(users, req, res){
    req.on('data', function(chunk){
      var params, field, result, user;
      params = chunk.toString().match(/field=(.+)&value=(.+)/);
      user = {};
      user[field = params[1]] = decodeURIComponent(params[2]);
      result = validator.isAttrValueUnique(users, user, field) ? 
        {isUnique: true} : {isUnique: false}
      res.writeHead(200, {"Content-Type": "application/json"})
      res.end(JSON.stringify(result));
    });
  }
}