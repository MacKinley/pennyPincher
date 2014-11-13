var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
    // p(roduct)url to scrape
    url = req.param('purl');

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var json = {
                title   : "",
                price   : "",
                rating  : "",
                desc    : [],
                brand   : "",
                inStock : ""
            };
            
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
        }
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
           res.send('\n'+JSON.stringify(json, null, 4)+'\n');
        })
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
