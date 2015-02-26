var Product = function(productConfig){

	var scraperKey = productConfig.scraperKey;
	var threshold_days = productConfig.updateThreshold_days;
	var threshold_sec = productConfig.updateThreshold_sec;
	var threshold_milli = productConfig.updateThreshold_milli;
	var errors = productConfig.errors;

	var schemaHandler = function(){

		this.productModelTypes = 'Product Detail Analytic'.split(' ');

		var productSchema = mongoose.Schema({
			asin: {type: String, required: true},
			title: {type: String, required: true},
			price: {type: String, required: true},
			image: {type: String, required: false},
			details: {type: Schema.Types.ObjectID, required: true, ref: 'Detail'},
			analytics: {type: Schema.Types.ObjectID, required:true, ref: 'Analytic'}
		});

		//detailSchema 
		var detailSchema = mongoose.Schema({
			asin: {type: String, required: true},
			tags: {type: [String], required: false},
			desc: {type: [String], required: false}
		});

		//analyticSchema
		var priceSchema = {
			timestamp: {type: Date, required: true},
			price: {type: String, required: true},
			seller: {type: sellerSchema, required: true}
		};
		var sellerSchema = {
			account: {type: String, required: true},
			rating: {type: String, required: false}
		};
		var analyticSchema = mongoose.Schema({
			asin: {type: String, required: true},
			prices: {type: priceSchema, required: true}
		});


		var productModels = {
			'Product': mongoose.model('Product', productSchema),
			'Detail': mongoose.model('Detail', detailSchema),
			'Analytic': mongoose.model('Analytic', analyticSchema)
		};

		this.getModel = function(type){
			var length = productModelTypes.length;
			for(var i = 0; i < length; i++){
				if (type === productModelTypes[i]){
					return productModelTypes[i];
				}
			}
			return null;
		};
		this.getModels = function(){
			return productModels;
		};
	};

	this.postProduct = function(key, product){
		//check scraper key
	};
	this.getProduct = function(request){
		return errors.get;
	};
};

module.exports = new Product();