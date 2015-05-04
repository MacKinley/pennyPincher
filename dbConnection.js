var mongoConfig = {
  mongoRoot: "localhost:27017/pennyPincher",
  mongoUser: "mongoose",
  mongoPwd: "insertpasswordhere",
  uri: function(){return 'mongodb://'+this.mongoUser+':'+this.mongoPwd+'@'+this.mongoRoot;}
};

var mongooseConnection = require('mongoose').createConnection(mongoConfig.uri());

module.exports = mongooseConnection;

