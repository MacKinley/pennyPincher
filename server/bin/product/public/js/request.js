function tester(){
	
}

var postProduct = function(){
	//Get the schema from server
	//Append the proper data 
	//POST 
	var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	req.open('GET', 'localhost:3000/product/schema');
	req.onreadstatechange = function(){
		if (req.readState === 4){
			console.log('Word');
		} else {
			console.log('Scrum');
		}
	};
	res.send();
	// req.open('POST', 'localhost:3000/product');
	// req.onreadystatechange = function(){

	// };
	// var json = {

	// }

};