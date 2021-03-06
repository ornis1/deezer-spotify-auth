import Vue from "vue";
import Vuex from "vuex";
import spotify from "./spotify";
import deezer from "./deezer";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: { spotify, deezer }
});
