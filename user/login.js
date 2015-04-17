var config = require('../initialization')('index_userConfig'),

  local = require('passport-local').Strategy,
  UserSchema = config.modules.userModel,
  User = config.modules.userModel.userModel;

module.exports = function(passport){
	passport.use('local-login', new local({

		usernameField: 'email',
		passwordField: 'password'
	},

		function(email, password, done){
			process.nextTick(function() {
				User.findOne({"local.email": email}, function(err,user){
					if (err){
						console.log(err);
						res.json({
							type: false,
							data: "Error" + err
						});
					}else{
						// If not the correct user email
						if(!user){
							console.log("bad email ");
							return done(null, false);
						// Password validation
						}else{
							if(!UserSchema.validation(password, user.local.password)){
								console.log("bad password");
								return done(null, false);
							}else{
								console.log("successful login");
								return done(null, user);
							}

						}

					}

				});
			});
		}
	));
};
