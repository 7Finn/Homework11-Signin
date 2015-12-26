var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');
var debug = require('debug')('signin:index');

module.exports = function(db) {
  /* GET home page. */
  var userManager = require('../models/users')(db);
  
  router.get('/signin', function(req, res, next) {
      res.render('signin');
  });

  router.post('/signin', function(req, res, next) {
    userManager.findUser(req.body.username, req.body.password)
      .then(function(user){
        req.session.user = user;
        console.log("登录成功:" + user);
        res.redirect('/detail');
      })
      .catch(function(error){
        console.log("登录出错:" + error);
        res.render('signin', {error : "账号密码错误"});
      });
  });

  router.get('/signout', function(req, res, next) {
    delete req.session.user;
    res.redirect('/signin');
  });

  router.get('/signup', function(req, res, next) {
    res.render('signup', {user: {}, error: {}});
  });

  router.post('/signup', function(req, res, next) {
    var user = req.body;
    userManager.checkAndCreateUser(user)
      .then(function(){
        req.session.user = user;
        debug("User session", user);
        res.redirect('/detail');
      })
      .catch(function(error){
        console.log("Signup Error:" + error);
        res.render('signup', {user: user, error: error});
      });
  });

  router.all('*', function(req, res, next){
    req.session.user ? res.render('detail', { user: req.session.user }) : res.redirect('/signin');
  });

  router.get('/detail', function(req, res, next) {
      res.render('detail', { user: req.session.user });
  });


  
  return router;
}


// function checkUser(user) {
//   	var errorMessages = {
//   		username : "",
//   		password : "",
//   		repeatPassword : "",
//   		sid : "",
//   		phone : "",
//   		email : "",
//   	};
//   	for(var key in user) {
//   		if (!validator.isFieldValid(key, user[key])) errorMessages[key] = validator.form[key].errorMessage;
//     	if (!validator.isAttrValueUnique(users, user, key)) errorMessages[key] = "该信息已被使用×";
//   	}
//   	for (var key in errorMessages) {
//   		if (errorMessages[key] != '') throw errorMessages;
//   	}
// }


