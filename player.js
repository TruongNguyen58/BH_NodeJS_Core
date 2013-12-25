Player = function(playerId, playerName, channel) {
  this.playerId = playerId;
  this.playerName = playerName;
  this.status = 1;
  this.channel = channel;
};

Player.prototype.setStatus = function(status) {
	this.status = status;
};

Player.prototype.setSocketId = function(socketId) {
	this.socketId = socketId;
};

exports.Player = Player;