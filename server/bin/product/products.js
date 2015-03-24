function getProduct(productConfig){
	return new Product(productConfig);
}

var Product = function(productConfig){
	var productSchema = productConfig.modules.schema,
		productModel = productSchema.productModel,
		mongoose = productConfig.modules.mongoose,
		_ = productConfig.modules.lodash,
		database = productConfig.mongoRoot;
		var Promise = require("bluebird");

	thresholds = {
		document: {
			product: productConfig.documentThreshold,
			current: null
		}
	};

	mongoose.createConnection(database);

	return {
		getAllProducts: function(){
			return new Promise(function (resolve, reject) {
				var productList = {};
				if (!(_.isNull(thresholds.document.product))){
					productList.chunkCount = thresholds.document.product;
				}
				productModel.find({}, function (err, products){
					if (err) {
							reject({ 
								err:'MongoDB Failed To Query Products', 
								location: 'getAllProducts'})
					} else {
						productList.productCount = products.length;
						productList.products = [];
						_.forEach(products, function(product){
							productList.products.push(product);
						});
						resolve(productList);
					}
				})
			});
		},
		getProductFromASIN: function(productASIN){
			return new Promise(function (resolve, reject){
				if(_.isNull(productASIN)){
					reject({
						err: 'asin Is Not Defined',
						location: 'getProductFromASIN'
					});
				}
				productModel.find({asin: productASIN}, function (err, product){
					if (err) {
						reject({
							err: ('MongoDB Failed To Locate Product With ASIN: ', productASIN),
							location: 'getProductFromASIN'
						});
					} else {
						resolve(product);
					}
				});
			});
		},
		findProductFromASIN: function( productASIN ) {
			return new Promise( function ( resolve, reject ) {
				productModel.findOne({'asin':asin}, function ( err, product ) {
					if (err) {
						reject({
							status: false,
							err: err,
							location: 'findProductFromASIN'
						});
					} else if ( product === null ) {
						resolve({
							status: false,
							product: product
						});
					} else {
						resolve({
							status: true, 
							product: product
						});
					}
				});
			});
		},
		getProductPricesFromASIN: function(productASIN){
			return new Promise(function (resolve, reject){
				if(_.isNull(productASIN)){
					reject({
						err: 'asin Is Not Defined',
						location: 'getProductPricesFromASIN'
					});
				}
				productModel.find({asin: productASIN}, function (err, product){
					if(err){
						reject({
							err: ('MongoDB Failed To Locate Product With ASIN: ', productASIN),
							location: 'getProductPricesFromASIN'
						});
					} else {
						var productPrices = {
							currentPrice: {
								price: product.price,
								updated: product.updated
							},
							priceHistory: [] //getHistory
						}
					}
					resolve(productPrices);
				});
			});
		},
		getProductFromTitle: function(productTitle){
			return new Promise(function (resolve, reject){
				if(_.isNull(productTitle)){
					reject({
						err: 'Product Title Is Not Defined',
						location: 'getProductsFromTitle'
					});
				}
				productModel.find({title: productTitle}, function (err, product){
					if (err){
						reject({
							err: ('MongoDB Failed To Locate Product With Title: ', productTitle),
							location: 'getProductsFromTitle'
						});
					} else {
						resolve(product);
					}
				})
			});
		}
	};
}

module.exports = getProduct;