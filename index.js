$(document).ready(function(){
	console.log("start");


	$("#submit").on("click", function() {
		ingredients = $('#ingredient1').val();
		food();
		beer();
		console.log("three");
	});



	function beer() {
		console.log("hello");

	// Constructing a URL to search BreweryDB for a pairing beer
	var queryURL = "http://quotes.rest/qod.json";
	console.log("hi");
	// Performing our AJAX GET request
	$.ajax({
		url: queryURL,
		method: "GET",
	})
    // After the data comes back from the API
    .done(function(response) {
    	console.log("response:" + response);
    	var results = response.contents;
    	console.log(results.quotes[0].quote);
    	$("#beer").append(results.quotes[0].quote + "<br/>");
        //$("#recipe").append("<img src=" + results.quotes[0].background + "></img>");
    });
}

function food(ing1) {
	var ingredients = "";

	//Iterate through form to get all ingredients
	$('#ingredientForm *').filter(':input').each(function(){
		if ($(this).val().trim()) {
			console.log("this.val: " + $(this).val().trim());
			ingredients+=$(this).val().trim();
			ingredients+=",";
		}
	});

	// Constructing a URL to search Spponacular for recipe based off ingredient parameters
	var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients="
	+ ingredients + "&limitLicense=false&number=1&ranking=1";

	// Performing our AJAX GET request
	$.ajax({
		url: queryURL,
		method: "GET",
		headers: {"X-Mashape-Key": "d0ELoE2NYemshHsjC4UHoHlfN189p1ce0fZjsnJIIYtwhHJyBm",
		"Accept": "application/json"}
	})
    // After the data comes back from the API
    .done(function(response) {
        // Storing an array of results in the results variable
        console.log(response);
        if (response[0].image)
        	$("#recipe").append("<img src=" + response[0].image+ "></img>");

    });
}

});