var fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

module.exports = {
    scrape: function (url, callback){

    // TODO call json factory to create this
    var productResponse = {
        success : false,
        product : {
            title : "",
            price : "",
            asin : ""
        }
    };

    request(url, function(err, response, html){
        if(!err){
            try{
                var $ = cheerio.load(html);

                // get title
                $('#btAsinTitle').filter(function(){
                    productResponse.product.title = $(this).text();
                })

                // get price
                $('#actualPriceValue').filter(function(){
                    var priceDOM = $(this).find('b');
                    // get rid of '$'
                    productResponse.product.price =
                            parseFloat(priceDOM.text().substring(1));
                })

                // get amznKey
                extractAsin($('link[rel=canonical]').attr('href'), function(asin){
                    productResponse.product.asin = asin;
                });

                // if a title, asin and price were scraped consider it a success
                if(productResponse.product.title != "" &&
                        productResponse.product.price != "" &&
                        productResponse.product.asin != ""){
                    productResponse.success = true;
                }

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
        callback(canonicalUrl.substring(canonicalUrl.lastIndexOf('/') + 1));
}

