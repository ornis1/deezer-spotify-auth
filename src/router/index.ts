import VueRouter from "vue-router";
import Vue from "vue";
import App from "@/App.vue";

Vue.use(VueRouter);

export default new VueRouter({
	mode: "history",
	routes: [
		{
			path: "/",
			component: App
		}
	]
});
