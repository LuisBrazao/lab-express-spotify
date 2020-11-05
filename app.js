require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    
// Our routes go here:
app.get("/", (req, res) => {
    res.render("home")
})


app.get("/artist-search", (req, res) => {
    spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
      let artist = data.body.artists.items[0];
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    
    res.render("artist-search-results", artist)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res) => {
    let artistID = req.params.id;
    spotifyApi
    .getArtistAlbums(artistID, {limit: 3})
    .then(data => {
      let albumsFromAPI = data.body.items;
      //console.log(albumsFromAPI)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      
      res.render("albums", {albums: albumsFromAPI})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  })

  app.get("/tracks/:id", (req, res) => {
    let albumID = req.params.id;
    spotifyApi
    .getAlbumTracks(albumID)
    .then(data => {
      //console.log(data.body)
      spotifyApi
        .getTrack('4xkOaSrkexMciUUogZKVTS')
        .then(data => {
            console.log(data.body)
        })
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      
      res.render("home")
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
