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
        User.findOne({"local.email": email.toLowerCase()}, function(err, user){
          if (err){
            console.log(err);
            res.json({
              type: false,
              data: "Error" + err
            });
            done(err, false);
          }else{
            // If not the correct user email
            if(!user){
              console.log('email not found');
              return done(null, false);
            // Password validation
            }else{
              console.log('found user: '+ user);
              if(!UserSchema.validation(password, user.local.password)){
                console.log("bad password");
                return done(null, false);
              }else{
                console.log("successful login "+user.local.email);
                return done(null, user);
              }
            }
          }
        });
      });
    }
  ));
};

