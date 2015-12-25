var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator')
var users = {};

/* GET home page. */

router.get('/signup', function(req, res, next) {
  res.render('signup', {user: {}, error: {}});
});

router.post('/signup', function(req, res, next) {
	var user = req.body;
	try {
		checkUser(user);
		req.session.user = users[user.username] = user;
  		res.redirect('/detail');
	} catch(err) {
		console.log(err);
		res.render('signup', {user: user, error: err});
		// res.render('signup', {user: user, error: err.message});
	}
});

router.all('*', function(req, res, next){
	req.session.user ? next() : res.redirect('/signin');
});

router.get('/detail', function(req, res, next) {
  res.render('detail', { user: req.session.user });
});


function checkUser(user) {
  	var errorMessages = {
  		username : "",
  		password : "",
  		sid : "",
  		phone : "",
  		email : "",
  	};
  	for(var key in user) {
  		if (!validator.isFieldValid(key, user[key])) errorMessages[key] = validator.form[key].errorMessage;
    	if (!validator.isAttrValueUnique(users, user, key)) errorMessages[key] = "该信息已被使用×";
  	}
  	for (var key in errorMessages) {
  		if (errorMessages[key] != '') throw errorMessages;
  	}
}


module.exports = router;
