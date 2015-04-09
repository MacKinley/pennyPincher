var userSchema = function() {
  var mongoose = require('mongoose'),
      Schema = mongoose.Schema;
  var bcrypt = require('bcrypt-nodejs');

  var local = {
    displayName: {type: String},
    email: {type: String},
    password: {type: String},
    lastLogin: {type: Date},
    products: {type: products},
    active: {type: Boolean}
  };
  var products = [{
    asin: {type: String}
  }];
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
    local: {type: local},
    google: {type: google},
    facebook: {type: facebook}
  });

  this.userModel = mongoose.model('User', this.schema);
};

 userSchema.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  userSchema.validation = function(password){
    return bcrypt.compareSync(password, this.local.password);
  };

module.exports = new userSchema;

