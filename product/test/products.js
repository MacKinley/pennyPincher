module.exports = function(){

	var queries = (function(){
		var productDatabase = 'productsdb';
		var productCollection = ['products'];

		return {
			createProduct : function(dbHandler, product){
				var db = dbHandler(productDatabase);
				var collection = db.collection(productCollection);

			},
			readProductByAmazonID : function(dbHandler, amazonID){

			},
			readProductByTag : function(dbHandler, itemTag){

			},
			readDatabase : function(dbHandler){
				var db = dbHandler(productDatabase);
				var collection = db.collection(productCollection);
				db.collection.find(function(err, docs){
					if (err || !docs){
						console.log("Failed to find products");
					} else {
						var results = [];
						docs.foreach(function(doc){
							//results.append()
						})
					}
				});
			},
			updateProduct : function(dbHandler, product){

			},
			deleteProduct : function(dbHandler, productID){

			}
		};
	})();

	var productSchema = (function(){
		//Unique guid for every element within the database
		var id = {'id':{'type':'number', 'required':'true'}};
		//Unique AmazonID of the product object
		var amazonID = {'amazonID':{'type':'number', 'required':'true'}}; 
		//List of possible tagged names used for the product		
		var tags = {'tags':{'type':'list','listType':'string','required':'true'}};
		//List of images associated with product
		var images = {'images':{'type':'list','listType':'image','required':'true'}};
		//List of analytical objects for the product
		var analytics = {'analytics':{'type':'list','listType':'analytic','required':'true'}};

		return {
			getID : function(){
				return id['id'];
			},
			getAmazonID : function(){
				return amazonID['amazonID'];
			},
			getTags : function(){
				return tags['tags'];
			},
			getImages : function(){
				return images['images'];
			},
			getAnalytics : function(){
				return analytics['analytics'];
			}
		};

	})();

	function validateAmazonID(amazonID, requirements){
		var errorLog = [];
		if (typeof requirements === 'object'){
			if (typeof amazonID !== requirements.type || typeof amazonID === 'undefined'){
				errorLog.push('type');
				errorLog.push('required');
			}
		} else {
			errorLog.push('requirements');
		}
		return errorLog.length > 0 ? errorLog : undefined;
	}
	function validateTag(tag, requirements){
		var errorLog = [];
		if (typeof requirements === 'object'){
			if (typeof tag !== requirements.type || typeof tag === 'undefined'){
				errorLog.push('type');
				errorLog.push('required');
			}
		} else {
			errorLog.push('requirements');
		}
		return errorLog.length > 0 ? errorLog : undefined;
	}
	function validateTags(tags, requirements){
		var errorLog = [];
		if (!Array.isArray(tags)){
			errorLog.push('type');
		} else {
			for(var i = 0; i < tags.length; i++){
				errorLog.push(validateTag(tags[i], requirements));
			}
		}
		return errorLog.length > 0 ? errorLog : undefined;
	}
	function validateImage(image, requirements){
		var errorLog = [];
		return errorLog;

	}
	function validateImages(images, requirements){

	}
	function validateAnalytic(analytic, requirements){
		var errorLog = [];
		return errorLog;
	}
	function validateAnalytics(analytics, requirements){

	}
	//Mongoose
	var productDatabaseURL = 'mongodb://localhost/product';

	var productDatabase = 'productsdb';
	var productCollection = ['products'];

	return {

		//Function to return a schema for the front end. 
		//Validation and stuff will work this way

		getSchema : function(){
			return [productSchema.getID(), productSchema.getAmazonID(), productSchema.getTags(), productSchema.getImages(), productSchema.getAnalytics()];
		},
		validateProduct : function(product){
			//Validate each section of the json object and then add to database
		},
		addProduct : function(dbHandler, product){

		},
		getProduct : function(dbHandler, index){

		},
		deleteProduct : function(dbHandler, index){

		},
		createProduct: function(jsonFactory, amazonID, tags, images, analytics){
			var schema = new productSchema();
			var error = {};
			error.amazonID = validateAmazonID(amazonID, schema.getAmazonID());
			error.tags = validateTags(tags, schema.getTags());
			error.images = validateImages(images, schema.getImages());
			error.analytics = validateAnalytics(analytics, schema.getAnalytics());
			if (Object.keys(error).length > 0){
				return error;
			} else {
				var input = [amazonID, tags, images, analytics];
				var json;
				if (typeof (json = jsonFactory.createJSON(schema, input)) === 'undefined'){
					error.json = 'error';
					return error;
				}
				return json;
			}
		},
		getDatabaseURL : function(){
			return productDatabaseURL;
		}
	};
}();
