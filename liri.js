require("dotenv").config();
//spotify keys for the app
var keys = require("./keys.js");
// Terminal Colors
const chalk = require('chalk');
// Calls to BandsInTown and OMDB
//request for api's//
var request = require('request');
// Date Formatting using moment//
var moment = require('moment');
// creating new spotify clients//
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//object to do operations//
var fs = require('fs');
//using process.argv to make the second argument the command//
let command = process.argv[2];
// media array to write names of movies etc...//
let media_array = process.argv.slice(3);
let media = media_array.join(" ");
//function dothings to check the commands to be used and call function to do this command //  
function doThings(command, media) {
    switch (command) {

        case 'spotify-this-song':
            spotifyThis(media); break;
        case 'movie-this':
            movieThis(media); break;
        case 'concert-this':
            concertThis(media); break;
        case 'do-what-it-says':
            doWhatItSays(); break;
        default:
            console.log("Invalid command. Please type any of the following commands:");
            console.log(chalk.magenta("concert-this,"), chalk.cyan("spotify-this-song,"), chalk.magenta("movie-this,"), chalk.cyan("do-what-it-says"));
    }
}
//spotify function 
function spotifyThis(media) {
    // Default value
    if (media == "") {
        media = "All Star"
    }

    // Search spotify API to search for one song//
    spotify
        .search({ type: 'track', query: media, limit: 1 })
        .then(function (response) {
            var song = response.tracks.items[0];
            //if the song exists then we print it
            if (song != undefined) {
                console.log();
                console.log(chalk.red("==============Song Name:============="));
                console.log(song.name);

                console.log(chalk.red("===========Artist or Artists:=============="));
                for (i = 0; i < song.artists.length; i++) {
                    console.log(song.artists[i].name);
                }

                console.log(chalk.red("============Album================"));
                console.log(song.album.name);
                console.log();
            } else {
                console.log("Can't find this song!")
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}
//function concertThis is search for concerts
function concertThis(media) {
    // Default value
    if (media == "") {
        media = "Brockhampton"
    }
    //requesting a specific artist from api bandsintown
    request("https://rest.bandsintown.com/artists/" + media + "/events?app_id=codingbootcamp", function (error, response, data) {
        try {
            var response = JSON.parse(data)
            //using if statement to know if this response exists then we print results 
            if (response.length != 0) {
                
                console.log(chalk.blue(`Upcoming concerts for ${media} include: `))
                response.forEach(function (element) {
                    console.log(chalk.cyan("Venue name: " + element.venue.name));
                    if (element.venue.country == "United States") {
                        console.log("City: " + element.venue.city + ", " + element.venue.region);
                    } else {
                        console.log("City: " + element.venue.city + ", " + element.venue.country);
                    }
                    console.log("Date: " + moment(element.datetime).format('MM/DD/YYYY'));
                    console.log();
                })
            } else {
                console.log(chalk.red("No concerts found."));
            }
        }
        catch (error) {
            console.log(chalk.red("No concerts found."));
        }
    });
}
   //requesting a specific movie from api omdb 
function movieThis(media) {
    // Default value
    if (media == "") {
        media = "Mr. Nobody"
    }
    //
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + media, function (error, response, data) {
        try {
            var response = JSON.parse(data)
            if (response.Title != undefined) {
                console.log(chalk.red("=============Movie Name============="));
                console.log(response.Title);
                console.log(chalk.red("==============Year=============="));
                console.log(response.Year);
                console.log(chalk.red("===" + response.Ratings[0].Source + " Rating===="));
                console.log(response.Ratings[0].Value);
                // This is in case there's only ratings from one source
                // at time of publication, ex: "Bad Times at the El Royale"
                try {
                    console.log(chalk.red("==========" + response.Ratings[1].Source + " Rating======="));
                    console.log(response.Ratings[1].Value);
                } catch { }
                console.log(chalk.red("=============Country============"));
                console.log(response.Country);
                console.log(chalk.red("===========Language============="));
                console.log(response.Language);
                console.log(chalk.red("=============Plot=============="));
                console.log(response.Plot);
                console.log(chalk.red("================Actors==============="));
                console.log(response.Actors);
                console.log();
            } else {
                console.log(chalk.red("This movie not found."));
            }
        }
        catch (error) {
            console.log(chalk.red("This movie not found."));
        }
    });
}
//here we are searching from txt file and it could be any comment...
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, response) {
        if (err) {
            console.log(err);
        }
        let params = (response.split(','));
        doThings(params[0], params[1]);
    })
}

doThings(command, media);