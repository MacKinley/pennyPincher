var express           = require('express');
    facebookConfig    = require('./config').facebook,
    facebookStrategy  = require('passport-facebook').Strategy;

app = express();

module.exports = function(passport){
  passport.use(new facebookStrategy({
    clientID: facebookConfig.appId,
    clientSecret: facebookConfig.appSecret, 
    callbackURL: facebookConfig.routing.appCallback,
    profileFields: facebookConfig.profileFields
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

  app.route(facebookConfig.routing.appRouter)
  .get(passport.authenticate('facebook'));

  app.route(facebookConfig.routing.appCallback)
  .get(passport.authenticate('facebook',{
      failureRedirect: facebookConfig.routing.failureRedirect
    }),
    function(req, res){
      res.redirect(facebookConfig.routing.successRedirect);
  });
}

