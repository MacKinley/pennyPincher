var scrape = require('../scraper/scraper').scrape;
var Sequence = require('sequence').Sequence,
    sequence = Sequence.create();

var stopped = true;

module.exports = {
    // call once to continue discovering new products
    discoveryLoop: function(pauseLength, callback){
        stopped = false;
        discoveryHelper(pauseLength, callback);
    },

    stopDiscovering: function(callback){
        stopped = true;
        if(callback != null)
            callback();
    }
};

function discoveryHelper(pauseLength, callback){
    var recursiveCB = function(err, response){
        sequence
            .then(function(next){
                callback(err, response, next);
            })
            .then(function(next){
            discoveryHelper(pauseLength, callback);
                next();
            });
    };

    if(!stopped){
        setTimeout(function(){
            createProductURL(function(url){
                console.log((new Date()).toString() + "discovering at: "+url);
                scrape(url, recursiveCB);
            });
        }, pauseLength);
    }
}

function createProductURL(callback){
  var ASIN_LENGTH = 7, ISBN_LENGTH = 10, ISBN13_LENGTH = 13;
  var ASCII_A = 65, ASCII_Z = 90;
  var id = "",
      chr,
      numChars;

  // isbn or asin
  if(Math.floor(Math.random()*(2)) == 0){
    // isbn 10 or 13
    if(Math.floor(Math.random()*(2)) == 0){
      numChars = ISBN_LENGTH;
    }else{
      numChars = ISBN13_LENGTH;
    }
    for(numChars; numChars > 0; numChars--){
      chr = Math.floor(Math.random()*(10)).toString();
      id += chr;
    }
  }else{
    numChars = ASIN_LENGTH;
    id += 'B00';
    for(numChars; numChars > 0; numChars--){
      // randomly choose between:
      if(Math.floor(Math.random()*(2)) == 0)
        // a random number from 0 to 9
        chr = Math.floor(Math.random()*(10)).toString();
      else
        // or a random char from A to Z
        chr = String.fromCharCode(Math.floor(
            Math.random()*(ASCII_Z-ASCII_A+1)+ASCII_A));

      id+=chr;
    }
  }
  callback('http://amzn.com/' + id);
}

