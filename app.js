/**
 * Module dependencies.
 */

var express = require('express'),
socketio = require('socket.io'), 
http = require('http'), 
app_server = module.exports, 
game_server = require('./game.server.js'), 
path = require('path'),
https = require('https'),
config = require('./config');
fs = require('fs');

var sslOptions = {
  key: fs.readFileSync('ssl.key'),
  cert: fs.readFileSync('ssl.crt'),
  ca: fs.readFileSync('sub.class1.server.ca.pem'),
};

var app = express();

var playerProvider = new PlayerProvider(config.mongoDbHost, config.mongoDbPort);

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers',
			'Content-Type, Authorization, Content-Length, X-Requested-With');
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
};

app.configure(function() {
	app.use(allowCrossDomain);
	app.set('port', config.port);
	app.use(express.favicon());
	app.use(express.logger('dev'));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/users', function(req, res) {
	playerProvider.findAll(function(err, results) {
		var s = JSON.stringify(results);
		res.send(s);
	});
});
app.get('/ping', function(req, res) {
	res.send('pong');
});

var server = https.createServer(sslOptions,app).listen(app.get('port'), function(){
  console.log("Secure Express server listening on port " + app.get('port') +" time out in " + config.timeOut + " s");
});  

var io = socketio.listen(server, {
	origins : '*:*'
});
io.set('origins', '*:*');

io.configure('development', function() {
	io.set('transports', config.transports);
	io.set("polling duration", config.timeOut);
	io.set('close timeout', config.timeOut);
});

io.sockets.on('connection', function(socket) {
	socket.on('setPlayer', function(data) {
		game_server.setPlayer(socket.id, data);
	});

	socket.on('request', function(msg) {
		var obj = JSON.parse(msg);
		try {
			if (obj.type == "chat") {
				game_server.chat(obj);
			}
			else if (obj.type == "sendMsgToOtherClient") {
				game_server.sendMsgToOtherClient(obj);
			} 
			else if (obj.type == "playerLogOut") {
				game_server.onUserLogout(socket.id);
			}
		} catch (err) {
			console.log("Error when process request");
		}

	});
	socket.on('disconnect', function() {
		game_server.onUserDisconnect(socket.id);
	});
});

app_server.sendMsgToClient = function(sId, msg) {
	sendToClient(sId, 'message', msg);
};

app_server.sendToClient = function(sId, notice, msg) {
	try {
		io.sockets.sockets[sId].emit(notice, msg);
	} catch (err) {
		console.log("Error: " + JSON.stringify(err));
	}
};
