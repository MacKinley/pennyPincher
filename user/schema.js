var userSchema = function() {
  var db = require('../initialization')('mongooseConnection');
  var mongoose = require('mongoose'),
      Schema = mongoose.Schema;
  var bcrypt = require('bcrypt-nodejs');

  /*var local = {
    displayName: {type: String},
    email: {type: String},
    password: {type: String},
    lastLogin: {type: Date},
    products: {type: products},
    active: {type: Boolean}
  };*/
  var google = {
    id: {type: String}
  };
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
    google: {type: google},
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

