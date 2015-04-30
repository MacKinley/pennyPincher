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
        date : "",
        img : ""
      }
    };

    console.log("requsting url: "+url);
    var timeout = setTimeout(function(){
      console.log('request timed out');
      callback('timeout', null);
    }, 61000);

    request({
      "uri": url,
      "timeout": 60000
    },
    function(err, response, html){
      clearTimeout(timeout);
      if(!err){
        console.log("recieved url: "+url);
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
              productResponse.product.title != null &&
              productResponse.product.price != "" &&
              productResponse.product.price != null &&
              !isNaN(productResponse.product.price) &&
              productResponse.product.asin != "" &&
              productResponse.product.asin != null){
            productResponse.success = true;
          }

          productResponse.product.date = new Date();

          callback(null, productResponse);
        }catch(err){
          console.log('catch block executed');
          callback(err, null);
        }
      }else{
        console.log('request err?');
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

