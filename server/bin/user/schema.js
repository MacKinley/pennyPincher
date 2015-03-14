var userSchema = function(){
	var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

	this.schema = new Schema({
		firstname: {type: String},
		lastname: {type: String},
		age: {type: Number},
		username: {type: String},
		email: {type: String},
	});

};
module.exports = new userSchema;