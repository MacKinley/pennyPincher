var updater = require('../productUpdater/productUpdater'),
    discoverer = require('../productDiscoverer/productDiscoverer');

var options = process.argv[2];

/*discoverer.discoveryLoop(30000, function(err, productResponse, next){
    if(!err) {
      if(productResponse.success === true){
        console.log("disovery! at: "+productResponse.product.asin);
        process.send(
          {
            "type" : "discover",
            "product" : productResponse.product
          }
        );
      }else{
        console.log(((new Date()).toString())+"no discovery");
      }
    }else{
      console.error(err);
    }
    next();
  });
*/

process.on('message', function(data){
  if(data.type === 'product'){
    updater.update(data.asin, function(err, productResponse){
      if(!err){
        if(productResponse.success === true){
          console.log("update! at: "+productResponse.product.asin);
          process.send(
            {
              "type" : "update",
              "product" : productResponse.product
            }
          );
        }else{
          console.log('Known product with asin '
              +data.asin+' failed success == false');
          process.send(
            {
              "type": "updateErr"
            }
          );
        }
      }else{
        console.log('Known product with asin '
            +data.asin+' failed to update');
        console.log('error: 'err);
        process.send(
          {
            "type": "updateErr"
          }
        );
      }
    });
  }
});

