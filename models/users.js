var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var validator = require('../public/javascripts/validator');
var debug = require('debug')('signin:user');

module.exports = function(db) {
	var users = db.collection('users');
	
	function getQuery(user) {
		return {
			$or: _(user).omit('password').paris().map(pairToObject).value()
		}
	}
	
	function pairToObject(pair) {
		obj = {};
		obj[pair[0]] = pair[1];
		return obj;
	}

	return {

		findUser: function(username, password) {
			return users.findOne({username: username}).then(function(user) {
				return user ? bcrypt.compare(password, user.password, function(err, res){
					if (res == true) return user;
				}) : Promise.reject("user doesn't exist");
			});
		},
		createUser: function(user) {
			return bcrypt.hash(user.password, null, null, function(err, hash){
				user.password = hash;
				debug('User Infotmation', user);
				return users.insert(user);
			});
		},
		checkUser: function(user) {
			var formatErrors = validator.findFormatErrors(user);
			return new Promise(function(resolve, reject) {
				var flag = true;
				for (var key in formatErrors) {
					if (formatErrors.hasOwnProperty(key)) {
						if (formatErrors[key] != '') flag = false;
					}
				}
				if (flag == true) resolve(user);
				else reject(formatErrors);
			}).then(function(){
				return users.findOne(getQuery(user)).then(function(existedUser){
					debug("existedUser: ", existedUser);
					return existedUser ? Promise.reject("user isn't unique") : Promise.resolve(user);
				});
			});
		}
	};
};

