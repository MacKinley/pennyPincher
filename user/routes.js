var config = require('../initialization')('index_userConfig');


var express = config.modules.express, 
    facebook = config.facebook,
    facebookRouting = config.facebook.routing,
    facebookStrategy = config.modules.facebook.Strategy,
    google = config.google,
    googleRouting = config.google.routing,
    googleStrategy = config.modules.google.Strategy,
    bodyparser = config.modules.bodyparser,
    passport = config.modules.passport,
    UserSchema = config.modules.userModel,
    User = UserSchema.userModel,
    users = config.modules.users;

require('./signup')(passport);
require('./login')(passport);

  //Used for login passport uses to serilaze and deserilaze user out of session
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

passport.use(new facebookStrategy({
  clientID: facebook.appId,
  clientSecret: facebook.appSecret, 
  callbackURL: facebookRouting.appCallback,
  profileFields: facebook.profileFields
  },
  function ( accessToken, refreshToken, profile, done ) {
    users.parseFacebookLogin(profile, accessToken)
    .then( function ( user ) {
      done(null, user);
    })
    .catch( function ( err ) {
      done(err);
    });
  })
);

passport.use(new googleStrategy({
  realm: googleRouting.realm,
  returnURL: googleRouting.returnURL
  },
  function ( identifier, profile, done ) {

  })
);

var app = module.exports = express();

app.route( facebookRouting.appRouter )
.get(passport.authenticate('facebook'));

app.route( facebookRouting.appCallback )
.get(
  passport.authenticate('facebook', { failureRedirect: facebookRouting.failureRedirect }), 
  function ( req, res ) {
    res.redirect(facebookRouting.successRedirect);
});

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


//***************************************************************************
//  GET Request
//    /api/users/all
//    Returns all users stored in the database to the client
//***************************************************************************

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

//***************************************************************************
//  GET Request
//    /api/users/id
//    Returns user of current id based on either facebook or google authentication
//***************************************************************************

app.route ( '/api/users/id' )
.get( function ( req, res ) {
  if (res.body.service === 'facebook' || res.body.service === 'google'){
    users.getUserFromId(res.body.userId, res.body.service)
    .then( function ( user ) {
      res.json(user);
    })
    .catch( function ( error ) {
      res.status(400).json(error);
    });
  }else {
    res.status(400);
  }
});

//***************************************************************************
//  GET Request
//    /api/users/asin
//    Returns users subscribed to products with asin
//***************************************************************************
app.route( '/api/users/asin' ) 
.get( function ( req, res ) {

});
app.route( '/api/users/asin/sub' ) 
.get ( function ( req, res ) {

});
app.route( '/api/users/asin' )
.post ( function ( req, res ) {
  if (_.isNull(req.body.asin)){
    res.status(400);
  } else {
    users.addUserSubscription(req.body.userId, req.body.asin, req.body.serive)
    .then( function ( subscription ) {
      res.json(subscription);
    })
    .catch( function ( error ) {
      res.status(400).json(error);
    });
  }
});
app.route( '/api/users/id' )
.delete ( function ( req, res ) {

});

