var productSchema = function(){
  var db = require('../dbConnection');

  var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

  var analytics = [{
    _id: false,
    date: {type: Date},
    price: {type: Number}
  }];

  this.schema = new Schema({
    asin: {type: String, required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String},
    created: {type: Date},
    updated: {type: Date},
    analytics: {type: analytics, required: true}
  });

  this.schema.index({title: 'text'});

  this.productModel = db.model('products', this.schema);
};

module.exports = new productSchema;

