var scrape = require('../scraper/scraper').scrape;

module.exports = {
    // call once to continue discovering new products
    discoveryLoop: function(pauseLength, callback){
        setTimeout(
            createProductURL(function(url){
                tryToScrape(url, pauseLength, callback)
            })
        , pauseLength);
    },

    // for unit tests
    testScrape: function(callback){
        createProductURL(function(url){
            try{
                scrape(url, function(response){
                    callback(false, response, url);
                });
            } catch(err) {
                callback(err, {}, url);
            }
        });
    }
};


function tryToScrape(pauseLength, url, callback){
    try{
        scrape(url, function(response){
            if(response.success){
                callback(false, response, url);
            }
            discoveryLoop(pauseLength, callback);
        });
    } catch(err) {
        callback(err, {}, url);
    }
}

function createProductURL(callback){
    // generate random length of product ID from 1 to 8
    var MAX_LENGTH = 8, MIN_LENGTH = 1;
    var ASCII_A = 65, ASCII_Z = 90;
    var numChars = Math.floor(Math.random()*(MAX_LENGTH-MIN_LENGTH+1)+MIN_LENGTH),
        id = "",
        chr;

    for(numChars; numChars > 0; numChars--){
        // randomly choose between:
        if(Math.floor(Math.random()*(2)) == 0)
            // a random number from 0 to 9
            chr = Math.floor(Math.random()*(10)).toString();
        else
            // a random char from A to Z
            chr = String.fromCharCode(Math.floor(Math.random()*(ASCII_Z-ASCII_A+1)+ASCII_A));
        
        id+=chr;
    }
    callback('http://amzn.com/B00' + id);
}
