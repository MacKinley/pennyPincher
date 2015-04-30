//***************************************************************************
// Product Handler
// index.js: RESTful API handler for Product object CRUD functionality
//***************************************************************************
var config = require('../initialization')('index_productConfig');

var express     = config.modules.express,
    products    = config.modules.products,
    mongoose    = config.modules.mongoose,
    _           = config.modules.lodash,
    bodyparser  = config.modules.bodyparser,
    scraper     = require('../scraper/scraper/scraper');

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
//		/api/scrape/:url
//		scrapes url and returns asin
//***************************************************************************

app.route('/api/scrape')
.post(function(req, res){
  console.log('routed scrape request'+req.body.url);
  scraper.scrape(req.body.url,
  function(err, response){
    console.log('got response from scraper');
    if(err){
      res.json({
        "err": err,
        "asin": null});
    }else if(!response.success){
      res.json({
        "err": "badURL",
        "asin": null});
    }else{
      console.log('scrape a second time just to be sure');
      // generate url from asin and scrape again to ensure its real
      scraper.scrape('http://amzn.com/' + response.product.asin,
      function(err, response){
        console.log('got second response');
        if(err){
          res.json({
            "err": err,
            "asin": null});
        }else if(!response.success){
          res.json({
            "err": 'productNotOnAmazon',
            "asin": null});
        }else{
          // put product in db
          console.log('adding new product');
          products.addNewProduct(response.product, function(err, product){
            console.log('product maybe added');
            if(err){
              res.json({
                "err": err,
                "asin": null}
              );
            }else{
              res.json({
                "err": null,
                "asin": product.asin}
              );
            }
          });
        }
      });
    }
  })
});

//***************************************************************************
//	GET Request
//		/api/product:asin
//		Returns a product based on the asin 
//***************************************************************************

app.route('/api/product/:asin')
.get(function(req, res){
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

app.route( '/api/product/prices/:asin' )
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

app.route('/api/searchFor/:title')
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

