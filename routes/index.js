var express = require('express');
var router = express.Router();
var users = {};

/* GET home page. */

router.get('/signup', function(req, res, next) {
  res.render('signup', {user: {}});
});

router.post('/signup', function(req, res, next) {
	var user = req.body;
	try {
		checkUser(user);
		req.session.user = users[user.username] = user;
  	res.redirect('/detail');
	} catch(err) {
		res.render('signup', {user: user});
		// res.render('signup', {user: user, error: err.message});
	}
});

router.all('*', function(req, res, next){
	req.session.user ? next() : res.redirect('/signin');
});

router.get('/detail', function(req, res, next) {
  res.render('detail', { user: req.session.user });
});

module.exports = router;
