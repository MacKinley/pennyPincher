//Server Configuration

this.initialize = function(configType){
	var isInitialized = false;
	this.configTypes = 'development production staging'.split(' ');
	function initialize(configType){
		if (!isInitialized){
			config.configType = configType;

		}
	}
};

var getConfiguration = function(configType){
	switch(configType){
		case 'appConfig':
		return new appConfig();
		case 'index_productConfig':
		return new index_productConfig();
	}
};

this.config = {
	configType: '',
	appConfig: 
	{

	},
	index_mainConfig: 
	{

	}
};

var appConfig = function(){
	function getConfig(configType){
		if (configType === 'development'){

		} if (configType === 'production'){

		} if (configType === 'staging'){

		}
	}


	this.serverName = 'Penny Pincher';
	this.listeningPort = '3000';
	this.socketIOPort = '8000';
	this.serverURL = 'https://localhost:'+this.listeningPort;
	this.modules = {
		express: require('express'),
		path: require('path'),
		handlebars: require('hbs'),
		socketIO: require('socket.io'),
		// logger: require('./bin/logger'),
		index: require('./bin/index'),
		product: require('./bin/product')
	};
	this.render = {
		viewsDirectory:
		{
			views: 'views',
			dir: __dirname+'/views'
		},
		viewEngine:
		{
			viewengine: 'view engine',
			engine: 'html'
		},
		htmlRouting: 
		{
			engine: 'html',
			routing: this.modules.handlebars.__express
		}
	};
	this.error = {
		errorDirectory: __dirname+'/views',
		notFound: 
		{
			status: 400,
			result:  __dirname+'/views/404.html'
		},
		unknown: 
		{
			status: 500,
			result:  __dirname+'/views/500.html'
		}
	};
};

var index_mainConfig = function(){
	var mainConfig = {

	};
};

var indexConfig = function(){
	this.indexURL = __dirname+'/index.html';

	this.modules = {
		express: require('express'),
		// bodyParse: require('body-parser')
	};

};

var loggerConfig = function(){
	this.modules = {
		fs: require('fs')
	};
};

var index_productConfig = function(){

	var productConfig = {
		scraperKey: '1234567890',
		updateThreshold_days: 7,
		updateThreshold_sec: updateThreshold_days * 86400,
		updateThreshold_milli: updateThreshold_sec * 1000,
		errors: {
			get: 'Cannot Get Product',
			post_key_error: 'Key Is Not Valid'
		}
	};

	this.modules = {
		express: require('express'),
		path: require('path'),
		products: require('./public/products')(productConfig),
		mongoose: require('mongoose'),
		// logger: require(../logger)
	};

};

var mongoConfig = function(){

};
var scraperConfig  = function(){

};

module.exports = getConfiguration;