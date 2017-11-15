
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
//Function returns a user's 20 most recent tweets from twitter API
function getTweets() {
	//Uses twitter module to send GET request to twitter API for given user, returns 20 tweets
	client.get("search/tweets", {q: "clever_sudonimh", count: "20"}, function(error, tweets, response){
		//Error handling, like a boss
		if(error){
			console.log(error);
		}
		//Iterates over array of tweets, logging the text and creation date to console
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

//Function pulls song data for a given title from spotify API
function getSong(song) {
	//If no song is provided, use Ace of Base ("The Sign" would not return the right song)
	if(!song){
		song = "Ace of Base";
	}
	//Searches for song title, returning the first match, lists title, artist, album, and preview url
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
		//More boss error handling as exampled in the npm docs
		.catch(function(error){
			console.log(error);
		});
}

//Function uses Request module to pull movie data from OMDB API
function getMovie(movie) {
	//If no movie provided, uses Mr. Nobody
	if(!movie){
		movie = "Mr. Nobody"
	}
	//Variable storing API url
	var queryURL = "http://www.omdbapi.com/?t="+movie+"&apikey=40e9cece";
	//Request sends get request to OMDB api url, returns string
	request(queryURL, function(error, response, body){
		//Parse string to JSON so it's interactable, console log movie data
		var mov = JSON.parse(body);
		console.log("Movie Title: "+mov.Title);
		console.log("Year Released: "+mov.Year);
		console.log("IMDB Rating: "+mov.imdbRating+"/10");
		console.log("Metacritic Rating: "+mov.Metascore+"/100");
		console.log("Produced in: "+mov.Country);
		console.log("Language: "+mov.Language);
		console.log("Plot: "+mov.Plot);
		console.log("Actors: "+mov.Actors);
	});
}

//Function that pulls a command from random.txt, then executes
function doTheThing(choice, usrInput) {
	//Uses FS module to read txt file
	fs.readFile("./random.txt", "utf8", function (err, data){
		//Splits text file into an array
		var arr = data.split(" ");
		//Index 0 will be command
		choice = arr[0];
		//User input will be the rest of the text
		for(var j = 1; j < arr.length; j++){
			usrInput += arr[j] + " ";
		}
		//Calls makeChoice function with inputs from file
		makeChoice(choice, usrInput);
	});

}

//Check user choice for which function to run
function makeChoice(choice, usrInput){
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
			doTheThing(choice, usrInput);
			break;
		default:
			console.log("Please try again with a valid action.");
			break;
	}
}

//Initial call to run makeChoice
makeChoice(choice, usrInput);