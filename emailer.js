var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// Sets up the email transportation
var transport = mailer.createTransport(
  smtpTransport({
    service: 'gmail',
    auth: {
      user: 'ppincher9',
      pass: 'mrkrabs9'
    }
  })
);

var mailOption;

module.exports = {
  sendNewUser : function(user, hash, callback){
    newuserMailOption(user, hash, function(mailOpt){
      transport.sendMail(mailOpt, function(err, response){
        if(!err){
          console.log('sent');
        }
        if(callback != null){
          callback(err, response)
        }
      });
    });
  },

  sendMail : function(product, users, callback){
    createMailOption(product, users, function(mailOpt){
      transport.sendMail(mailOpt, function(err, response){
        if(callback != null){
          callback(err, response)
        }
      });
    });
  }
};

function newuserMailOption(user, hash, callback){
  var link = "http://localhost:8000/api/users/verify/"+ user + '/' + hash;
  var mailOpt = {
    from:'Penny Pinchers',
    to: 'Recipient', 
    bcc: user,
    subject: 'Penny Pinchers New User Please Verify Email', 
    text: ' Thank You four signing up to Penny Pinchers. You can now search and subcribe to any item on our site'+ 
      ' Please click the link below to get started.\n\n' + link

  };
  callback(mailOpt);
}

function createMailOption(product, users, callback) {
  var send = '';
  for( var i = 0; i < users.length; i++){
    send += users[i] +', ';
  }
  var mailOpt = {
    from: 'Penny Pinchers',
    to: 'Recipient',
    bcc: send,
    subject: 'Penny Pinchers Update on Subscription',
    text: 'Check out the new price on this item, ' + product.title + ' now ' +
      product.price + ' also this is a test.'
  };

  callback(mailOpt);
}
