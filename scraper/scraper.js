var fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

module.exports = {
    scrape: function(url, callback){

        // TODO call json factory to create this
        var productJson = {
            success : false,
            title   : "",
            price   : "",
            rating  : "",
            desc    : [],
            brand   : "",
            inStock : ""
        };
        
        // TODO may throw exception if html doesn't match whats expected
        //      catch and handle accordingly
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                
                // get title
                $('#btAsinTitle').filter(function(){
                    productJson.title = $(this).text();
                })
                
                // get price
                $('#actualPriceValue').filter(function(){
                    var priceDOM = $(this).find('b');
                    // get rid of '$'
                    productJson.price = parseFloat(priceDOM.text().substring(1));
                })
                
                // try in the event that the product has not been rating yet
                try {
                    // get avg rating
                    $('.crAvgStars').first().filter(function(){
                        var custReviewsSpan = $(this);
                        var reviewStarsTitle = custReviewsSpan
                                .children().first()
                                .children().first()
                                .children().first()
                                .attr('title');
                        
                        // get number of stars from title
                        productJson.rating = parseFloat(reviewStarsTitle.substring(0, reviewStarsTitle.indexOf(' ')));
                    })
                } catch(err) {
                    // if product has never been rating
                    productJson.rating = -1;
                }

                // get description
                $('#feature-bullets-atf').filter(function(){
                    var bulletText, desc = [];
                    var bullets = $(this).children().first()
                            .children().first()
                            .children().first()
                            .children().first()
                            .children().first()
                            .children();

                    // get text from each bullet
                    bullets.each(function(i){
                        bulletText = $(this).children().first().text();
                        desc = desc.concat(bulletText);
                    })
                    
                    productJson.desc = desc;
                })

                // get brand
                $('#product-title_feature_div').filter(function(){
                    brand = $(this).children().first().find('span').children().first().text();
                    productJson.brand = brand;
                })
                
                // get stock status
                $('#availability_feature_div').filter(function(){
                    // if class is 'availGreen' its in stock
                    inStock = ($(this).children().first().children().first().attr('class') == 'availGreen');
                    productJson.inStock = inStock;
                })

                // if a title and price were scraped consider it a success
                if(productJson.title != "" && productJson.price != "")
                    productJson.success = true;

                callback(productJson);
            }
        })
    }
};
