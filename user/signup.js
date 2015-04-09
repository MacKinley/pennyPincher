var config = require('../initialization')('index_userConfig'),

	local = require('passport-local').Strategy,
	USER = config.modules.users,
	passport = config.modules.passport;


module.exports = function(passport){
	
	passport.use('local-signup', new local({

		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: 'true'
		},
		// Function to create new user 
		function(email, password, done){
			Users.findOne(email, function(err,user){
				if (err){
					res.json({
						type: false,
						data: "Error" + err
					});
				}
				else{
					// If user is already in the database
					if(user){
						return done(null, false);
					// Creates new user in the database
					}
					else{
						var newUser = new User();
						newUser.email = req.body.email;
						newUser.password = newUser.generateHash(req.body.password);
						newUser.save(function(err, user){
							user.save(function(err, user1){
								res.json({
									type: true,
									data: user1,
								});
							});
						});

					}

				}

			});
		}
	));
};