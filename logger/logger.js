// Logger should handle three different scenarios
// Write to the Log File in the Log Directory
// Write to the Console Output 
// Write to the Response Object

var logger = function(){
	var loggerConfig;
	var fs;	//filesystem
	var date = new Date();
	//pass boolean values to determine which outputs to return as JSON
	var dateTime = function(sec, min, hour, day, month, year){
		var currentDateTime = {};
		if (sec)
			currentDateTime.seconds = date.getSeconds();
		if (min)
			currentDateTime.min = date.getMinutes();
		if (hour)
			currentDateTime.hour = date.getHours();
		if (month)
			currentDateTime.month = date.getMonth();
		if (year)
			currentDateTime.year = date.getYear();
		return currentDateTime;
	};

	this.writeToLogFile = function(){

	};
	this.writeToConsole = function(){

	};
	this.writeToResponseObj = function(){

	};

};

exports.logger = new logger();