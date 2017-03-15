$(document).ready(function(){
	var ingredients;


	$("#submit").on("click", function() {
		ingredients = $('#ingredients').val();
		food();
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
        			$("#testp").append(results[i].name + "<br/>");
        		}
        	} else {
        		console.log("no food");
        	}
        }
        console.log(beers);
    });
}

function food() {

	// Constructing a URL to search Edamam for a pairing beer
	var queryURL = "https://api.edamam.com/search?q=" + ingredients + "&app_id=00c0dc61&app_key=815737e5636a521c4eebc08d9bed891e";

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
        		$("#testp").append(results[i].recipe.label + "<br/>");

        }
    });
}

});