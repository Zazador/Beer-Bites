var express = require('express'); 
var request = require('request'); 
var app = express();

app.get('/api', function(req, res){ 
	request('https://api.brewerydb.com/v2/beers?key=' + "5bf8c31d94fdecf7e055c282e92112b1" + "&availableId=1&format=json", function (error, response, body) { 
		if (!error && response.statusCode === 200) { 
			console.log("hi");
			console.log(body); 
			res.send(body); 
		} else {
			console.log("uh oh");
		} 
	}); 
});

app.listen(3000); 
console.log('Server running on port %d', 3000);