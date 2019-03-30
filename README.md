# liri-node-app

This LIRI (Language Interpretation and Recognition Interface) application is written as a node application.

SETUP:
Create an .env file where the file contents are as follows:
```
SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```
where "your-spotify-id" and "your-spotify-secret" are valid API IDs and secrets, which can be obtained by creating an account (https://developer.spotify.com/dashboard/login). Do not put quotes around your id or secret.

`npm install` must be run prior to running the app to install relevant packages/modules

USAGE:
In your command line environment, run the following: `node liri.js <command> <name>`
<command> can be any of the following four(4): `concert-this`, `spotify-this-song`, `movie-this`, or `do-what-it-says`.
  Any invalid command will inform you of such a command.
  
<name> can be any word/series of words that describe the media/entertainment you are seeking (artist/band, song name, movie title)
  <name> is optional for `spotify-this-song` and `movie-this` as there are default values for these commands.
  <name> is required for `concert-this`, lack of a name will result in an error.
    
`do-what-it-says` runs LIRI based on the text in "random.txt" (adjacent file). Text in this file must be in the form of:
<command>,<name>
  See random.txt for example
  
See APP-DEMO video for examples.
