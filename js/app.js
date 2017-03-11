$(document).ready(function() {
    //var divClone 		= $("#ingredientBox").clone();
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $("#ingredientBox"); //Fields wrapper
    var add_button      = $("#plus-sign"); //Add button ID
    

    var x = 5; //initlal text box count
    $(add_button).click(function(addField){ //on add input button click
        addField.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            
            $("#ingredientBox").append('<label for="example-text-input" class="col-2 col-form-label">Ingredient ' + x + '</label><div class="col-10"><input class="form-control" type="text" id="ingredient"></div>');
        }
    });

    $(document).on('click','#clear', function() {
    	$("#ingredientBox").empty();
    	console.log("I got clicked");
    	event.preventDefault(); 
    	x=5;


    })
    
    // $("#clear").click(function() { 

    	  
    // 	$("#ingredientBox").replaceWith("hellooo");
    // 	console.log("I got clicked");
    // 	event.preventDefault();


    // });


});

    // $("#clear").click(function() { 

    	  
    // 	$("#ingredientBox").replaceWith("hellooo");
    // 	console.log("I got clicked");
    // 	addField.preventDefault();


    // });