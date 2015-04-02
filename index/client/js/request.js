window.onload = function(){
	var req = new request();
	var response = req.requestHandler.initialize();
};

var request = function(){

	var xmlHttpRequest;
	var clientAccess;
	var jsonRequest;

	this.requestHandler = (function(){
		var formPayload;
		var jsonPayload;
		var xmlHttpRequest;
		var apiURL = 'http://127.0.0.1:3000';

		var initialized = false;

		var apiCommands = null;

		//{get:[{'/':{'auth':'base','args':'null'}}]}

		var sendGET = function(xmlHandler, api, async, headers){
			xmlHandler.open('get', apiURL+api, async);
			if (typeof(headers) !== 'undefined' && headers !== null){

			}
			xmlHandler.send();
		};

		return{
			initialize : function(){
				if(!initialized){
					xmlHttpRequest = new XMLHttpRequest();
					xmlHttpRequest.onload = function(){
						if(xmlHttpRequest.status === 200){
							apiCommands = JSON.parse(xmlHttpRequest.responseText);
							initialized = true;
							console.log(apiCommands);
							return true;
						} else {
							console.log('initialization failed');
							return false;
						}
					};
					sendGET(xmlHttpRequest, '/product', true);
				}
			},
			getRequest : function(url){
				xmlHttpRequest = new XMLHttpRequest();
				xmlHttpRequest.onload = function(){
					if (xmlHttpRequest.status !== 200){
						//handle 
					} else {
						var response;
						try {
							response = JSON.parse(xmlHttpRequest.responseText);
							return response;
						} catch (e){

						}
					}
					return null;
				};
				xmlHttpRequest.open('get', url, true);
				xmlHttpRequest.send();
			},
			postRequest: function(){

			}
		};
	})();
};