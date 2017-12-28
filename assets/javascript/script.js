<<<<<<< Updated upstream
$(document).ready(function() {
	var queryURL = "https://api.yelp.com/v3/autocomplete?text=del&latitude=37.786882&longitude=-122.399972";
	$.ajaxSetup({
	    headers: { Authorization: 'Bearer M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx'}
	});
	$.ajax({
		url: queryURL,
		method: "GET",
		// Authorization: "Bearer M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx",
	}).done(function(response){
		console.log(response);
	})
})
=======
/*google maps api key AIzaSyBdGf55gWK40_TYyU6IxgZHmK58FWKHmLM
yelp key M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx


[9: 10]
Authorization: Bearer < YOUR ACCESS TOKEN >*/
 
//google sign in 
//var provider = new firebase.auth.GoogleAuthProvider();
//AIzaSyD7R6PGFTofUCPGdujAByatqDsiu8TxN38
// let key = "AIzaSyD7R6PGFTofUCPGdujAByatqDsiu8TxN38";
// let queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + key;
// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).done(function (response) {
//     console.log(response);
// });

$(window).on("load" , function(){
   
geoFindMe();
    console.log(geoFindMe()); 
   
});

function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    // var img = new Image();
    // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);
    // console.log(latitude);
    // console.log(longitude);
    return {
        latitude: latitude,
        longitude: longitude
    };
}

function geoFindMe() {
    var output = document.getElementById("out");

    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }

    output.innerHTML = "<p>Locating…</p>";

    return navigator.geolocation.getCurrentPosition(success, error);
}

let lat = success();
console.log(latitude);

// var email = document.getElementById('email');

// function checkEmail(email) {

    
//     var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

//     if (!filter.test(email.value)) {
//         alert('Please provide a valid email address');
//         email.focus;
//         return false;
//     }
// }

// $("#submit").on("click", function(event){
//     event.preventDefault();
//     checkEmail(email);
// });


























// //display google map with geolocation
// var map, infoWindow;

// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: {
//             lat: -34.397,
//             lng: 150.644
//         },
//         zoom: 6
//     });
//     infoWindow = new google.maps.InfoWindow;

//     // Try HTML5 geolocation.
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function (position) {
//             var pos = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };

//             infoWindow.setPosition(pos);
//             infoWindow.setContent('Location found.');
//             infoWindow.open(map);
//             map.setCenter(pos);
//         }, function () {
//             handleLocationError(true, infoWindow, map.getCenter());
//         });
//     } else {
//         // Browser doesn't support Geolocation
//         handleLocationError(false, infoWindow, map.getCenter());
//     }
// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(browserHasGeolocation ?
//         'Error: The Geolocation service failed.' :
//         'Error: Your browser doesn\'t support geolocation.');
//     infoWindow.open(map);
// } 
>>>>>>> Stashed changes
