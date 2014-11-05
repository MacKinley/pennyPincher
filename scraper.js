var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

//TODO make some constants or functions to return strings

app.get('/scrape', function(req, res){
    // Let's scrape Anchorman 2
    url = 'http://www.amazon.com/dp/B007JR532M/ref=cm_sw_su_dp';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, price, rating, brand, inStock;
            var desc = [];
            var json = {
                title : "",
                price : "",
                rating : "",
                desc : [],
                brand : "",
                inStock : ""
            };
            
            // get title
            $('#btAsinTitle').filter(function(){
                var data = $(this);
                title = data.text();
                json.title = title;
            })
            
            // get price
            $('#actualPriceValue').filter(function(){
                var data = $(this);
                price = parseFloat(data.find('b').text().substring(1));
                json.price = price;
            })
            
            // get avg rating
            $('.crAvgStars').first().filter(function(){
                var data = $(this);
                data = data.children().first()
                        .children().first()
                        .children().first()
                        .attr('title');
                rating = parseFloat(data.substring(0,data.indexOf(' ')));
                json.rating = rating;
            })
            
            // get description
            $('#feature-bullets-atf').filter(function(){
                var data = $(this);
                var bullets = data.children().first()
                        .children().first()
                        .children().first()
                        .children().first()
                        .children().first()
                        .children();

                bullets.each(function(i){
                    var bulletText = $(this).children().first().text();
                    desc = desc.concat(bulletText);
                })

                json.desc = desc;
            })

            // get brand
            $('#product-title_feature_div').filter(function(){
                var data = $(this);
                brand = data.children().first().find('span').children().first().text();
                json.brand = brand;
            })
            
            // get stock status
            $('#availability_feature_div').filter(function(){
                var data = $(this);
                inStock = (data.children().first().children().first().attr('class') == 'availGreen');
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
