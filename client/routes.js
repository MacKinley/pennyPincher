var express = require('express');
var app = module.exports = express();

app.use(express.static(__dirname +'/../public'));

app.get('*', function(req, res){
  res.sendFile(__dirname + '/../public/index.html');
});

