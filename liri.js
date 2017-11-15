
//Require node modules
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

//Declare variables
var choice = process.argv[2];
var usrInput = "";
var client = new Twitter (keys.twitterKeys);
var spotify = new Spotify (keys.spotifyKeys);

//Assign usrInput variable if it exists
if(process.argv[3]){
	for(var i = 3; i < process.argv.length; i++){
		usrInput += process.argv[i] + " ";
	}
}

//Define functions
function getTweets() {
	client.get("search/tweets", {q: "clever_sudonimh", count: "20"}, function(error, tweets, response){
		if(error){
			console.log(error);
		}
		else {
			console.log("Here are my 20 most recent tweets:");
			console.log("------------------------------------");
			tweets.statuses.forEach(function (element){
				console.log(element.text);
				console.log(element.created_at);
				console.log("-----------------");
			});
		}
	});
}

function getSong(song) {
	if(!song){
		song = "Ace of Base";
	}
	spotify
		.search({ type: "track", query: song, limit: "1" })
		.then(function(response){
			response.tracks.items.forEach(function(element){
				console.log("Song Title: " + element.name);
				console.log("Album Title: " + element.album.name);
				console.log("Artist: " + element.album.artists[0].name);
				console.log("Preview URL: " + element.preview_url);
			});
		}) 
		.catch(function(error){
			console.log(error);
		});
}

function getMovie(movie) {

}

function doTheThing() {

}

//Check user choice for which function to run
switch (choice) {
	case "my-tweets":
		getTweets();
		break;
	case "spotify-this-song":
		getSong(usrInput);
		break;
	case "movie-this":
		getMovie(usrInput);
		break;
	case "do-what-it-says":
		doTheThing();
		break;
	default:
		console.log("Please try again with a valid action.");
		break;
}