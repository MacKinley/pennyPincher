var scrape = require('./scraper').scrape;

module.exports = {
  update: function(asin, callback){
    // TODO maybe give scraper a asin to url function
    scrape("http://amzn.com/"+asin, function(err, product){
      callback(err, product);
    });
  },
};

