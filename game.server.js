/*  Copyright (c) 2013 TruongNGUYEN
    Server for projectX
    BH Licensed.
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

var game_server = module.exports,
	app_server = require('./app.js'),
	Player = require('./player').Player,
	PlayerProvider = require('./playerprovider').PlayerProvider,
	config = require('./config'),
	verbose = true;

var playerProvider = new PlayerProvider(config.mongoDbHost, config.mongoDbPort);

game_server.setPlayer = function(socketId, data) {
	playerProvider.find({playerId:data.id}, function(error, player) {
       if(error) {
       		console.log("Error when find player");
       }
       else {
       	if(player == null) {
       		console.log("Player not exist, create new playerprovider");
       		var player = new Player(data.id, data.name, data.channel);
       		player.setSocketId(socketId);
       		playerProvider.save(player, function(error, insertedPlayer) {
       			if(error) console.log(" error when insert Player: " + JSON.stringify(error));
       			console.log("insertedPlayer: " + JSON.stringify(insertedPlayer));
       		});
       	}
       	else 
       		console.log("Found player: " + JSON.stringify(player));
       		playerProvider.update(player.playerId, {status:1, socketId: socketId},  function(error, updatePlayer) {
       			if(error) console.log(" error when update: " + JSON.stringify(error));
       			console.log("updated Player: " + JSON.stringify(updatePlayer));
       		});
       }
    });
};

game_server.onUserDisconnect = function(socketId) {
	
};

game_server.onUserLogout = function(socketId) {
	
};

function sendMessageToAll(game, msg) {
	
}

function sendMessageToAPlayer(socketId, msg) {
	
}

function lengthOfObj(obj) {
	var length = 0;
	for ( var k in obj) {
		if (obj.hasOwnProperty(k))
			length++;
	}
	return length;
}
