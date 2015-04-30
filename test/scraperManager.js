var should = require('chai').should(),
    arrayStream = require('arraystream'),
    child = require('child_process');

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
    updatedAll = false,
    manager;

describe('#manager tests', function() {
    this.timeout(60000);

    before(function(done){
        manager = child.fork('./scraper/scraperManager')

        manager.on('message', function(data){
            if(data.type === 'update'){
                productStream.resume();
            }

            if(data.type === 'updateErr'){
                productStream.resume();
            }

            if(updatedAll){
                manager.kill('SIGINT');
                done();
            }
        });

        productStream = arrayStream.create(productsList);

        productStream.on('data', function(product, key){
            productStream.pause();

            manager.send(
                {
                    "type" : "product",
                    "asin" : product.asin
                }
            );
        });

        productStream.on('end', function(){
            updatedAll = true;
        });

        productStream.on('error', function(err){
            throw(err);
        });
    });

    it('manager forked, passed messages and closed properly', function(){

    });
});

