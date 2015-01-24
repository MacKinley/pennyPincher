var scrape = require('../scraper/scraper').scrape;
//    mongo = require('mongodb').MongoClient;

var updating = false,
    productStream = null;

module.exports = {
    startUpdating: function update(getStream, updateProduct){
        if(!updating){
            updating = true;
            getStream(function(stream){
                productStream = stream;
                productStream.on('data', function(product, key){
                    productStream.pause();
                    scrape(product.url, function(err, product){
                        updateProduct(err, product);
                        productStream.resume();
                    });
                });

                productStream.on('end', function(){
                    updating = false;
                    update(getStream, updateProduct);
                    // Destory temp table and stream
                });

                productStream.on('error', function(err){
                    updating = false;
                    updateProduct(err, null);
                });
            });
        }
    },

    stopUpdating: function(callback){
        updating = false;
        productStream.destroy();
    }
};

