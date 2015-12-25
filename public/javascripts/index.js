var http = require('http');
var url = require('url');
var querystring = require('querystring');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var users = {}

var mimeType = {
	"css": "text/css",
  	"js": "text/javascript",
}

http.createServer(function (req, res) {
	var pathname = req.url;
	var ext = path.extname(pathname);
	ext = ext ? ext.slice(1) : 'unknown';
	if (mimeType.hasOwnProperty(ext)) {
		var contentType = mimeType[ext];
		sendFile(res, pathname.slice(1), contentType);
	} else {
		req.method === 'POST' ? registUser(req, res) : sendHtml(req, res);
	}
}).listen(8000);

console.log("The server running on 8000");


function checkUser(user) {
	for (var key in user) {
		for (var i = 0; i < users.length; ++i) {
			if (user.key == users[i].key) throw (key + "_warning");
		}
	}
}

function registUser(req, res) {
	req.on('data', function(chunk) {
		try {
			var user = parseUser(chunk.toString());
			checkUser(user);
			users[user.username] = user;
			res.writeHead(301, {Location: '?username=' + user.username});
			res.end();
		} catch (error) {
			console.warn("regist error: ", error);
			showSignup(res, user, error)
		}
	});
}

function parseUser(message) {
	params = message.match(/username=(.+)&sid=(.+)&phone=(.+)&email=(.+)/);
	var user = {username: params[1],
				sid: params[2],
				phone: params[3],
				email: params[4]};
	console.log("user parsed is :", user);
	return user;
}

function sendFile(res, pathname, contentType) {
	res.writeHead(200, {'Content-Type': contentType});
	res.end(fs.readFileSync(pathname));
}

function sendHtml(req, res) {
	var username = parseUsername(req);
	if (!username || !isRegistedUser(username)) {
		showSignup(res, {username: username}, null);
	} else {
		showDetail(res, users[username]);
	}
}

function parseUsername(req) {
	return querystring.parse(url.parse(req.url).query).username;
}

function isRegistedUser(username) {
	return !!users[username];
}

function showSignup(res, user, error) {
	showHtml(res, "signup.jade", {user: user, error: error});
}

function showDetail(res, user) {
	showHtml(res, "detail.jade", user);
}

function showHtml (res, template, data) {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.end(jade.renderFile(template, data));
}