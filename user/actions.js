var config = require('./config');

var userSchema  = require('./schema'),
    userModel   = userSchema.userModel,
    _           = require('lodash'),
    Promise     = require('bluebird'),
    error       = config.errors,
    products    = require('../product/actions');

function parseFacebookLogin(profile, token){
  process.nextTick(function(){
    return new Promise(function(resolve, reject){
      userModel.find({'facebook.id': profile.id}, function(err, user){
        if (err) {
          reject({
            err: err, 
            location: 'parseFacebookLogin'
          });
        }else if(user){
          resolve({user: user, created: false});
        }else{
          var newUser = new userModel();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.email = profile.emails[0].value;
          newUser.facebook.name = profile.name.givenName;
          newUser.save( function ( err ) {
            if(err){
              reject({
                err: err,
                location: 'parseFacebookLogin'
              });
            }else{
              resolve({user: newUser, created: true});
            }
          });
        }
      });
    });
  });
};

function getUserFromFacebook(userId){
  return new Promise(function(resolve, reject){
    userModel.find({'facebook.id': userId}, function (err, user ) {
      if(err){
        reject({
          err: errors.notFound,
          location: 'getUserFromFacebook'
        });
      }else{
        resolve(user);
      }
    });
  });
};

function updateUserSubscription(userId, asin, service){
  return new Promise(function(resolve, reject){
    var queryString = (service === 'facebook') ? 'facebook.id' : 'google.id';
    userModel.find({queryString: userId}, function(err, user){
      if(err){
        reject({
          err: errors.notFound,
          location: 'updateUserSubscription'
        });
      }else{
        var subscriptions = user.local.products;
        var doesExist = false;
        for (var i = 0; i < subscriptions.length; i++) {
          if (asin === subscriptions[i]) {
            doesExist = true;
          }
        }
        if(doesExist){
          reject({
            err: errors.asinExists,
            asin: asin,
            location: 'updateUserSubscription'
          });
        }else{
          subscriptions.push(asin);
          user.local.products = subscriptions;
          user.save(function(err){
            if(err){
              reject({
                err: asinSave,
                asin: asin,
                location: 'updateUserSubscription'
              });
            }
            resolve(subscriptions);
          });
        }
      }
    });
  });
};

function removeUserSubscription(userId, asin, service){
  return new Promise(function(resolve, reject){
    var queryString = (service === 'facebook') ? 'facebook.id' : 'google.id';
    userModel.find({queryString: userId}, function(err, user){
      if(err){
        reject({
          err: errors.asinNotFound,
          asin: asin, 
          location: 'removeUserSubscription'
        });
      }else{
        var subscriptions = user.local.products;
        _.indexOf(subscriptions, asin)
        .then( function ( index ) {
          _.pullAt(subscriptions, index)
          .then( function ( removed ){
            user.local.products = subscriptions;
            user.save( function ( err ) {
              if(err){
                reject({
                  err: asinRemove,
                  asin: asin, 
                  location: 'removeUserSubscription'
                });
              }
              resolve(removed);
            });
          });
        });
      }
    });
  });
};

function deactivateUser(userid, service){
  return new Promsie( function ( resolve, reject ) {
    var queryString = (service === 'facebook') ? 'facebook.id' : 'google.id';
    // user.local.active = false 
    userModel.findOne({queryString: userId}, function ( err, user ) {
      if (err) {
        reject({
          err: err,
          location: 'deactivateUser'
        });
      }else if(user === null){
        reject({
          err: errors.deactivate,
          location: 'deactivateUser'
        });
      }else{
        user.local.active = false;
        user.save(function(err){
          if(err){
            reject({
              err: err,
              location: 'deactivateUser'
            });
          }else{
            resolve(user.local);
          }
        });
      }
    });
  });
};

function reactivateUser(userId, service){
  return new Promise(function(resolve, reject){
    // var queryString = ()
  });
};

methods = {};

methods.getAllUsers = function() {
  return new Promise(function(resolve, reject){
    userModel.find({active: true}, function (err, users) {
      if(err){
        reject({
          err: 'MongoDB Failed to Query Users',
          location: 'getAllUsers'
        });
      }else{
        resolve(users);
      }
    });
  })
};

methods.getUserFromId = function(userId, service){
  return new Promise(function(resolve, reject){
    switch(service){
      case 'google':
      getUserFromGoogle(userId)
      .then(function(user){
        resolve(user);
      })
      .catch(function(error){
        reject(error);
      });
      case 'facebook':
      getUserFromFacebook(userId)
      .then(function(user){
        resolve(user);
      })
      .catch(function(error){
        reject(error);
      });
    }
  });
};

methods.addUserSubscription = function(userId, asin, service){
  return new Promise(function(resolve, reject){
    //We need to check if the product exists first 
    products.findProductFromASIN(asin)
    .then(function(result){
      if (result.status === false) {
        reject({
          err: errors.noSuchProduct,
          location: 'addUserSubscription'
        });
      }else{
        //If product is found, append the asin to the user
        updateUserSubscription(userId, asin, service)
        .then(function(subscriptions){
          resolve(subscriptions);
        })
        .catch(function(error){
          reject({
            err: error,
            location: 'addUserSubscription'
          })
        });
      }
    })
    .catch(function(error){
      reject({
        err: error,
        location: 'addUserSubscription'
      });
    });
  });
};

methods.removeUserSubscription = function(userId, asin){
  return new Promise(function(resolve, reject){

  });
};

methods.getAllSubscribedUsers = function(asin){

};

module.exports = methods;

