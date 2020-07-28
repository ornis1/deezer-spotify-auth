import { ActionTree, MutationTree, GetterTree } from "vuex";

const state: ISpotifyState = {
	accessToken: null,
	refreshToken: null
};

const mutations: MutationTree<ISpotifyState> = {
	SET_ACCESS_TOKEN(state, payload: null | string) {
		state.accessToken = payload;
	},
	SET_REFRESH_TOKEN(state, payload: null | string) {
		state.refreshToken = payload;
	}
};

const actions: ActionTree<ISpotifyState, IRootState> = {
	setToken({ commit }, payload: ISpotifyTokenPayload) {
		if (payload === null) {
			commit("SET_ACCESS_TOKEN", payload);
			commit("SET_REFRESH_TOKEN", payload);
			return;
		}
		commit("SET_ACCESS_TOKEN", payload.access_token);
		commit("SET_REFRESH_TOKEN", payload.refresh_token);
	}
};

const getters: GetterTree<ISpotifyState, IRootState> = {
	accessToken: state => state.accessToken,
	refreshToken: state => state.refreshToken
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};
