var local = require('passport-local').Strategy;
var USER = require('./Users/mcelestin/pennyPincher/server/bin/user');
var passport = require('passport');
var flash = require('connect-flash');

//Used for login passport uses to serilaze and deserilaze user out of session
passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findByID(id, function(err, user){
		done(err, user);
	});
});



passport.use('local-login', new LocalStrategy({

	usernameField: 'email',
	passwordField: 'password'
},

	function(username, password, done){
		Users.findOne({email: req.body.email}, function(err,user){
			if (err){
				res.json({
					type: false,
					data: "Error" + err
				});
			}else{
				// If user is already in the database
				if(!user){
					return done(null, false, req.flash('Error : User Email Is Not Found'));
				// Creates new user in the database
				}else{
					if(!user.validation(password)){
						return done(null, false, req.flash('HMM.. Sorry Wrong Password'));
					}else{
						return done(null, user);
					}

				}

			}

		});
	};
});
