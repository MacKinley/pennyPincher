var should = require('chai').should(),
    discoverer = require('../scraper/productDiscoverer.js');

describe('#discoverer tests', function() {
    var product, timesLooped = 0;
    this.timeout(10000);

    before(function(done){
        discoverer.discoveryLoop(1000, function(err, productResponse, next){
            if(!err){
                timesLooped++;
            } else {
                throw(err);
            }

            if(timesLooped >= 3){
                product = productResponse;
                discoverer.stopDiscovering(done);
            }

            next();
        });
    });

    it('check if discovery loop looped 3 times', function() {
        timesLooped.should.equal(3);
        product.success.should.be.a('boolean');
        if(product.success){
            product.price.should.be.a('number');
            product.title.should.not.equal("");
            product.title.should.be.a('string');
        }
    });
});

