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

 var database= firebase.database();

$("#submit").on("click" , function(e){
	console.log("working");
	e.preventDefault();
	var name = $("#name").val();
	var location = $("#location").val();
	var website = $("#website").val();
	var beer1 = $("#beer1").val();
	var beer2 = $("#beer2").val();
	var beer3 = $("#beer3").val();
	var beer4 = $("#beer4").val();
	var beer5 = $("#beer5").val();

	var beerRef= database.ref().child("Breweries");

	beerRef.push().set({
		beer1: beer1,
		beer2: beer2,
		beer3: beer3,
		beer4: beer4,
		beer5: beer5,
		location: location,
		name: name,
		website: website,
	})
});
// Mission BreweryXX
// Karl StraussXX
// Mike HessXX
// 32 North BrewingXX
// Intergalactic Brewing
// Saint Archer BreweryXX
// Little Miss BrewingXX
// Second Chance Beer CompanyXX
// Kilowatt Brewing CompanyXX

// Fall Brewing CompanyXXX

// Helms Brewing Co Ocean BeachXX
// North Park Brewing Co.XX

// Culture Brewing CoXXX

// Pizza Port
// Rip Current
// Thorn St Brewery
// Mason Ale Works