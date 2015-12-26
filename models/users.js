var _ = require('lodash');
var validator = require('../public/javascripts/validator');
var debug = require('debug')('signin:user');

module.exports = function(db) {
	var users = db.collection('users');
	
	function getQuery(user) {
		var query = new Array();
		query.push({username : user.username});
		query.push({sid: user.sid});
		query.push({phone: user.phone});
		query.push({email: user.email});
		return {
			$or: query
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
				if (!user) return Promise.reject("用户不存在");
				else if (user.password == password) return user;
				else return Promise.reject("密码错误");
			})
		},
		createUser: function(user) {
			return users.insert(user);
		},
		checkAndCreateUser: function(user) {
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
					var errorMessages = formatErrors;
					if (existedUser) {
						if (existedUser.username == user.username) errorMessages.username = "用户名已被注册";
    					if (existedUser.sid == user.sid) errorMessages.sid = "学号已被注册";
    					if (existedUser.phone == user.phone) errorMessages.phone = "电话已被注册";
    					if (existedUser.email == user.email) errorMessages.email = "邮箱已被注册";
					}
					return existedUser ? Promise.reject(errorMessages) : users.insert(user);
				});
			});
		}
	};
};

// var bcrypt = require('bcrypt-nodejs');
// var _ = require('lodash');
// var validator = require('../public/javascripts/validator');
// var debug = require('debug')('signin:user');

// module.exports = function(db) {
// 	var users = db.collection('users');
	
// 	function getQuery(user) {
// 		return {
// 			$or: _(user).omit('password').paris().map(pairToObject).value()
// 		}
// 	}
	
// 	function pairToObject(pair) {
// 		obj = {};
// 		obj[pair[0]] = pair[1];
// 		return obj;
// 	}

// 	return {

// 		findUser: function(username, password) {
// 			return users.findOne({username: username}).then(function(user) {
// 				console.log("findOne: " + user.password);
// 				return user ? bcrypt.compare(password, user.password).then(function(){
// 					console.log("User correct");
// 					return user;
// 				}) : Promise.reject("用户不存在");
// 			})
// 		},
// 		createUser: function(user) {
// 			return bcrypt.hash(user.password, null, null, function(err, hash){
// 				user.password = hash;
// 				debug('User Infotmation', user);
// 				return users.insert(user);
// 			});
// 		},
// 		checkUser: function(user) {
// 			var formatErrors = validator.findFormatErrors(user);
// 			return new Promise(function(resolve, reject) {
// 				var flag = true;
// 				for (var key in formatErrors) {
// 					if (formatErrors.hasOwnProperty(key)) {
// 						if (formatErrors[key] != '') flag = false;
// 					}
// 				}
// 				if (flag == true) resolve(user);
// 				else reject(formatErrors);
// 			}).then(function(){
// 				return users.findOne(user).then(function(existedUser){
// 					debug("existedUser: ", existedUser);
// 					var errorMessages = formatErrors;
//     				if (existedUser.username == user.username) errorMessages.username = "用户名已被注册";
//     				if (existedUser.sid == user.sid) errorMessages.sid = "学号已被注册";
//     				if (existedUser.phone == user.phone) errorMessages.phone = "电话已被注册";
//     				if (existedUser.email == user.email) errorMessages.email = "邮箱已被注册";
// 					return existedUser ? Promise.reject(errorMessages) : Promise.resolve(user);
// 				});
// 			});
// 		}
// 	};
// };

