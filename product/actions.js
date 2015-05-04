var Product   = require('./schema').productModel,
    mongoose  = require('mongoose'),
    _         = require('lodash'),
    Promise   = require('bluebird'),
    scraper   = require('../scraper/scraper');

// object to return so we don't have to return a list of functions
var methods = {};

methods.getAllProducts = function(){
  return new Promise(function (resolve, reject) {
    var productList = {};
    if (!(_.isNull(thresholds.document.product))){
      productList.chunkCount = thresholds.document.product;
    }
    Product.find({}, function (err, products){
      if (err) {
          reject({ 
            err:'MongoDB Failed To Query Products', 
            location: 'getAllProducts'})
      } else {
        productList.productCount = products.length;
        productList.products = [];
        _.forEach(products, function(product){
          productList.products.push(product);
        });
        resolve(productList);
      }
    })
  });
};

methods.addNewProduct = function(product, callback){
  Product.findOne(
    {"asin": product.asin},
    function(err, existingProduct){
      if(err){
        // err
        console.log('err findingOne');
        callback(err, null);
      }else if(existingProduct === null){
        console.log('creating new product');
        var updateDate = new Date(product.date);
        // add new product
        var newProduct = new Product();
        newProduct.asin = product.asin;
        newProduct.title = product.title;
        newProduct.price = product.price;
        newProduct.image = product.img;
        newProduct.created = updateDate;
        newProduct.updated = updateDate;
        newProduct.analytics = [{
          "date": updateDate,
          "price": product.price
        }];

        console.log('created saving');
        newProduct.save(function(err){
          console.log('saved callback time');
          callback(err, newProduct);
        });
      }else{
        // don't do anything for now
        console.log('already exists');
      }
    }
  );
};

methods.getProductsWithTitle = function(productTitle){
  return new Promise(function(resolve, reject){
    console.log("searching for "+productTitle);
    Product.find({$text : {$search : productTitle}}, '-analytics',
    function(err, products){
      if(err){
        reject({
          err: ('MongoDB Failed To Locate Product With Title: ', productTitle),
          location: 'getProductsFromTitle'
        });
      }else{
        console.log('found');
        resolve(products);
      }
    })
  });
};

methods.findProductFromASIN = function(productASIN){
  return new Promise(function(resolve, reject){
    console.log('finding');
    Product.findOne({'asin':productASIN}, function(err, product){
      console.log('found');
      if(err){
        reject({
          status: false,
          err: err,
          location: 'findProductFromASIN'
        });
      } else if(product === null){
        resolve({
          status: false,
          product: product
        });
      } else {
        resolve({
          status: true, 
          product: product
        });
      }
    });
  });
};

module.exports = methods;

