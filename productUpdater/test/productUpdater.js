var should = require('chai').should(),
    arrayStream = require('arraystream');
    updater = require('../productUpdater.js');

var timesToUpdate = 2,
    timesUpdated = 0;

var productsList = [];
productsList.push(
        {
            "title" : "SanDisk Cruzer 32GB USB 2.0 Flash Drive, "+
                        "Frustration-Free Packaging- SDCZ36-032G-AFFP",
            "url" : "http://www.cis.umassd.edu/~mtrudeau/pp/test.html",
            "popularity" : 100
        }
);

productsList.push(
        {
            "title" : "Apple Time Capsule 3TB ME182LL/A [NEWEST VERSION]",
            "url" : "http://www.cis.umassd.edu/~mtrudeau/pp/test2.html"
        }
);

var numProducts = productsList.length;

describe('#updater tests', function() {
    this.timeout(60000);

    before(function(done){
        // start updater feeding it fake DB
        updater.startUpdating(createStream, function(err, product) {
            if(!err){
                ++timesUpdated;
            }else{
                throw(err);
            }
            if(timesUpdated >= numProducts*2){
                // TODO the .destory() method of the arrayStream module isn't
                // working properly
                //updater.stopUpdating();
                done();
            }
        });
    });

    it('updated the products' , function() {
        timesUpdated.should.equal(numProducts*2);
    });
});

function createStream(callback) {
    callback(arrayStream.create(productsList));
}

