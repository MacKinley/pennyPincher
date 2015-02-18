var updater = require('../productUpdater/productUpdater'),
    discoverer = require('../productDiscoverer/productDiscoverer');

var options = process.argv[2];

discoverer.discoveryLoop(3000, function(err, productResponse, next){
    if(!err) {
        if(productResponse.success === true)
            process.send(
                {
                    "type" : "discover",
                    "product" : productResponse.product
                }
            );
    }else{
        console.error(err);
    }
    next();
});

process.on('message', function(data){
    if(data.type === 'product'){
        updater.update(data.asin, function(err, productResponse){
            if(!err){
                if(productResponse.success === true){
                    process.send(
                        {
                            "type" : "update",
                            "product" : productResponse.product
                        }
                    );
                }else{
                    console.error('Known product with asin '
                            +data.asin+' failed to update');
                }
            }else{
                console.error(err.trace());
            }
        });
    }
});

