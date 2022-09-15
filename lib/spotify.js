import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "playlist-read-private",
  "user-read-private",
  "user-read-email",
  "playlist-read-collaborative",
  "streaming",
  // "user-library-raed",
  "user-top-read",
  "user-follow-read",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-modify-playback-state",
  "user-read-currently-playing",
  // "user-read-currently-played",
  "user-read-recently-played",
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clintId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;
export { LOGIN_URL };
