var MongoClient = require('mongodb').MongoClient,
    child = require('child_process');

var productStream;

// Connection URL
var url = 'mongodb://localhost:27017/pennyPincher';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    var collection = db.collection('products');

    // location of scraper here
    // I suppose this doesn't really need to be a child process
    // if its not part of the server but the event listeners below will be
    // turned into callbacks and parameter if statements
    var manager = child.fork('./scraperManager/scraperManager');

    var updatingProduct;

    var getdbStream = function(){
        // get stream of products
        productStream = collection.find().stream();

        // listen for product from stream
        productStream.on("data", function(product){
            // pause stream
            productStream.pause();

            updatingProduct = product;

            console.log(((new Date()).toString())+"got from db: "+updatingProduct.asin);
            updatingProduct.analytics = updatingProduct.analytics.sort(
                function(price1, price2) {
                    return new Date(price1.updated).getTime() -
                            new Date(price2.updated).getTime();
            });

            // tell scraper to update it
            console.log(((new Date()).toString())+"sending to updated asin: "+product.asin);
            manager.send(
                {
                    "type" : "product",
                    "asin" : product.asin
                }
            );
        });

        productStream.on("end", function(){
            console.log(((new Date()).toString())+"end of products stream");
            // start the stream again
            setTimeout(function(){
                console.log(((new Date()).toString())+'starting db stream again');
                getdbStream();
            },360000);
        });
    }

    // listen for messages from scraper
    manager.on('message', function(data){
        var product = data.product;
        console.log(((new Date()).toString())+"got from scraper "+data.type);
        // when we get a product
        if(data.type === 'update'){
            // check if price changed
            if(product.price != updatingProduct.analytics[updatingProduct.analytics.length-1].price){
                console.log(((new Date()).toString())+"adding new price to asin: "+product.asin);
                // if so then add a new price analytic object
                updatingProduct.analytics.push({
                    "date": new Date(product.date),
                    "price": product.price
                });
                updatingProduct.price = product.price;
                updatingProduct.updated = new Date(product.date);
            }else{
                // if not then then check if the previous price was the same
                if(updatingProduct.analytics.length >= 2 && product.price === updatingProduct.analytics[updatingProduct.analytics.length-2].price){
                    // if so then change the date of hte most recent price to now
                    console.log(((new Date()).toString())+"changing latest date of asin: "+product.asin);
                    updatingProduct.analytics[updatingProduct.analytics.length-1].date = new Date(product.date);
                    updatingProduct.updated = new Date(product.date);
                }else{
                    console.log(((new Date()).toString())+"adding duplicate price to asin: "+product.asin);
                    // if not then add the price analytic object
                    updatingProduct.analytics.push({
                        "date": new Date(product.date),
                        "price": product.price
                    });
                    updatingProduct.price = product.price;
                    updatingProduct.updated = new Date(product.date);
                }
            }
            // add updated product to db
            console.log(((new Date()).toString())+"inserting into db asin: "+product.asin);
            collection.update(
                    {"asin": product.asin},
                     updatingProduct 
                    );
            process.nextTick(function(){
                console.log(((new Date()).toString())+"resuming product stream in 30secs");
                // then resume the stream again
                setTimeout(function(){
                    productStream.resume();
                },30000);
            });
        }else if(data.type === 'discover'){
            var product = data.product;
            console.log(((new Date()).toString())+"got product from discover: "+product.asin);
            // check it product exists in db already
            collection.find({"asin":product.asin}).toArray(function(err, result){
              if(result.length == 0){
                  console.log(((new Date()).toString())+"new item: "+product.asin+product.title);
                  // if not insert new product into db
                  collection.insert({
                      "asin": product.asin,
                      "title": product.title,
                      "price": product.price,
                      "image": product.img,
                      "created": new Date(product.date),
                      "updated": new Date(product.date),
                      "analytics": [{
                            "updated":new Date(product.date),
                            "price": product.price
                      }]
                  });
              }
            });
        }else if(data.type === 'updateErr'){
                console.log(((new Date()).toString())+"update Err. resuming product stream");
                // then resume the stream again
                setTimeout(function(){
                    productStream.resume();
                },30000);
        }
    });

    // listen for death of scraper
    manager.on('exit', function(){
        console.log(((new Date()).toString())+"scraper died");
        // respawn it
        manager = child.fork('../scraper/scraper/productManager/productManager');
        console.log(((new Date()).toString())+"scraper reborn");
    });
    getdbStream();
});

/*
process.nextTick(function(){
    while(true){
        setTimeout(function(){
            if(!updating){
                updating = true;
                // get stream of products
                productStream = collection.find().stream();

                // listen for product from stream
                productStream.on("data", function(product){
                    // pause stream
                    productStream.pause();
                    
                    updatingProduct = product;

                    console.log(((new Date()).toString())+"got from db: "+updatingProduct.asin);
                    updatingProduct.analytics = updatingProduct.analytics.sort(
                        function(price1, price2) {
                            return new Date(price1.updated).getTime() -
                                    new Date(price2.updated).getTime();
                    });

                    // tell scraper to update it
                    console.log(((new Date()).toString())+"sending to updated asing: "+product.asin);
                    manager.send(
                        {
                            "type" : "product",
                            "asin" : product.asin
                        }
                    );
                });

                productStream.on("end", function(){
                    console.log(((new Date()).toString())+"end of products stream");
                    // start the stream again
                    updating = false;
                },60000);
            }
        });
    }
});
*/

