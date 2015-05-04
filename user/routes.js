var config = require('./config');

var express = require('express'),
    facebook = config.facebook,
    facebookRouting = facebook.routing,
    bodyparser = require('body-parser'),
    passport = require('passport'),
    UserSchema = require('./schema'),
    User = UserSchema.userModel,
    userActions = require('./actions');;

require('./signup')(passport);
require('./login')(passport);
require('./facebook')(passport);

//Used for login passport uses to serilaze and deserilaze user out of session
passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

var app = express();

app.post('/api/users/signup', passport.authenticate('local-signup'),
  function(req, res){
    req.user.local.password = null;
    res.json(req.user);
  }
);

app.post('/api/users/login', passport.authenticate('local-login'),
  function(req, res){
    req.user.local.password = null;
    res.json(req.user);
  }
);

app.get('/api/users/logout', function(req, res){
  req.logout();
  console.log('loggedOut');
  res.redirect('/');
});

app.get('/api/users/verify/:email/:hash', 
  function( req, res ){
    User.findOne({"local.email" : req.params.email}, function(err, user){
      if(err){
        console.log(err);
        res.json(
          {"err": err,
          "success": false}
        );
      }else if(user.local.newUserHash === req.params.hash){
        console.log("verified email of new client");
        user.local.verified = true;
        user.save(function(err){
          if(!err){
            res.json(
              {"err": null, 
              "success": true}
            );
          }else{
            res.json(
              {"err": err,
              "success": false}
            );
          }
        });
      }
    });
  }
);

app.post('/api/users/addSubscription', function(req, res){
  if(req.user){
    var asin = req.body.asin;
    User.findOneAndUpdate(
      {"local.email": req.user.local.email.toLowerCase()},
      {$push: {"local.products": asin}},
      {"new": true},
      function(err, user){
      if(err){
        res.json({
          "err": err,
          "user": null
        });
      }else{
        user.local.password = null;
        res.json({
          "err": null,
          "user": user
        });
      }
    });
  }else{
    res.json({
      "err": "notLoggedIn",
      "user": null
    });
  }
});

app.post('/api/users/removeSubscription', function(req, res){
  if(req.user){
    var asin = req.body.asin;
    User.findOneAndUpdate(
      {"local.email": req.user.local.email.toLowerCase()},
      {$pull: {"local.products": asin}},
      {"new": true},
      function(err, user){
      if(err){
        res.json({
          "err": err,
          "user": null
        });
      }else{
        user.local.password = null;
        res.json({
          "err": null,
          "user": user
        });
      }
    });
  }else{
    res.json({
      "err": "notLoggedIn",
      "user": null
    });
  }
});

app.post('/api/users/updateEmail', function(req, res){
  if(req.user){
    var newEmail = req.body.newEmail.toLowerCase();
    User.findOneAndUpdate(
      {"local.email": req.user.local.email.toLowerCase()},
      {$set: {"local.email": newEmail.toLowerCase()}},
      {"new": true},
      function(err, user){
      if(err){
        req.user.local.password = null;
        res.json({
          "err": err,
          "user": req.user
        });
      }else{
        user.local.password = null;
        res.json({
          "err": null,
          "user": user
        });
      }
    });
  }else{
    res.json({
      "err": 'notLoggedIn',
      "user": null
    });
  }
});

app.post('/api/users/updatePassword', function(req, res){
  if(req.user){
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;

    if(UserSchema.validation(currentPassword, req.user.local.password)){
      User.findOneAndUpdate(
        {"local.email": req.user.local.email.toLowerCase()},
        {$set: {"local.password": UserSchema.generateHash(newPassword)}},
        {"new": true},
        function(err, user){
        if(err){
          req.user.local.password = null;
          res.json({
            "err": err,
            "user": req.user
          });
        }else{
          user.local.password = null;
          res.json({
            "err": null,
            "user": user
          });
        }
      });
    }else{
      //password incorrect
      res.json({
        "err": 'incorrectPassword',
        "user": null
      });
    }
  }else{
    res.json({
      "err": 'notLoggedIn',
      "user": null
    });
  }
});

app.get('/api/users/status', function(req, res){
  if(req.user){
    req.user.local.password = null;
    res.json({
      'loggedIn': true,
      'user':     req.user
    });
  }else{
    res.json({
      'loggedIn': false,
      'user':     {
        local: {
          products: []
        }
      }
    });
  }
});

module.exports = app;

