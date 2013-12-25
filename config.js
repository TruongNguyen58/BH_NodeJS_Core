var config = {}

config.timeOut = 15; //s
config.transports = [ 'xhr-polling' ];
config.port = 3000;
config.mongoDbHost = 'localhost';
config.mongoDbPort = '27017';

module.exports = config;