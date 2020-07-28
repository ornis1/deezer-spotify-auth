type User =
	| {
			id?: number | string;
			link: String;
			name: String;
	  }
	| null
	| undefined;

type token = string | null | undefined;
type ICategory = {
	[key: string]: any;
	readonly name: string;
	readonly icon: string;
	data: Object[] | null;
	loading: boolean;
};

interface IPlatform {
	readonly title: string;
	readonly icon: string;
}

interface IToken {
	accessToken: string;
	refreshToken?: string;
}

/** Vuex */
interface IDeezerState {
	accessToken: string | null;
}

interface IDeezerTokenPayload {
	access_token?: string | null;
}

interface ISpotifyState {
	accessToken: string | null;
	refreshToken?: string | null;
}

interface ISpotifyTokenPayload {
	access_token?: string | null;
	refresh_token?: string | null;
}

interface IRootState {}
/** Vuex */
