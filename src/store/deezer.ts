import { ActionTree, MutationTree, GetterTree } from "vuex";

const state: IDeezerState = {
	accessToken: null
};

const mutations: MutationTree<IDeezerState> = {
	SET_ACCESS_TOKEN(state, payload) {
		state.accessToken = payload;
	}
};
const actions: ActionTree<IDeezerState, IRootState> = {
	setToken({ commit }, payload: IDeezerTokenPayload) {
		if (payload === null) {
			commit("SET_ACCESS_TOKEN", payload);
			return;
		}
		commit("SET_ACCESS_TOKEN", payload.access_token);
	}
};
const getters: GetterTree<IDeezerState, IRootState> = {
	accessToken: state => state.accessToken
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};
