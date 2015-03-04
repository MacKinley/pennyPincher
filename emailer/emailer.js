var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// Sets up the email transportation
var transport = mailer.createTransport(
	smtpTransport({
		service: 'gmail',
		auth: {
			user: 'ppincher9',
			pass: 'pennypincher9'
		}
	})
);

var mailOption;

module.exports = {

	sendMail : function(product, users, callback){

		//
		createMailOption(product, users, function(mailOpt){
			//this.mailOption = mailOpt;

			transport.sendMail(mailOpt, function(err, response){
				if(callback != null){
					callback(err, response)
				}
			});
		});

		
	}
};

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
