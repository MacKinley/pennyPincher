var should = require('chai').should(),
    testScrape = require('../productDiscoverer.js').testScrape;

describe('#discover', function() {
    // run the testScrape method to make sure code builds & runs
    // not sure how to test that it will loop properly
    it('run discovery code once', function() {
        testScrape(function(err, productResponse, url){
            if(err){
                
            } else {
                productResponse.success.should.be.a('boolean');
                if(productResponse.success){
                    productResponse.success.should.equal(true);
                    productResponse.price.should.be.a('double');
                    productResponse.title.should.not.equal("");
                    productResponse.title.should.be.a('string');
                }
            }
        });
    });
});
