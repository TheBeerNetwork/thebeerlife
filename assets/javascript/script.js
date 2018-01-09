var breweries;
var yelp = {};

var globalUser = "";

jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://floating-dawn-43218.herokuapp.com/' + options.url;
    }
});

yelp = {
    params: {
        categories: "breweries",
        // terms: "brewery",
        sort_by: "distance",
        limit: 12,
        offset: 0,
    },

    getBreweries: function (output, location) {
        if (location) {
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
                                <a href="#more-info-modal" class="btn btn-success more modal_trigger_more" data-id="${response.businesses[i].id}">More Info</a>
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

                // declare the variables
                var thisBrewery = response.businesses[i]
                var name = "";
                var location = [];
                var distanceInMiles = "Unlisted";
                var phone = "Unlisted";
                var price = "Unlisted";
                var coordinates = [];

                //if the api returns a value, set the variable
                if (thisBrewery.name) {
                    name = thisBrewery.name;
                };
                if (thisBrewery.location) {
                    location = thisBrewery.location;
                };
                if (thisBrewery.distance) {
                    distanceInMiles = parseFloat(thisBrewery.distance * 0.00062137).toFixed(2);
                };
                if (thisBrewery.phone) {
                    phone = thisBrewery.phone;
                };
                if (thisBrewery.price) {
                    price = thisBrewery.price;
                };
                if (thisBrewery.coordinates) {
                    coordinates = thisBrewery.coordinates;
                };

                var ID = thisBrewery.id;
                database.ref("Breweries-Test").once('value', function (snapshot) {
                    if (!snapshot.hasChild(ID)) {
                        database.ref("Breweries-Test").child(ID).set({
                            name: name,
                            location: location,
                            distanceInMiles: distance,
                            phone: phone,
                            price: price,
                            coordinates: coordinates,

                        })
                    } else {
                        // alert("already exists"),
                        database.ref("Breweries-Test").child(ID).update({
                            name: name,
                            location: location,
                            distanceInMiles: distance,
                            phone: phone,
                            price: price,
                            coordinates: coordinates,

                        })
                    };
                }); // end database function

                var queryURL = "https://api.yelp.com/v3/businesses/";
                queryURL += response.businesses[i].id;

                $.ajaxSetup({
                    headers: { Authorization: 'Bearer M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx' }
                });
                $.ajax({
                    url: queryURL,
                    method: "GET",

                }).done(function (response) {
                    var thisBrewery = response;

                    var hours = [];

                    if (thisBrewery.hours) {
                        hours = thisBrewery.hours;
                    }

                    // add it to the database 

                    var ID = thisBrewery.id;

                    database.ref("Breweries-Test").child(ID).update({
                        hours: hours,
                    })

                });

            } //end for loop

            // $("#output1").html(JSON.stringify(response));
        })
    },
}

function reset(output) {
    output.empty();
};

function getModalInfo(id, brewerySnapshot) {
    // empty any old info
    $(".open").empty();
    $(".address").empty();
    $(".distance").empty();
    $(".hours").empty();
    $(".beers").html("<p class='bold'>Top Beers</p>");
    $(".map-modal").empty();
    $(".phone").empty();
    $(".conversation").empty();

    // get the brewery form the last snapshot of firebase
    var thisBrewery = brewerySnapshot[id];
    var name = thisBrewery.name;
    var open = "";
    let phone = thisBrewery.display_phone;
    let lat = thisBrewery.coordinates.latitude;
    let long = thisBrewery.coordinates.longitude;
    let mapDisp = '<div id="map_canvas" style="width:auto; height: 300px;"></div>'

    let myLatlng = { lat, long };

    function initializeMap() {
        var mapOptions = {
            center: new google.maps.LatLng(lat, long),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long)
        });
        marker.setMap(map);
    }


    // if the hours are listed
    if (thisBrewery.hours) {
        if (thisBrewery.hours[0].is_open_now && thisBrewery.hours[0].is_open_now === true) {
            $(".open").append('Open Now').css('color', 'green');
        } else {
            $(".open").append('Closed Now').css('color', 'red');
        };

        var hours = "<p class='bold'>Hours</p>";
        $.each(thisBrewery.hours[0].open, function (key, value) {
            var day;
            switch (value.day) {
            case 0:
                day = "Mon"
                break;
            case 1:
                day = "Tue"
                break;
            case 2:
                day = "Wed"
                break;
            case 3:
                day = "Thu"
                break;
            case 4:
                day = "Fri"
                break;
            case 5:
                day = "Sat"
                break;
            case 6:
                day = "Sun"
                break;
            }
            var start = moment(value.start, 'HHmm').format('h:mm a');
            var end = moment(value.end, 'HHmm').format('h:mm a');
            // nextTrain = moment(train.firstTrainTime, 'HH:mm a').format('hh:mm a') + " (first)";
            hours += day + ": " + start + " - " + end + "<br>";

        })
        $(".open").append(open);
        $(".hours").append(hours);
    }

    if (thisBrewery.beers) {
        var beerlist = $("<ol>");
        $.each(thisBrewery.beers, function (key, value) {
            var beer = $("<li>").append(value);
            $(beerlist).append(beer);
        })
        $(".beers").append(beerlist);
    } else {
        if (loggedIn()) {
            var button = $("<button>").attr("id", "addbeers").attr("data-id", id).append("Add Beers");
            $(".beers").append(button);
        }
    };

    $(".distance").append(thisBrewery.distanceInMiles + " miles");
    $(".header_title").html(name);
    $(".address").append(thisBrewery.location.display_address.join("<br>"));
    $(".phone").append("<a href='tel:" + thisBrewery.phone + "'> Call Us: " + thisBrewery.phone + "</a>");
    $(".map-modal").append(mapDisp);

    // comment box 
    if (loggedIn()) { 
        $(".comments").show();
        var conversation = $(".conversation");

        $.each(thisBrewery.comments, function(key,value) {
            var commentDisplay = $("<div>").addClass("commentDisplay");
            var user = $("<p>").addClass("bold mb-0").html(value.user);
            var comment = $("<p>").addClass("mb-0").html(value.comment);
            $(commentDisplay).append(user);
            if (value.drinking) {
                var drinking = $("<p>").html("drinking: " + value.drinking).addClass("beverage").appendTo(commentDisplay);
            }
            $(commentDisplay).append(comment);

            $(conversation).append(commentDisplay)
        });

    } else {
        $(".comments").hide();
    };

    return initializeMap();


} //getModalInfo

