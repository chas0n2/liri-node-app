require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var fs = require('fs');
var moment = require('moment');

var input = process.argv[2];
var topic = process.argv.slive(3).join(' ');
console.log('topic: ', topic);



function acceptInput(command) {
    if (command === "concert-this") {
        if (topic === "") {
            concertSearch('Imagine Dragons')
        }
      concertSearch(topic);   
    }else if (command === "spotify-this-song") {
        if (topic === "") {
            spotifySearch('every teardrop is a waterfall, coldplay')
        }else {
            spotifySearch(topic);
        }
    }else if (command === 'movie-this') {
        if (topic === '') {
            movieSearch('Inception')
            console.log('Rent and watch this film, <https://www.imdb.com/title/tt1375666/> \nEven if you have seen it already')
        }else
            movieSearch(topic);
    }else {
        doWhatItSays();
    }
};

acceptInput(input);


function concertSearch(artistName) {
    var bSearch = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp"
    axios.get(bSearch)
    .then(function(response) {
        respond = response.data
        if(respond.length === 0) {
            console.log('There is currently no information')

        }else {
            for (var i = 0; i < respond.length; i++) {
                console.log(respond[i].lineup)
                console.log('Venue: ', respond[i].venue.name) //print and log venue location
                console.log('Location: ', respond[i].venue.city + ', ' + respond[i].venue.region)
                // printing date of the venues/shows
                console.log('Date: ', moment(respond[i].datetime).format('MM/DD/YYYY'));
            }
        }
    })
       .catch(function(error) {
           console.log("There were no events found for Artist");
       });
    }

        function spotifySearch(songTitle) {
            spotify.search({ type: 'track', query: songTitle }, function(err, data) {
                if (err) {
                    return console.log('Error: ' + err);
                }
                //printing artist, song
                console.log('Artist Name: ', data.tracks.items[0].album.artists[0].name)
                console.log("Track Title: ", data.tracks.items[0].name)
                // if statement to show preview if it doesn't have a preview of the song print that its not available
                if (data.tracks.items[0].preview_url === null) {
                    console.log('Preview URL: No preview available for this track')
                } else {
                    console.log('Track Preview: ', data.tracks.items[0].preview_url);
                }
                // also printing album
                console.log('Album: ', data.tracks.items[0].album.name)
            });

        };

        function movieSearch(movieTitle) {
            var movieURL = "https://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy"
            axios.get(movieURL)
            .then(function(response) {
                //movie title
                console.log('Movie Title: ', response.data.Title)
                //movie year released
                console.log('Year Released: ', response.data.Year)
                //IMDB movie ratings
                console.log("IMDB Rating: ", response.data.Ratings[1].Value)
                //This is where the movie was filmed ie country/location
                console.log('Country: ', response.data.Country)
                //Language for Movie
                console.log('Movie Language: ', response.data.Language)
                //plot summary
                console.log("Plot: ", response.data.Plot)
                //Actors/Actresses
                console.log('Actors: ', response.data.Actors)

            }).catch(function(error) {
                console.log(error) // print error for eaach funtion

            });
        };

            function doWhatItSays() {
                fs.readFile('random.txt', 'utf8', function(error, data) {
                    if (error) {
                        return console.log(error)
                    }
                    console.log(data)
                    spotifySearch(data.split(',')[1])
                })
            }