var config = require('../initialization')('index_userConfig'),

  local = require('passport-local').Strategy,
  UserSchema = config.modules.userModel,
  User = config.modules.userModel.userModel,
  passport = config.modules.passport;


module.exports = function(passport){

  passport.use('local-signup', new local({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: 'true'
    },
    // Function to create new user 
    function(req, email, password, done){
      process.nextTick(function() {
        User.findOne({"local.email" : email}, function(err,user){
          if (err){
            res.json({
              type: false,
              data: "Error" + err
            });
          }else{
            // If user is already in the database
            if(user){
              done(null, false);
          }else{
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.password = UserSchema.generateHash(password);
              newUser.save(function(err){
                if(err){
                  done(err, null);
                }else{
                  done(null, newUser);
                }
              });
            }
          }
        });
      });
    }
  ));
};
