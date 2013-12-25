var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PlayerProvider = function(host, port) {
  this.db= new Db('node-mongo-player', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


PlayerProvider.prototype.getCollection= function(callback) {
  this.db.collection('players', function(error, player_collection) {
    if( error ) callback(error);
    else callback(null, player_collection);
  });
};

//find all players
PlayerProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, player_collection) {
      if( error ) callback(error)
      else {
        player_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an player by ID
PlayerProvider.prototype.find = function(findField, callback) {
  console.log("find player with field: " + JSON.stringify(findField));
    this.getCollection(function(error, player_collection) {
      if( error ) callback(error)
      else {
        player_collection.findOne(findField, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
console    });
};


//save new player
PlayerProvider.prototype.save = function(player, callback) {
    this.getCollection(function(error, player_collection) {
      if( error ) callback(error)
      else {
        player_collection.insert(player, function() {
          callback(null, player);
        });
      }
    });
};

// update an player
PlayerProvider.prototype.update = function(id, updateField, callback) {
  console.log("Update player id: " + id + " data: " + JSON.stringify(updateField));
    this.getCollection(function(error, player_collection) {
      if( error ) callback(error);
      else {
        player_collection.update({playerId:id},
                                        {$set: updateField},
                                        function(error, updatePlayer) {
                                                if(error) callback(error);
                                                else callback(null, updatePlayer)       
                                        });
      }
    });
};

//delete player
PlayerProvider.prototype.delete = function(id, callback) {
        this.getCollection(function(error, player_collection) {
                if(error) callback(error);
                else {
                        player_collection.remove(
                                {playerId: id},
                                function(error, player){
                                        if(error) callback(error);
                                        else callback(null, player)
                                });
                        }
        });
};

exports.PlayerProvider = PlayerProvider;