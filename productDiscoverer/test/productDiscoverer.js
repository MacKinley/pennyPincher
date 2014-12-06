var should = require('chai').should(),
    discoverer = require('../productDiscoverer.js');

describe('#discover', function() {
    it('run discovery code once', function() {
        discoverer.discoveryLoop(5000, function(err, productResponse){
            discoverer.stopDiscovering();
            if(!err){
                productResponse.success.should.be.a('boolean');
                if(productResponse.success){
                    productResponse.price.should.be.a('double');
                    productResponse.title.should.not.equal("");
                    productResponse.title.should.be.a('string');
                }
            } else {
                console.log(err.message);
                err.should.equal(false);               
            }
        });
    });
});
