var userSchema = function() {
  var db = require('../dbConnection');

  var mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs');

  var facebook = {
    id: {type: String},
    token: {type: String},
    email: {type: String},
    name: {type: String}
  };

  this.schema = new Schema({
    local: {
      displayName: {type: String},
      email: {type: String},
      password: {type: String},
      newUserHash: {type: String}, 
      lastLogin: {type: Date},
      products: [],
      verified: {type: Boolean, default: false},
      active: {type: Boolean}
    },
    facebook: {type: facebook}
  });

  this.generateHash = function(str){
    return bcrypt.hashSync(str, bcrypt.genSaltSync(8), null);
  };

  this.validation = function(str, hash){
    return bcrypt.compareSync(str, hash);
  };

  this.userModel = db.model('users', this.schema);
};

module.exports = new userSchema;

