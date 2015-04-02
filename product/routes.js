//***************************************************************************
// Product Handler
// index.js: RESTful API handler for Product object CRUD functionality
//***************************************************************************
var config = require('../initialization')('index_productConfig');

var express     = config.modules.express,
    path        = config.modules.path,
    products    = config.modules.products,
    mongoose    = config.modules.mongoose,
    _           = config.modules.lodash,
    stream      = config.modules.stream,
    Require     = config.modules.Promise,
    bodyparser  = config.modules.bodyparser;

var app = module.exports = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());

// products.getNumber(5)
// .then(function(val){
// 	console.log(val);
// });

// products.getAllProducts()
// .then(function (list){
// 	console.log(list);
// });

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

app.route( '/api/product:asin' )
.get( function ( req, res ) {
  if (_.isNull(req.params.asin)) {
    res.status(400).json({err:'Invalid Parameters'});
  } else {
    products.getProductFromASIN(req.params.asin)
    .then( function (product) {
      res.json(product);
    })
    .catch( function (error ) {
      res.status(400).json(error);
    });
  }
});

//***************************************************************************
//	GET Request
//		/api/product/prices:asin
//		Returns the price history of a product based on the asin
//***************************************************************************

app.route( '/api/product/prices:asin' )
.get( function ( req, res ) {
  if (_.isNull(req.params.asin)) {
    res.status(400).json({err:'Invalid Parameters'});
  } else {
    products.getProductPricesFromASIN(req.params.asin)
    .then ( function ( productPrices ) {
      res.json(productPrices);
    })
    .catch( function ( error ) {
      res.status(400).json(error);
    });
  }
});

//***************************************************************************
//	GET Request
//		/api/product:title
//		Returns a product based on the product title
//***************************************************************************

app.route( '/api/product:title' )
.get( function ( req, res ) {
  if (_isNull(req.params.title)) {
    res.status(400).json({err:'Invalid Parameters'});
  } else {
    products.getProductsFromTitle(req.params.title)
    .then ( function ( product ) {
      res.json(product);
    })
    .catch ( function ( error ) {
      res.status(400).json(error);
    });
  }
});

