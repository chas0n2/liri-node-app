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
    }