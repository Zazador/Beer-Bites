$(document).ready(function() {
	console.log("start");
	var max_fields = 10; //maximum input boxes allowed
	var wrapper = $("#ingredientBox"); //Fields wrapper
	var add_button = $("#plus-sign"); //Add button ID
	var x = 5; //initlal text box count
	$(add_button).click(function(addField) { //on add input button click
		addField.preventDefault();
		if (x < max_fields) { //max input box allowed
			x++; //text box increment
			$("#ingredientBox").append('<label for="example-text-input" class="col-2 col-form-label">Ingredient ' + x + '</label><div class="col-10"><input class="form-control" type="text" id="ingredient"></div>');
		}
	});
	$("#submit").on("click", function() {
		food();
	});

	function videos(title) {
		// Constructing a URL to search YouTube for related videos
		var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + title + "&key=AIzaSyBqXcI3KIh9b6TZX5uqupoy-I6zT68irDY&" + "maxResults=3&dataType=json";
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
					$("#vid"+[i]).attr("src", 'https://www.youtube.com/embed/' + response.items[i].id.videoId + '?rel=0&amp;showinfo=0');
					//$("#videoReturn").append('<iframe width="300" height="169" src=https://www.youtube.com/embed/' + response.items[i].id.videoId + '?rel=0&amp;showinfo=0 frameborder="0" allowfullscreen></iframe>');
				}
			});
	}

	function food() {
		var ingredients = "";
		//Iterate through form to get all ingredients
		$('#ingredientForm *').filter(':input').each(function() {
			if ($(this).val().trim()) {
				console.log("this.val: " + $(this).val().trim());
				ingredients += $(this).val().trim();
				ingredients += ",";
			}
		});
		// Constructing a URL to search Spoonacular for recipe based off ingredient parameters
		var searchURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + ingredients + "&limitLicense=false&number=1&ranking=1";
		var recipeID = 0;
		// Performing our AJAX GET request
		$.ajax({
				url: searchURL,
				method: "GET",
				headers: {
					"X-Mashape-Key": "d0ELoE2NYemshHsjC4UHoHlfN189p1ce0fZjsnJIIYtwhHJyBm",
					"Accept": "application/json",
					async: false
				}
			})
			// After the data comes back from the API
			.done(function(response) {
				// Storing an array of results in the results variable
				console.log(response);
				if (response[0].image) {
					$("#recipeReturn").append(response[0].title);
					$("#recipeReturn").append('<img src=' + response[0].image + ' height="169" width="300"></img>');
				}
				var title = response[0].title;
				videos(title);
				console.log("ID: " + response[0].id);
				recipeID = response[0].id;
				nutrition(recipeID);
			});
	}

	function nutrition(recipeID) {
		// Constructing a URL to search Spoonacular for recipe based off ingredient parameters
		var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeID + "/information?includeNutrition=true";
		// Performing our AJAX GET request
		$.ajax({
				url: recipeURL,
				method: "GET",
				headers: {
					"X-Mashape-Key": "d0ELoE2NYemshHsjC4UHoHlfN189p1ce0fZjsnJIIYtwhHJyBm",
					"Accept": "application/json"
				}
			})
			// After the data comes back from the API
			.done(function(response) {
				console.log(response);
				// Storing an array of results in the results variable
				$("#recipeReturn").append(response.nutrition.nutrients[0].title + ": " + response.nutrition.nutrients[0].amount);
				for (var i = 0; i < response.nutrition.nutrients.length; i++) {
					if (response.nutrition.nutrients[i].title === "Fat") {
						var fat = response.nutrition.nutrients[i].amount;
					} else if (response.nutrition.nutrients[i].title === "Carbohydrates") {
						var carbohydrates = response.nutrition.nutrients[i].amount;
					} else if (response.nutrition.nutrients[i].title === "Protein") {
						var protein = response.nutrition.nutrients[i].amount;
					}
				}
				var data = {
					labels: ["Fat", "Protein", "Carbohydrates"],
					datasets: [{
						data: [fat, protein, carbohydrates],
						backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
						hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
					}]
				};
				var ctx = document.getElementById("myChart");
				// And for a doughnut chart
				var myDoughnutChart = new Chart(ctx, {
					type: 'doughnut',
					data: data,
					options: {
						animation: {
							animateScale: true
						}
					}
				});
			});
	}
	$(document).on('click', '#clear', function() {
		$("#ingredientBox").empty();
		event.preventDefault();
		x = 5;
	})
});