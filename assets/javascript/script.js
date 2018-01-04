$(document).ready(function () {

    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://floating-dawn-43218.herokuapp.com/' + options.url;
        }
    });

    var yelp = {
	    params: {
	        term: "brewery",
	        sort_by: "distance",
	        longitude: -117.161084,
	        latitude: 32.715738,
	    },

	    getBreweries: function(output) {
	    	var location = $("#location").val();
	    	if (location) {
	    		console.log(location);
	    		this.params.location = location;
	    		this.params.latitude = '';
	    		this.params.longitude = '';
	    	}

		    var queryURL = "https://api.yelp.com/v3/businesses/search";
		    queryURL += '?' + $.param(this.params);
		    $.ajaxSetup({
		        headers: { Authorization: 'Bearer M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx' }
		    });
		    $.ajax({
		        url: queryURL,
		        method: "GET",
		        // Authorization: "Bearer M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx",
		    }).done(function (response) {
		        console.log('cors-anywhere response')
		        console.log(response);
		        for (var i = 0; i < response.businesses.length; i++) {
		        	var newBrewery = $("<div>").addClass("brewery");
		        	var name = $("<h1>").html(response.businesses[i].name);
		        	var distance = $("<p>").html(response.businesses[i].distance);
		        	var address = $("<p>").html(response.businesses[i].location.display_address);
		        	$(newBrewery).append(name).append(distance).append(address);
		        	output.append(newBrewery);
		        }
		        // $("#output1").html(JSON.stringify(response));
		    })

	    }
	}

	$("#get").on("click", function(){
		yelp.getBreweries( $("#output1") );
	});

})