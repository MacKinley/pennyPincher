//***************************************************************************
// Product Handler
// index.js: RESTful API handler for Product object CRUD functionality
//***************************************************************************
var config = require('../initialization')('index_productConfig');

var express     = config.modules.express,
    products    = config.modules.products,
    mongoose    = config.modules.mongoose,
    _           = config.modules.lodash;

var app = express();

//***************************************************************************
// 	GET Request:
//		/api/product/all
//		Returns all products stored in the database to the client
//***************************************************************************

app.route( '/api/product/all' )
.get( function ( req, res ) {
  products.getAllProducts()
  .then( function ( productList ) {
    res.json(productList);
  })
  .catch( function ( error ) {
    res.status(400).json(error);
  });
});

//***************************************************************************
//	GET Request
//		/api/product:asin
//		Returns a product based on the asin 
//***************************************************************************

app.route('/api/product:asin')
.get(function(req, res){
  console.log('routing product');
  products.findProductFromASIN(req.params.asin)
  .then(function(product){
    res.json(product);
  })
  .catch(function(error){
    res.status(400).json(error);
  });
});

//***************************************************************************
//	GET Request
//		/api/product/prices:asin
//		Returns the price history of a product based on the asin
//***************************************************************************

app.route( '/api/product/prices:asin' )
.get(function(req, res){
  products.getProductPricesFromASIN(req.params.asin)
  .then(function(productPrices){
    res.json(productPrices);
  })
  .catch(function(error){
    res.status(400).json(error);
  });
});

//***************************************************************************
//	GET Request
//		/api/product:title
//		Returns a product based on the product title
//***************************************************************************

app.route('/api/searchFor:title')
.get(function(req, res){
  console.log('routing search');
  products.getProductsWithTitle(req.params.title)
  .then(function(product){
    res.json(product);
  })
  .catch(function(error){
    res.status(400).json(error);
  });
});

module.exports = app;

