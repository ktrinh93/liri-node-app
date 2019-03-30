var env = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var name = process.argv.splice(3).join(" ");
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

function logCommands(dataString) {
    var divider = "-------------------------------------------------------------------------------";
    fs.appendFile("log.txt", dataString + divider + "\n\n", function(err) {
        if(err) {
            return console.log(err);
        }
    })
}

// calls bandsintown api with the command line argument as the artist name
function findConcert() {

    if (name == "") {
        return console.log("Please enter a band to search for concerts.");
    }

    axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp")
        .then(function (response) {
            
            var returnString = "Concerts for: " + name + "\n\n";

            for (var i = 0; i < response.data.length; i++) {
                // extracting data based on JSON format
                var data = response.data[i];
                var venue = data.venue;
                var venueName = venue.name;
                var city = venue.city;
                var country = venue.country;
                var date = data.datetime;

                returnString += "Venue: " + venueName + "\n";
                returnString += "Location: " + city + ", " + country + "\n";
                returnString += "Date: " + moment(date, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY") + "\n\n";
            }
            console.log(returnString.trim());
            logCommands(returnString);
        });

}

// calls spotify api with the command line argument as the song name
function findSong() {

    // if no name is given, assign a "default" value
    if (name == "") {
        name = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: name }, function (err, data) {
        if (err) {
            return console.log(err);
        }

        var returnString = "Results for: " + name + "\n\n";

        for (var i = 0; i < data.tracks.items.length; i++) {
            // extracting information based on the JSON format
            var track = data.tracks.items[i];
            var album = track.album.name;

            var artists = [];
            for (var j = 0; j < track.artists.length; j++) {
                artists.push(track.artists[j].name);
            }

            var song = track.name;

            var link = track.preview_url;

            // prints the results
            returnString += "Name: " + song + "\n";
            returnString += "Artist(s): " + artists.join(", ") + "\n";
            returnString += "Album: " + album + "\n";
            returnString += "Preview link: " + link + "\n\n";

        }
        console.log(returnString.trim());
        logCommands(returnString);
    });
}

// calls omdb api with the command line argument as the movie title
function findMovie() {

    // is no movie is given, assign a "default" value
    if (name == "") {
        name = "Mr. Nobody";
    }

    var omdbQueryURL = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";

    axios.get(omdbQueryURL)
        .then(function (response) {

            var data = response.data;

            var returnString = "Results for: " + name + "\n\n";

            if (data.Response === "True") {
                // extracts and prints results based on JSON format
                returnString += "Title: " + data.Title + "\n";
                returnString += "Year released: " + data.Released.split(" ")[2] + "\n";
                returnString += "IMDB rating: " + data.imdbRating + "\n";

                var rtRating = "";
                data.Ratings.forEach(function (rating) {
                    if (rating.Source == "Rotten Tomatoes") {
                        rtRating = rating.Value;
                    }
                });
                returnString += "Rotten Tomatoes rating: " + rtRating + "\n";
                returnString += "Country produced: " + data.Country + "\n";
                returnString += "Language: " + data.Language + "\n";
                returnString += "Plot: " + data.Plot + "\n";
                returnString += "Actors: " + data.Actors + "\n\n";

                console.log(returnString.trim());
                logCommands(returnString);
            }
            else {
                console.log(data.Error);
            }

        });
}

// uses fs to read "random.txt"
function doIt() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        // splits command, comma delimited
        command = data.split(",")[0];
        name = data.split(",")[1];

        // runs the command
        run();
    });
}