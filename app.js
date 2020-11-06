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
    .getArtistAlbums(artistID, { limit: 3, offset: 10 })
    .then(data => {
      let albumsFromAPI = data.body.items;
      //console.log(albumsFromAPI)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render("albums", { albums: albumsFromAPI })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/tracks/:id", (req, res) => {
  let albumID = req.params.id;
  spotifyApi
    .getAlbumTracks(albumID, { limit: 5, offset: 1 })
    .then(data => {
      console.log(data.body.items);
      res.render('tracks', { tracks: data.body.items });
    })
    .catch((err) => {
      console.log('Something went wrong!', err);
    })
})
app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
