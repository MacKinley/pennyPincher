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
  User = config.modules.userModel,
	users = config.modules.users;

require('./signup')(passport);
require('./login')(passport);

  //Used for login passport uses to serilaze and deserilaze user out of session
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    user.userModel.findOne(id, function(err, user){
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
      res.json(req.user); 
});

app.post('/api/users/login', passport.authenticate('local-login'),
	function(req, res){
		res.json(req.user);
	}
);



//***************************************************************************
//	GET Request
//		/api/users/all
//		Returns all users stored in the database to the client
//***************************************************************************

app.route( '/api/users/all' )
.get( function ( req, res ) {
	users.getAllUsers()
	.then( function ( userList ) {
		res.json(userList);
	})
	.catch( function ( error ) {
		res.status(400).json(error);
	});
});

//***************************************************************************
//	GET Request
//		/api/users/id
//		Returns user of current id based on either facebook or google authentication
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
//	GET Request
//		/api/users/asin
//		Returns users subscribed to products with asin
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

