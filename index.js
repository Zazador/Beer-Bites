$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "temp",
        authDomain: "getcookin-1f9d5.firebaseapp.com",
        databaseURL: "https://getcookin-1f9d5.firebaseio.com",
        storageBucket: "getcookin-1f9d5.appspot.com",
        messagingSenderId: "temp"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $("#ingredientBox"); //Fields wrapper
    var add_button = $("#plus-sign"); //Add button ID
    var x = 5; //initial text box count
    var index = 0; //index to ensure charts do not overlap
    var emptyIndex = 0; //index to determine number of empty fields in form

    $(add_button).click(function(addField) { //on add input button click
        addField.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $("#ingredientBox").append('<label for="example-text-input" class="col-2 col-form-label">Ingredient ' + x + '</label><div class="col-10"><input class="form-control" type="text" id="ingredient"></div>');
        }
    });

    //listener to begin all usage
    $("#submit").on("click", function() {
        food();
    });

    //listener to handle error box being closed
    $('.alert .close').on('click', function(e) {
        $(this).parent().hide();
        emptyIndex = 0;
    });

    // This function handles pulling in Related Videos
    function videos(title) {
        // Constructing a URL to search YouTube for related videos
        var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + title + "&key=temp" + "maxResults=3&dataType=json";
        // Performing our AJAX GET request
        $.ajax({
                url: queryURL,
                method: "GET",
            })
            // After the data comes back from the API
            .done(function(response) {
                for (var i = 0; i < 3; i++) {
                    $("#vid" + [i]).attr("src", 'https://www.youtube.com/embed/' + response.items[i].id.videoId + '?rel=0&amp;showinfo=0');
                }
            });
    }

    function food() {
        var ingredients = "";
        //Iterate through form to get all ingredients
        $('#ingredientForm *').filter(':input').each(function() {
            if ($(this).val().trim()) {
                ingredients += $(this).val().trim();
                ingredients += ",";
            } else {
                emptyIndex++;
            }
        });

        //Throw error if form is empty. Form validation
        if (emptyIndex >= 8) {
            $('#error').show();
            return;
        }

        // Constructing a URL to search Spoonacular for recipe based off ingredient parameters
        var searchURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + ingredients + "&limitLicense=false&number=1&ranking=2";
        var recipeID = 0;
        // Performing our AJAX GET request
        $.ajax({
                url: searchURL,
                method: "GET",
                headers: {
                    "X-Mashape-Key": "temp",
                    "Accept": "application/json",
                    async: false
                }
            })
            // After the data comes back from the API
            .done(function(response) {
                // Display image from recipe
                if (response[0].image) {
                    $("#recipeImage").attr("src", response[0].image);
                    $("#recipeImage").css("visibility", "visible");
                }
                var title = response[0].title;
                // Make the call to bring in videos
                videos(title);
                recipeID = response[0].id;
                // Make the call to bring in nutrition info
                nutrition(recipeID);
            });
    }

    // Add recipes from Firebase to Recent Searches
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
        var ingTitle = childSnapshot.val().title;
        var ingUrl = childSnapshot.val().url;
        $('#recentSearches > tbody').prepend("<tr><td>" + '<a href="' + ingUrl + '">' + ingTitle + '</a>' + "</td></tr>");
    });

    function nutrition(recipeID) {
        // Constructing a URL to search Spoonacular for recipe based off ingredient parameters
        var recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeID + "/information?includeNutrition=true";
        // Performing our AJAX GET request
        $.ajax({
                url: recipeURL,
                method: "GET",
                headers: {
                    "X-Mashape-Key": "temp",
                    "Accept": "application/json"
                }
            })
            // After the data comes back from the API
            .done(function(response) {
                var recipe = {
                    title: response.title,
                    url: response.sourceUrl
                };

                // Add recipes to Firebase
                database.ref().push(recipe);

                // Add ingredients to Ingredient List
                $("#ingredientList tr").remove();
                for (var i = 0; i < response.extendedIngredients.length; i++) {
                    $('#ingredientList > tbody:last-child').append("<tr><td>" + response.extendedIngredients[i].originalString + "</td></tr>");
                }

                // Grab nutrition information from API
                $("#recipeTitle").html('<a target="_blank" href="' + response.sourceUrl + '">' + response.title + '</a>');
                for (var i = 0; i < response.nutrition.nutrients.length; i++) {
                    if (response.nutrition.nutrients[i].title === "Fat") {
                        var fat = response.nutrition.nutrients[i].amount;
                    } else if (response.nutrition.nutrients[i].title === "Carbohydrates") {
                        var carbohydrates = response.nutrition.nutrients[i].amount;
                    } else if (response.nutrition.nutrients[i].title === "Protein") {
                        var protein = response.nutrition.nutrients[i].amount;
                    }
                }

                // Create chart of nutritional info
                var data = {
                    labels: ["Fat", "Protein", "Carbohydrates"],
                    datasets: [{
                        data: [fat, protein, carbohydrates],
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
                    }]
                };

                if (index >= 1) {
                    $("#chartDiv").html('<canvas height="300" id="myChart" width="300"></canvas>');
                }
                index++;
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

    // Listener to handle Clear button
    $(document).on('click', '#clear', function() {
        $(".form-control").val("");
        $("#ingredientBox").empty();
        event.preventDefault();
        x = 5;
    })
});
