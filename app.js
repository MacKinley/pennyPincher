//***************************************************************************
// Penny Pincher (2014 - 2015)
// 		A MEAN stack, decoupled alternative for Amazon price analytics 
// Authors: Zachary Moriarty
//          MacKinley Trudeau
//          Venus Ho
//          Erin Fahey 
//          Marvin Celestin
//
//  app.js: Initial Node.js server initialization and configuration, routes are 
//  handled as separate modules.
//***************************************************************************

var buildSettings = 'development production stating'.split(' ');
var settings = buildSettings[0];

var config = require(__dirname+'/initialization')('appConfig');

var express = config.modules.express, 
    path = config.modules.path, 
    client = config.modules.client,
    product = config.modules.product,
    user = config.modules.user,
    //logger = config.modules.logger,
    app = express();

app.use(product);
app.use(user);

// catches all api routes that don't exist
app.use('/api/*', function(req, res){
  res.status(config.error.notFound.status);
  res.send('Not Found');
});

// routes all other requests to front end
app.use(express.static(__dirname +'/public'));
app.use('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(config.listeningPort);

