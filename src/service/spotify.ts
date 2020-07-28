import axios from "axios";

type response = {
	data: {
		display_name: string;
		name: string;
		id: string | number;
		external_urls: { spotify: string };
	};
};
export default class Api {
	private client = axios.create();
	private token: token = null;

	constructor(t: token = null) {
		this.token = t;
		this.client.interceptors.request.use(config => {
			if (!this.token) {
				return config;
			}
			const newConfig = {
				headers: {},
				...config
			};
			newConfig.headers.Authorization = "Bearer " + this.token;
			return newConfig;
		});
	}
	async me(): Promise<User | undefined> {
		try {
			// Получить информацию  пользователе
			// use the access token to access the Spotify Web API
			const { data }: response = await this.client.get(
				"https://api.spotify.com/v1/me"
			);

			const { display_name: name, id } = data;
			const { spotify: link } = data.external_urls;
			return Promise.resolve({ name, link, id });
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	}
	myPlaylists(): Promise<any> {
		return this.client.get("https://api.spotify.com/v1/me/playlists");
	}
	myAlbums(): Promise<any> {
		return this.client.get("https://api.spotify.com/v1/me/albums");
	}
	myTracks(): Promise<any> {
		return this.client.get("https://api.spotify.com/v1/me/tracks");
	}
}
