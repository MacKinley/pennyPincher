var should = require('chai').should(),
    scrape = require('../scraper.js').scrape;

describe('scraper', function() {
    var staticProduct, liveProduct;
    this.timeout(10000);

    before(function(done){
        // scrape a live known product
        scrape('http://amzn.com/B0011URFRE', function(err, productResponse){
            if(!err){
                liveProduct = productResponse;
            } else {
                throw(err);
            }

            // scrape a static (not hosted by amazon) product
            scrape('http://www.cis.umassd.edu/~mtrudeau/pp/test.html',
                    function(err, productResponse){
                if(!err){
                    staticProduct = productResponse;
                } else {
                    throw(err);
                }
                done();
            });
        });
    });

    // if this fails then we broke the scraper
    it('scrape local file', function() {
        staticProduct.success.should.equal(true);
        staticProduct.price.should.equal(14.99);
        staticProduct.title.should.equal("SanDisk Cruzer 32GB USB 2.0 Flash Drive, Frustration-Free Packaging- SDCZ36-032G-AFFP");
    });

    // if this fails then the html has changed or product has been removed
    it('scrape live hosted product', function() {
        liveProduct.success.should.equal(true);
        liveProduct.price.should.be.a('number');
        liveProduct.title.should.not.equal("");
        liveProduct.title.should.be.a('string');
    });
});

