module.exports = function(app) {
	const axios = require("axios");
	const querystring = require("querystring");

	const deezer = {
		app: process.env.DEEZER_APP || "",
		secret: process.env.DEEZER_SECRET || "",
		back: "http://localhost:8888/callback/deezer",
		front: "http://localhost:8080/callback/deezer",
		get codeURL() {
			return `https://connect.deezer.com/oauth/auth.php?app_id=${this.app}&redirect_uri=${this.back}&perms=basic_access,email`;
		},
		tokenURL(code) {
			return `https://connect.deezer.com/oauth/access_token.php?app_id=${this.app}&secret=${this.secret}&code=${code}`;
		},
		endpoint: "https://api.deezer.com"
	};

	app.get("/login/deezer", (req, res) => {
		res.redirect(deezer.codeURL);
	});

	app.get("/callback/deezer", async (req, res) => {
		const code = req.query.code || null;
		const error = req.query.error_reason || null;

		if (error) {
			res.redirect(deezer.front);
			return;
		}

		const response = await axios.get(deezer.tokenURL(code), {});
		const { status, data: access_token } = response;

		if (status === 200 && access_token) {
			res.redirect(deezer.front + "#" + access_token);
			return;
		}

		const tokenString = querystring.stringify({
			error: "invalid_token"
		});
		res.redirect(deezer.front + "#" + tokenString);
	});

	app.get("/api/deezer/user/:slug", async function(req, res) {
		const { access_token = null } = req.query;
		const { slug = "" } = req.params;
		const paths = {
			me: "me",
			playlists: "me/playlists",
			tracks: "me/tracks",
			albums: "me/albums"
		};
		const goodSlugs = Object.keys(paths);
		const isSlugCorrect = goodSlugs.includes(slug);
		const path = paths[slug];

		if (!access_token || !isSlugCorrect) return;
		const result = await axios.get(
			`${deezer.endpoint}/user/${path}?access_token=${access_token}`
		);

		res.status = 200;
		res.contentType("application/json");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.json(result.data);
	});
};
