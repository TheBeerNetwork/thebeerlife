var yelp = {};
$(document).ready(function () {

    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://floating-dawn-43218.herokuapp.com/' + options.url;
        }
    });

    yelp = {
        params: {
            term: "brewery",
            sort_by: "distance",
            longitude: -117.161084,
            latitude: 32.715738,
            limit: 10
        },

        getBreweries: function (output) {
            var location = $("#location").val();
            $("#location").val('');
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
                output.empty();
                for (var i = 0; i < response.businesses.length; i++) {
                    var distance = parseFloat(response.businesses[i].distance * 0.00062137).toFixed(2)
                    var newBrewery = `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">${response.businesses[i].name}</div>
                            <div class="card-body">
                                <div class="card-title">${response.businesses[i].name}</div>
                                <div class="card-text">
                                    <p>${distance} mi. away</p>

                                   <p>${response.businesses[i].location.display_address.join("<br>")}</p>
                                   <p>Yelp Rating: ${response.businesses[i].rating}</p>
                 
                                  </div>
                            </div>

                            <div class="card-footer">
                                <a href="#more-info-modal" class="btn btn-success more modal_trigger_more" data-id="${response.businesses[i].id}">Click Me For More Info</a>
                            </div>

                        </div>
                    </div>
                    `
                    output.append(newBrewery);
                    $(".modal_trigger_more").leanModal({
                        top: 100,
                        overlay: 0.6,
                        closeButton: ".modal_close"
                    });
                        
                    // getModalInfo()
                 
                }
                // $("#output1").html(JSON.stringify(response));
            })
        },
        getModalInfo: function(id) {
            console.log(id);
            var params = {
                id: id,
            }

            var queryURL = "https://api.yelp.com/v3/businesses/";
            queryURL += params.id;

            $.ajaxSetup({
                headers: { Authorization: 'Bearer M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx' }
            });
            $.ajax({
                url: queryURL,
                method: "GET",
               
            }).done(function (response) {
               
                console.log(response);
                $("#more-info").empty();
                $(".header_title").html(response.name);
                var open = "";
                if (response.hours) {
                    if (response.hours[0].is_open_now && response.hours[0].is_open_now === true) {
                        open = "<p style='color:green'>open</p";
                    } else {
                        open = "<p style='color:red'>closed</p>";
                    }
                }

                
                var name = response.name;
                var modalContent = `
                    
                    <h2>${response.name}</h2>
                    ${open}
               
                `
                $("#more-info").append(modalContent);

           
                   
            })
        }
    }

    $("#get").on("click", function () {
        yelp.getBreweries($("#breweries"));
    });
    $(document).on("click", ".more", function () {
        $(".header_title").html("Loading...")
        $("#more-info").html("Loading...");
        yelp.getModalInfo($(this).data("id"));
    });


})

/*google maps api key AIzaSyBdGf55gWK40_TYyU6IxgZHmK58FWKHmLM
yelp key M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx
<<<<<<< HEAD
*/
 
=======


[9: 10]
Authorization: Bearer < YOUR ACCESS TOKEN >*/

>>>>>>> master
//google sign in 
//var provider = new firebase.auth.GoogleAuthProvider();
//AIzaSyD7R6PGFTofUCPGdujAByatqDsiu8TxN38
// let key = "AIzaSyD7R6PGFTofUCPGdujAByatqDsiu8TxN38";
// let queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + key;

$(window).on("load", function () {

    geoFindMe();
    //console.log(geoFindMe()); 

});

$("#nearme").on("click", geoFindMe);

// Creates a modal for user login
$("#modal_trigger").leanModal({
    top: 100,
    overlay: 0.6,
    closeButton: ".modal_close"
});


$(function () {
    // Calling Login Form
    $("#login_form").click(function () {
        $(".social_login").hide();
        $(".user_login").show();
        return false;
    });
    // Calling Register Form
    $("#register_form").click(function () {
        $(".social_login").hide();
        $(".user_register").show();
        $(".header_title").text('Register');
        return false;
    });
    // Going back to Social Forms
    $(".back_btn").click(function () {
        $(".user_login").hide();
        $(".user_register").hide();
        $(".social_login").show();
        $(".header_title").text('Login');
        return false;
    });
});

function geoFindMe() {
    var output = document.getElementById("out");

    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }
    //Option to get data out of geoFindMe function is to take function success out of the nest.
    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);

        yelp.params.latitude = latitude;
        yelp.params.longitude = longitude;
        //pass in the html element to populate the breweries
<<<<<<< HEAD
        yelp.getBreweries( $("#breweries") );
                
=======
        yelp.getBreweries($("#breweries"));

        //Add function that calls yelp api
>>>>>>> master
        return {
            latitude: latitude,
            longitude: longitude
        };
<<<<<<< HEAD
    }   
    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }
    return navigator.geolocation.getCurrentPosition(success, error);    
} 
=======
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }
    return navigator.geolocation.getCurrentPosition(success, error);

}
>>>>>>> master
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCgDQjadv4eM2WAjcqro9rxdiGdPAhoGV4",
    authDomain: "brewmaster-bcf8f.firebaseapp.com",
    databaseURL: "https://brewmaster-bcf8f.firebaseio.com",
    projectId: "brewmaster-bcf8f",
    storageBucket: "brewmaster-bcf8f.appspot.com",
    messagingSenderId: "1057299715949"
};
firebase.initializeApp(config);

//register new user with email and password including full name
$("#register").on("click", function (e) {
    e.preventDefault();
    let name = $("#name").val().trim();
    let email = $("#mailReg").val().trim();
    let password = $("#passwordReg").val().trim();  
 
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });

});
//login existing user with email and password
$("#login").on("click", function (e) {
    e.preventDefault();
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();
<<<<<<< HEAD
       
=======

>>>>>>> master
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
})
//Real time authentication listener
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log(user);
        console.log("logged in");
    } else {
        console.log("not logged in");
    }
});
//Sign out button for user
$("#signOut").on("click", function () {
    firebase.auth().signOut();
});
//Firebase google login authentication
let provider = new firebase.auth.GoogleAuthProvider();

function googleSignIn() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode);
        // ...
    });
}
//Facebook login authentication

var fbprovider = new firebase.auth.FacebookAuthProvider();

function facebookSignIn(){
    firebase.auth().signInWithPopup(fbprovider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(errorCode);
    });
}
//Google event button
$(".google").on("click", function () {
    googleSignIn();
    console.log("working");
});
//Facebook event button
$(".fb").on("click", function () {
    facebookSignIn();
    console.log("working");
});

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