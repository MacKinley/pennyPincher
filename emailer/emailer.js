var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//module.exports = mail(){

	//mailUser : function(product, user, callback) {
		//set up mail message

		// Sets up the email transportation
		var transport = mailer.createTransport(
		smtpTransport({
			service: "gmail",
			auth: {

				user: 'ppincher9',
				pass: 'pennypincher9'

				}
		}));

		var mailOption = {

			from: "Penny Pinchers",
			to: 'Recipient',
			bcc:'"mcelestin7@gmail.com","mtrudeau@umassd.edu","vwh1987@hotmail.com","eefahey@hotmail.com"',
			subject: "Penny Pinchers Update on Subscription",
			text: "Check out the new price on this item, also this is a test "

		};

		console.log('Sending Mail');

		transport.sendMail(mailOption, function(error, response){
			/*if(callback != null){
				callback(err, )
			}*/

			if(error){
				console.log(error);

			}
			else{
				console.log("message sent" + response.message);
			}
		});
		
	//};
//}







