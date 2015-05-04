//***************************************************************************
// Penny Pincher (2014 - 2015)
// MEAN stack, decoupled alternative for Amazon price analytics 
// Authors: Zachary Moriarty
//          MacKinley Trudeau
//          Venus Ho
//          Erin Fahey
//          Marvin Celestin
//
//  app.js: Initial Node.js server initialization and configuration, routes are
//  handled as separate modules.
//***************************************************************************

var config = require('./appConfig');

var express         = require('express'),
    productRoutes   = require('./product/routes'),
    userRoutes      = require('./user/routes'),
    passport        = require('passport'),
    cors            = require('cors'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    session         = require('express-session');

app = express();

// must maintain order below for passport
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session(
  {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  }
));
app.use(passport.initialize());
app.use(passport.session());

// serve files from public directory
app.use(express.static(config.publicDir));

// enable all CORS request from all origins
// should probably change this for security issues
app.use(cors());

// api routes
app.use(productRoutes);
app.use(userRoutes);

// catches all api routes that don't exist
app.use('/api/*', function(req, res){
  res.status(404);
  res.send(config.notFoundRes);
});

// routes all other requests to front end
app.use('*', function(req, res){
  res.sendFile(config.publicDir + config.frontendApp);
});

// start server
app.listen(config.listeningPort);

console.log('listening on port '+ config.listeningPort);

