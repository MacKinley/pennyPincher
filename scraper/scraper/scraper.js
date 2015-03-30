var fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

module.exports = {
  scrape: function (url, callback){

    var productResponse = {
      success : false,
      product : {
        title : "",
        price : "",
        asin : "",
        time : "",
        img : ""
      }
    };

    request(url, function(err, response, html){
      if(!err){
        try{
          var $ = cheerio.load(html);

          // get title
          productResponse.product.title = $('#btAsinTitle').text();

          // get price
          productResponse.product.price =
      parseFloat($('.priceLarge').text().substring(1));

    // get amznKey
    extractAsin($('link[rel=canonical]').attr('href'), function(asin){
      productResponse.product.asin = asin;
    });

    // get img url
    productResponse.product.img = $('#main-image').attr('src');

    // if a title, asin and price were scraped consider it a success
    if(productResponse.product.title != "" &&
        productResponse.product.price != "" &&
        productResponse.product.asin != ""){
          productResponse.success = true;
        }

    productResponse.product.date = (new Date).getTime();

    callback(null, productResponse);
        }catch(err){
          callback(err, null);
        }
      }else{
        callback(err, null);
      }
    });
  }
};

function extractAsin(canonicalUrl, callback){
  if(typeof canonicalUrl !== 'undefined'){
    callback(canonicalUrl.substring(canonicalUrl.lastIndexOf('/') + 1));
  }else{
    callback('');
  }
}
