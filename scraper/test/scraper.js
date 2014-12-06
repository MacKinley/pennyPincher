var should = require('chai').should(),
    scrape = require('../scraper.js').scrape;

describe('#scrape', function() {
    // scrape static file to test if the actual data scraped remains consistent
    it('scrape local file', function() {
        scrape('file:./test.html', function(err, response) {
            if(!err){
                response.success.should.equal(true);
                response.price.should.equal(14.99);
                response.title.should.equal("SanDisk Cruzer 32GB USB 2.0 Flash Drive, Frustration-Free Packaging- SDCZ36-032G-AFFP");
            }else{
                // ensure the test fails
                err.should.equal(false);
            }
        });
    });
    
    // scrape live page to test if we are still able to scrape title and price
    it('scrape live hosted product', function() {
        scrape('http://amzn.com/B0011URFRE', function(err, response) {
            if(!err){
                response.success.should.equal(true);
                response.price.should.be.a('double');
                response.title.should.not.equal("");
                response.title.should.be.a('string');
            }else{
                // ensure the test fails
                err.should.equal(false);
            }
        });
    });
});
