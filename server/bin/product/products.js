function getProduct(productConfig){
	return new Product(productConfig);
}

var Product = function(productConfig){
	var productSchema = productConfig.modules.schema,
	productModel = productSchema.productModel,
	mongoose = productConfig.modules.mongoose,
	_ = productConfig.modules.lodash,
	database = productConfig.mongoRoot;

	thresholds = {
		document: {
			product: productConfig.documentThreshold,
			current: null
		}
	};

	mongoose.connect(database);

	return {
		getAllProducts: function(){
			var productList = {};
			if (!(_.isNull(thresholds.document.product))){
				productList.threshold = thresholds.document.product;
			}
			productModel.find({}, function (err, products){
				if (err){
					return {
						error: 'MongoDB Failed to Query Products', 
						location: 'getAllProducts' 
					}
				}
				productList.count = products.length;
				productList.products = [];
				_.forEach(products, function (product){
					productList.products.push(product);
				});	
			});
			return productList;
		},
		getProductsFromASIN: function(productASIN){
			if (_.isNull(productASIN)){
				return {
					error: 'asin is not defined',
					location: 'getProductsFromASIN'
				};
			}
			productModel.find({asin: productASIN}, function (err, product){
				if (err){
					return {
						error: ('Product not found with asis: ',productASIN),
						location: 'getProductsFromASIN'
					};
				}
				return product;
			});
		},
		getProductPricesFromASIN: function(productASIN){
			if (!(_.isNull(productASIN))){
				return {
					error: 'asin is not defined',
					location: 'getProductPricesFromASIN'
				};
			}
			productModel.find({asin: productASIN}, function (err, product){
				if(err){
					return {
						error: ('Product not found with asis: ',productASIN),
						location: 'getProductPricesFromASIN'
					};
				}
				var productPrices = {
					currentPrice: {
						price: product.price,
						updated: product.updated
					},
					priceHistory: []
				};
				var priceHistory = product.analytics;
				_.forEach(priceHistory, function(price){

				});
			});
		},
		getProductsFromTitle: function(title){

		}
	};
}

module.exports = getProduct;