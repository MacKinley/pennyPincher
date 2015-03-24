var productSchema = function(){
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

	var details = [{
		timestamp: {type: Date},
		description: {type: String, required: true}
	}]
	var analytics = [{
		updated: {type: Date},
		price: {type: String},
		seller: {type: String}
	}]
	this.schema = new Schema({
		asin: {type: String, required: true},
		title: {type: String, required: true},
		price: {type: String, required: true},
		image: {type: String},
		created: {type: Date},
		updated: {type: Date},
		details: {type: details, required: true},
		analytics: {type: analytics, required: true}
	});

	this.productModel = mongoose.model('Product', this.schema);
};

module.exports = new productSchema;
