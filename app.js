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
	handlebars = config.modules.handlebars,
	index = config.modules.index,
	product = config.modules.product,
	user = config.modules.user,
	socketIO = config.modules.socketIO,
	//logger = config.modules.logger,
	app = express();

app.set(config.render.viewsDirectory.views, config.render.viewsDirectory.dir);
app.set(config.render.viewEngine.viewengine, config.render.viewEngine.engine);

app.use(index);
app.use(product);
app.use(user);

app.use(express.static(path.join(__dirname,'views')));
app.use(function(req, res){
	res.status(config.error.notFound.status);
	res.sendFile(config.error.notFound.result);
});
app.use(function(req, res){
	res.status(config.error.unknown.status);
	res.sendFile(config.error.unknown.result);
});
app.listen(config.listeningPort);