function addComment(id) {
    console.log(id);
    var comment = $("#review").val();
    var drinking = $("#drinking").val();

    database.ref("Breweries-Test").child(id).child("comments").push().set({
        comment: comment,
        drinking: drinking,
        user: globalUser.email
    });
};

// check if the user is logged in
function loggedIn() {
    
    if (globalUser) {
        return true;
    } else {
        return false;
    };
}

function addBeers(id) {
    console.log(id);
    $(".beers").html(`
            <form>
                <input type="text" id="beer1" placeholder="beer1" /><br />
                <input type="text" id="beer2" placeholder="beer2" /><br />
                <input type="text" id="beer3" placeholder="beer3" /><br />
                <input type="text" id="beer4" placeholder="beer4" /><br />
                <input type="text" id="beer5" placeholder="beer5" /><br />
                <button type="submit" id="enterBeers" data-id="${id}"> Add Beers </button>
            </form>

            `)
};

function enterBeers(id) {
    var beers = [];

    for (var i = 1; i < 6; i++) {
        beers.push($("#beer" + i).val());
    }
    database.ref("Breweries-Test").child(id).update({
        beers: beers,
    });
}

// click handlers

// will request access to location again and run the geolocator
$("#nearme").on("click", geoFindMe);

$("#get").on("click", function () {

    $("#breweries").empty();

    var location = $("#location").val();
    console.log(location);
    $("#location").val('');
    yelp.getBreweries($("#breweries"), location);

});

$(document).on("click", ".more", function () {

    var ID = $(this).data("id")
    $(".header_title").html("No info yet, try again in a second")
    $("#more-info-modal").removeAttr("data-id").attr("data-id", ID);

    getModalInfo(ID, breweries);

}).on('shown.bs.modal', function () {
    initializeMap();

});

$(document).on("click", "#addbeers", function () {
    var id = $(this).data("id");

    addBeers(id);

});
$(document).on("click", "#enterBeers", function () {
    event.preventDefault();
    var id = $(this).data("id");

    enterBeers(id);

});

$(document).on("click", "#postComment", function() {
    event.preventDefault();
    var id = $(this).parents("#more-info-modal").data("id");

    addComment(id);
})

/*google maps api key AIzaSyBdGf55gWK40_TYyU6IxgZHmK58FWKHmLM
yelp key M2djzFpkraUvLNT1cCMDJneOf7F9pGpDsVo99sfpwvzTcMUMXYINZUHUpE6HTUlANCezvOW1aMxXFjEptJBzgWblXKSSoxOq8dq6zKEGuO5Zh8KKswol3KK-jZo4WnYx

//google sign in 
//var provider = new firebase.auth.GoogleAuthProvider();
//AIzaSyD7R6PGFTofUCPGdujAByatqDsiu8TxN38
// let key = "AIzaSyD7R6PGFTofUCPGdujAByatqDsiu8TxN38";
// let queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + key;*/

$(window).on("load", function () {
    geoFindMe();
    //console.log(geoFindMe()); 
});

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
        $("#breweries").empty();
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);

        yelp.params.latitude = latitude;
        yelp.params.longitude = longitude;
        //pass in the html element to populate the breweries
        yelp.getBreweries($("#breweries"));

        return {
            latitude: latitude,
            longitude: longitude
        };
    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }
    return navigator.geolocation.getCurrentPosition(success, error);
}
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

var database = firebase.database();

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
        let userID = user.uid;
        //input comment information and send to firebase
        $("#submitComment").on("click", function (e) {
            e.preventDefault();
            let review = $("#review").val();
            let favBeer = $("#favBeer").val();
            let brewName = $("#brewName").val();
            let commentRev = review;
            let commentBeer = favBeer;
            let commentBrew = brewName;

            database.ref("Comments").child(userID).set({
                brewName: commentBrew,
                favBeer: commentBeer,
                review: commentRev,
            });
            $("#comment-modal").hide();
        });
        console.log("logged in");
       
    } else {
        console.log("not logged in");
        // globalUser = firebase.auth().currentUser;
    }
     globalUser = firebase.auth().currentUser;
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

function facebookSignIn() {
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

//comment Btn modal display
$("#commentBtn").leanModal({
    top: 100,
    overlay: 0.6,
    closeButton: ".modal_close",
});

database.ref("Breweries-Test").on("value", function (snapshot) {
    //when the database is changed, update the breweries variable
    breweries = snapshot.val();
    //if the modal is open it has a data-id, which is the brewey id. update the modal info for the current brewery
    if ($("#more-info-modal").attr("data-id")) {
        getModalInfo($("#more-info-modal").attr("data-id"), breweries);
    }
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