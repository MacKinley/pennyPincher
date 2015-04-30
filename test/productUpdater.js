var should = require('chai').should(),
    arrayStream = require('arraystream');
    updater = require('../scraper/productUpdater.js');

var productsList = [];
productsList.push(
        {
            "title" : "SanDisk Cruzer 32GB USB 2.0 Flash Drive, "+
                        "Frustration-Free Packaging- SDCZ36-032G-AFFP",
            "price" : 15.99,
            "asin" : "B007JR532M"
        }
);

productsList.push(
        {
            "title" : "Apple Time Capsule 3TB ME182LL/A [NEWEST VERSION]",
            "price" : 139,
            "asin" : "B0011URFRE"
        }
);

var numProducts = productsList.length,
    timesUpdated = 0;

describe('#updater tests', function() {
    this.timeout(30000);

    before(function(done){
        productStream = arrayStream.create(productsList);

        productStream.on('data', function(product, key){
            productStream.pause();

            updater.update(product.asin, function(err, product){
                if(!err){
                    timesUpdated++;
                    productStream.resume();
                }else{
                    throw(err);
                }
            });
        });

        productStream.on('end', function(){
            done();
        });

        productStream.on('error', function(err){
            throw(err);
        });
    });

    it('updated the products' , function() {
        timesUpdated.should.equal(numProducts);
    });
});

