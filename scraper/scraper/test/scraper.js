var should = require('chai').should(),
    scrape = require('../scraper.js').scrape;

describe('scraper', function() {
    var staticResponse, liveResponse, didCatchErr;
    this.timeout(60000);

    before(function(done){
        // scrape a live known product
        scrape('http://amzn.com/0316769487', function(err, productResponse){
            if(!err){
                liveResponse = productResponse;
            } else {
                throw(err);
            }

            // scrape a static (not hosted by amazon) product
            scrape('http://www.cis.umassd.edu/~mtrudeau/pp/test.html',
                function(err, productResponse){
                    if(!err){
                        staticResponse = productResponse;
                    } else {
                        throw(err);
                    }

                    done();
                }
            );
        });
    });

    // if this fails then we broke the scraper
    it('scrape our own hosted file', function() {
        staticResponse.success.should.equal(true);
        staticResponse.product.asin.should.equal("B007JR532M");
        staticResponse.product.price.should.equal(14.99);
        staticResponse.product.title.should.equal("SanDisk Cruzer 32GB USB " +
            "2.0 Flash Drive, Frustration-Free Packaging- SDCZ36-032G-AFFP");
    });

    // if this fails then the html has changed or product has been removed
    it('scrape live hosted product', function() {
        liveResponse.success.should.equal(true);
        staticResponse.product.asin.should.be.a('string');
        liveResponse.product.price.should.be.a('number');
        liveResponse.product.title.should.not.equal("");
        liveResponse.product.title.should.be.a('string');
    });
});

