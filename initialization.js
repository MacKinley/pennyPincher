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
		case 'index_userConfig':
		return new index_userConfig();
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
	this.listeningPort = '8000';
	this.serverURL = 'https://localhost:'+this.listeningPort;
	this.modules = {	//this should initialize everything in the server
		express: require('express'),
		path: require('path'),
		// logger: require('./logger'),
		index: require('./index'),
		product: require('./product'),
		user: require('./user')
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

var index_userConfig = function() {

	var schemaConfig = {
		modules: {
			mongoose: require('mongoose')
		}
	};
	var userConfig = {
		mongoRoot: 'mongodb://localhost/userTest',
		modules: {
			lodash: require('lodash'),
			promise: require('bluebird'),
			mongoose: require('mongoose'),
			schema: require('./user/schema'),
			products: require('./product/products')
		},
		errors: {
			notFound: 'No Such User',
			asinExists: 'User Already Subscribed To Product',
			asinNotFound: 'User Is Not Subscribed To Product',
			asinSave: 'Failed To Update Subscription',
			asinRemove: 'Failed To Remove Subscription',
			noSuchProduct: 'No Such Product Found',
			deactivate: 'Could Not Deactivate Account',
			reactivate: 'Could Not Reactivate Account'
		}
	};
	this.google = {
		appId: '',
		appSecret: '',
		routing: {
			realm: 'http://localhost:3000',
			returnURL: 'http://localhost:3000/auth/google/return'
		}
	};
	this.facebook = {
		appId: '1594707767440171',
		appSecret: '601dc1eff17354e92929d81ab65523ad',
		routing: {
			appRouter: '/user/authenticate/facebook',
			appCallback: 'http://localhost:3000'+'/auth/facebook/callback',	//This needs to be adaptive
			successRedirect: '',
			failureRedirect: '',
		}, 
		profileFields: [
			'id',
			'username',
			'name',
			'gender',
			'emails',
			'photos'
		]
	};
	this.modules = {
		express: require('express'),
		passport: require('passport'),
		facebook: require('passport-facebook'),
		google: require('passport-google'),
		bodyparser: require('body-parser'),
		promise: require('bluebird'),
		session: require('express-sessions'),
		cookieparser: require('cookie-parser'),
		users: require('./user/users')(userConfig)
	};
};

var index_productConfig = function(){ 

	var productConfig = {
		scraperKey: '1234567890',
		updateThreshold_days: 7,
		mongoRoot: 'mongodb://localhost/productTest',
		documentThreshold: 50,
		// updateThreshold_sec: updateThreshold_days * 86400,
		// updateThreshold_milli: updateThreshold_sec * 1000,
		errors: {
			get: 'Cannot Get Product',
			post_key_error: 'Key Is Not Valid'
		},
		modules: {
			mongoose: require('mongoose'),
			lodash: require('lodash'),
			schema: require('./product/schema'),
			promise: require('bluebird')
		}
	};

	var schemaConfig = {
		details: [{
			timestamp: {type: Date},
			description: {type: String}
		}],

	};

	this.modules = {
		express: require('express'),
		path: require('path'),
		products: require('./product/products')(productConfig),
		mongoose: require('mongoose'),
		stream: require('stream'),
		Promise: require('bluebird'),
		bodyparser: require('body-parser')
		// logger: require(../logger)
	};

};

var mongoConfig = function(){

};
var scraperConfig  = function(){

};

module.exports = getConfiguration;

