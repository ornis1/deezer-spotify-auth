/** Modules */
const querystring = require("querystring");
const request = require("request"); // "Request" library
const { default: Axios } = require("axios");

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const spotify = {
	id: process.env.SPOTIFY_ID || "",
	secret: process.env.SPOTIFY_SECRET || "",
	backend: "http://localhost:8888/callback/spotify",
	frontend: "http://localhost:8080/callback/spotify",
	stateKey: "spotify_auth_state"
};

module.exports = function(app) {
	app.get("/login/spotify", function(req, res) {
		const state = generateRandomString(16);
		res.cookie(spotify.stateKey, state);

		// your application requests authorization
		const scope =
			"user-read-private user-read-email user-library-read playlist-read-collaborative";
		res.redirect(
			"https://accounts.spotify.com/authorize?show_dialog=true&" +
				querystring.stringify({
					response_type: "code",
					client_id: spotify.id,
					scope: scope,
					redirect_uri: spotify.backend,
					state: state
				})
		);
	});
	app.get("/callback/spotify", function(req, res) {
		// your application requests refresh and access tokens
		// after checking the state parameter

		const code = req.query.code || null;
		const state = req.query.state || null;
		const storedState = req.cookies ? req.cookies[spotify.stateKey] : null;

		if (state === null || state !== storedState) {
			res.redirect(
				"/#" +
					querystring.stringify({
						error: "state_mismatch"
					})
			);
			return;
		}
		res.clearCookie(spotify.stateKey);
		const authOptions = {
			url: "https://accounts.spotify.com/api/token",
			form: {
				code: code,
				redirect_uri: spotify.backend,
				grant_type: "authorization_code"
			},
			headers: {
				Authorization:
					"Basic " +
					new Buffer(spotify.id + ":" + spotify.secret).toString("base64")
			},
			json: true
		};

		// Запрос на получение access, refresh токенов
		request.post(authOptions, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				const access_token = body.access_token,
					refresh_token = body.refresh_token;

				// we can also pass the token to the browser to make requests from there
				res.redirect(
					spotify.frontend +
						"#" +
						querystring.stringify({
							access_token: access_token,
							refresh_token: refresh_token
						})
				);
				return;
			}
			res.redirect(
				spotify.frontend +
					"#" +
					querystring.stringify({
						error: "invalid_token"
					})
			);
		});
	});

	app.get("/refresh_token/spotify", async function(req, res) {
		// requesting access token from refresh token
		const refresh_token = req.query.refresh_token;
		const Authorization = Buffer.from(spotify.id + ":" + spotify.secret);

		const authOptions = {
			methods: "POST",
			url: "https://accounts.spotify.com/api/token",
			headers: {
				Authorization
			},
			params: {
				grant_type: "refresh_token",
				refresh_token: refresh_token
			}
		};
		// МОГУТ БЫТЬ ОШИБКИ С ЛОГИКОЙ
		const response = await Axios(authOptions);
		const { status, data } = response;
		const { access_token } = data;
		if (status === 200 && access_token) {
			res.send({
				access_token: access_token
			});
		}
		const tokenString = querystring.stringify({
			error: "invalid_refresh_token"
		});
		res.redirect(spotify.front + "#" + tokenString);
	});
};
