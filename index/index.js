var express = require('express');
var fs = require('fs');
// var bodyParser = require('body-parser');

// var initialization = require('./public/initialization');

var app = module.exports = express();

app.use(express.static(__dirname +'/../public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// app.get('/initialization', function(req, res){
// 	var commands = initialization.getAPICommands();
// 	return res.json(commands);
// });

// app.post('/initialization/modules', function(req, res){
// 	var requestedModule = req.body;
// 	var requestedResource = requestedModule.resource;
// 	if (typeof requestedResource !== 'undefined'){
// 		if (requestedModule.type === 'stylesheet'){
// 			fs.readFile('./public/stylesheets/modules/'+requestedResource+'.css', function(error, data){
// 				if(error){
// 					console.log(error);
// 				} else {
// 					res.writeHead(200, {'Content-Type':'text/css'});
// 					res.write(data);
// 					res.end();
// 				}
// 			});
// 		} else if (requestedModule.type === 'javascript'){
// 			fs.readFile('./public/javascript/moudules/'+requestedResource+'.js', function(error, data){
// 				if (error){
// 					console.log(error);
// 				} else {
// 					res.writeHead(200, {'Content-Type':'text/javascript'});
// 					res.write(data);
// 					res.end();
// 				}
// 			});
// 		}
// 	}
// });
