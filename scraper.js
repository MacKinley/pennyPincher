var fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

module.exports = {
    scrape: function(url, callback){
        var json = {
            success : false,
            title   : "",
            price   : "",
            rating  : "",
            desc    : [],
            brand   : "",
            inStock : ""
        };

        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                
                // get title
                $('#btAsinTitle').filter(function(){
                    json.title = $(this).text();
                })
                
                // get price
                $('#actualPriceValue').filter(function(){
                    var priceDOM = $(this).find('b');
                    // get rid of '$'
                    json.price = parseFloat(priceDOM.text().substring(1));
                })
                
                // get avg rating
                $('.crAvgStars').first().filter(function(){
                    var custReviewsSpan = $(this);
                    var reviewStarsTitle = custReviewsSpan
                            .children().first()
                            .children().first()
                            .children().first()
                            .attr('title');
                    
                    // get number of stars from title
                    json.rating = parseFloat(reviewStarsTitle.substring(0, reviewStarsTitle.indexOf(' ')));
                })
                
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
                    
                    json.desc = desc;
                })

                // get brand
                $('#product-title_feature_div').filter(function(){
                    brand = $(this).children().first().find('span').children().first().text();
                    json.brand = brand;
                })
                
                // get stock status
                $('#availability_feature_div').filter(function(){
                    // if class is 'availGreen' its in stock
                    inStock = ($(this).children().first().children().first().attr('class') == 'availGreen');
                    json.inStock = inStock;
                })

                // if a title and price were scraped consider it a success
                if(json.title != "" && json.price != "")
                    json.success = true;

                callback(json);
            }
        })
    }
};
