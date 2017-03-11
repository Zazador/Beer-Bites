$(document).ready(function(){
	console.log("start");


	$("#submit").on("click", function() {
		food();
	});



	function videos(title) {

	// Constructing a URL to search YouTube for related videos
	var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + title + "&key=AIzaSyBqXcI3KIh9b6TZX5uqupoy-I6zT68irDY&"
	+ "maxResults=3&dataType=json";
	// Performing our AJAX GET request
	$.ajax({
		url: queryURL,
		method: "GET",
	})
    // After the data comes back from the API
    .done(function(response) {
    	console.log("video V");
    	console.log(response);
    	for (var i = 0; i < 3; i++) {
    		$("#recipe").append('<iframe width="560" height="315" src=https://www.youtube.com/embed/' + response.items[i].id.videoId
    			+ '?rel=0&amp;showinfo=0 frameborder="0" allowfullscreen></iframe>');
    	}

    });
}

function food() {
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
        if (response[0].image) {
        	$("#recipe").append("<img src=" + response[0].image+ "></img>");
        }
        var title = response[0].title;
        videos(title);

    });

}

});