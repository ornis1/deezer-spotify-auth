import axios from "axios";

export default class Api {
	private client = axios.create();
	private token: null | string = null;
	private endpoint = "http://localhost:8888";

	constructor(t: null | string = null) {
		this.token = t;

		this.client.interceptors.request.use(config => {
			if (!this.token) {
				return config;
			}

			const newConfig = {
				params: {
					access_token: this.token
				},
				...config
			};

			return newConfig;
		});
	}
	async me(): Promise<User | undefined> {
		try {
			// Получить информацию  пользователе
			// use the access token to access the Spotify Web API
			const { data }: { data: User } = await this.client.get(
				this.endpoint + "/api/deezer/user/me"
			);
			if (data) {
				const { name, link, id } = data;
				return Promise.resolve({ name, link, id });
			}
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	}
	async myPlaylists(): Promise<void> {
		return await this.client.get(this.endpoint + "/api/deezer/user/playlists");
	}
	async myAlbums(): Promise<void> {
		return await this.client.get(this.endpoint + "/api/deezer/user/albums");
	}
	async myTracks(): Promise<void> {
		return await this.client.get(this.endpoint + "/api/deezer/user/tracks");
	}
}
