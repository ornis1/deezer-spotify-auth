/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

require("dotenv").config();
const express = require("express"); // Express web server framework
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app
	.use(express.static(__dirname + "/public"))
	.use(cors())
	.use(cookieParser());

// Spotify
require("./spotify.js")(app);

// Deezer
require("./deezer.js")(app);

app.listen(8888);
