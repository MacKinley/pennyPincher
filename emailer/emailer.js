var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// Sets up the email transportation
var transport = mailer.createTransport(
	smtpTransport({
		service: "gmail",
		auth: {
			user: 'ppincher9',
			pass: 'pennypincher9'
		}
	})
);

var mailOption;

module.exports = {
	//console.log('Sending Mail');

	sendMail : function(product, users, callback){

		//
		createMailOption(prodcut, user, function(mailOpt){
			this.mailOption = mailOpt;
		});

		transport.sendMail(mailOption, function(err, response){
			if(callback != null){
				callback(err, response)
			}
		});
	}
};

function createMailOption(product, users, callback) {
	var mailOpt = {

		from: "Penny Pinchers",
		to: 'Recipient',
		bcc:'"mcelestin7@gmail.com","mtrudeau@umassd.edu","vwh1987@hotmail.com","eefahey@hotmail.com" zmori',
		subject: "Penny Pinchers Update on Subscription",
		text: "Check out the new price on this item,"+product.title+"now"+product.price+"also this is a test "

	};

	callback(mailOpt);
}
