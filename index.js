$(document).ready(function(){
	var ingredients;
	console.log("start");


	$("#submit").on("click", function() {
		ingredients = $('#ingredient1').val();
		food(ingredients);
		beer();
	});



	function beer() {

	// Constructing a URL to search BreweryDB for a pairing beer
	var queryURL = "https://api.brewerydb.com/v2/beers?key=5bf8c31d94fdecf7e055c282e92112b1&availableId=1&format=json";

	// Performing our AJAX GET request
	$.ajax({
		url: queryURL,
		method: "GET",
	})
    // After the data comes back from the API
    .done(function(response) {
        // Storing an array of results in the results variable
        var results = response.data;
        //console.log(results);
        var beers = [];
        for (var i=0 ; i < 50 ; i++)
        {
        	if (results[i].foodPairings) {
        		var foodPairing = results[i].foodPairings;
        		console.log(foodPairing);
        		if (foodPairing.toLowerCase().indexOf(ingredients) >= 0) {
        			beers.push(results[i].name);
        			$("#beer").append(results[i].name + "<br/>");
        		}
        	} else {
        		console.log("no food");
        	}
        }
        console.log(beers);
    });
}

function food(ing1) {

	// Constructing a URL to search Edamam for a pairing beer
	var queryURL = "https://api.edamam.com/search?q=" + ing1 + "&app_id=00c0dc61&app_key=815737e5636a521c4eebc08d9bed891e";

	// Performing our AJAX GET request
	$.ajax({
		url: queryURL,
		method: "GET",
	})
    // After the data comes back from the API
    .done(function(response) {
        // Storing an array of results in the results variable
        var results = response.hits;
        console.log(results);

        for (var i=0 ; i < 10 ; i++)
        {
        	if (results[i].recipe.label)
        		$("#recipe").append(results[i].recipe.label + "<br/>");

        }
    });
}

});