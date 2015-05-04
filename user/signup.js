var local = require('passport-local').Strategy,
    random = require('randomstring'),
    UserSchema = require('./schema'),
    User = UserSchema.userModel,
    emailer = require('../emailer');

module.exports = function(passport){

  passport.use('local-signup', new local({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: 'true'
    },
    // Function to create new user 
    function(req, email, password, done){
      process.nextTick(function() {
        User.findOne({"local.email" : email.toLowerCase()}, function(err,user){
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
              newUser.local.email = email.toLowerCase();
              newUser.local.password = UserSchema.generateHash(password);
              newUser.local.newUserHash = UserSchema.generateHash(random.generate(7)).replace(/\//g, '');
              newUser.save(function(err){
                if(err){
                  done(err, null);
                }else{
                  emailer.sendNewUser(newUser.local.email,
                      newUser.local.newUserHash, function(err, response){
                    if(err){
                      done(err, false);
                    }else{
                      done(null, newUser);
                    }
                  });
                }
              });
            }
          }
        });
      });
    }
  ));
};

