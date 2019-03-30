var env = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var name = "";

// get user input
for (var i = 3; i < process.argv.length; i++) {
    name += process.argv[i] + " ";
}
name = name.trim();

// run the app
run();

// does a switch on the command, which runs the proper function if possible
function run() {
    switch (command) {
        case "concert-this":
            findConcert();
            break;
        case "spotify-this-song":
            findSong();
            break;
        case "movie-this":
            findMovie();
            break;
        case "do-what-it-says":
            doIt();
            break;
        default:
            console.log("Sorry, that is not a valid command.");
    }
}

// calls bandsintown api with the command line argument as the artist name
function findConcert() {

    if(name == "") {
        return console.log("Please enter a band to search for concerts.");
    }

    axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp")
        .then(function (response) {

            console.log("Concerts for: " + name);
            for (var i = 0; i < response.data.length; i++) {
                // extracting data based on JSON format
                var data = response.data[i];
                var venue = data.venue;
                var venueName = venue.name;
                var city = venue.city;
                var country = venue.country;
                var date = data.datetime;

                // prints the results
                console.log();
                console.log("Venue: " + venueName);
                console.log("Location: " + city + ", " + country);
                console.log("Date: " + moment(date, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY"));
            }
        });
}

// calls spotify api with the command line argument as the song name
function findSong() {

    // if no name is given, assign a "default" value
    if(name == "") {
        name = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: name }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        
        console.log("Results for: " + name);
        for(var i = 0 ; i < data.tracks.items.length; i++) {
            // extracting information based on the JSON format
            var track = data.tracks.items[i];
            var album = track.album.name;

            var artists = [];
            for(var j = 0; j < track.artists.length; j++) {
                artists.push(track.artists[j].name);
            }

            var song = track.name;

            var link = track.preview_url;

            // prints the results
            console.log()
            console.log("Name: " + song);
            console.log("Artist(s): " + artists.join(", "));
            console.log("Album: " + album);
            console.log("Preview link: " + link);
        }        
    });
}

// calls omdb api with the command line argument as the movie title
function findMovie() {

    // is no movie is given, assign a "default" value
    if(name == "") {
        name = "Mr. Nobody";
    }

    var omdbQueryURL = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";

    axios.get(omdbQueryURL)
        .then(function (response) {
                
            var data = response.data;

            if(data.Response === "True") {
                // extracts and prints results based on JSON format
                console.log("Title: " + data.Title);
                console.log("Year released: " + data.Released.split(" ")[2]);
                console.log("IMDB rating: " + data.imdbRating);

                var rtRating = "";
                data.Ratings.forEach(function (rating) {
                    if(rating.Source == "Rotten Tomatoes") {
                        rtRating = rating.Value;
                    }
                });
                console.log("Rotten Tomatoes rating: " + rtRating);
                console.log("Country produced: " + data.Country);
                console.log("Language: " + data.Language);
                console.log("Plot: " + data.Plot);
                console.log("Actors: " + data.Actors);

            }
            else {
                console.log(data.Error);
            }
            
        });
}

// uses fs to read "random.txt"
function doIt() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }

        // splits command, comma delimited
        command = data.split(",")[0];
        name = data.split(",")[1];

        // runs the command
        run();
    });
}