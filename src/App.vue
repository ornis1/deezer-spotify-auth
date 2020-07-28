<template>
	<v-app>
		<v-main>
			<v-row align-content="center" justify="center" class="fill-height">
				<v-col cols="auto">
					<PlatformCard platformName="spotify" />
				</v-col>
				<v-col cols="1"></v-col>
				<v-col cols="auto">
					<PlatformCard platformName="deezer" />
				</v-col>
			</v-row>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

const querystring = require("querystring");
@Component({
	name: "App",
	components: {
		PlatformCard: () => import("@/components/PlatformCard/PlatformCard.vue")
	}
})
export default class App extends Vue {
	async created() {
		/**
		 *	Проверяем есть ли сохраненные токены в куках
		 * 	Если есть, то сохраняем их в store
		 * */
		const Cookies = await import("js-cookie");
		const platforms = ["spotify", "deezer"] as const;
		for (const platform of platforms) {
			const token: token = Cookies.get(`${platform}Token`);

			if (token === undefined) return;

			const parsedToken: IToken = JSON.parse(token);
			this.$store.dispatch(`${platform}/setToken`, parsedToken);
		}
	}
	@Watch("$route", { immediate: true })
	async handler(newRoute: any) {
		const paths: { [key: string]: string } = {
			spotify: "/callback/spotify",
			deezer: "/callback/deezer"
		};

		const platform = newRoute.path.split("/")[2];

		if (newRoute.path === paths[platform] && newRoute.hash) {
			// Получаем токены из хэша
			const Cookies = await import("js-cookie");
			const { hash } = newRoute;

			// Чистим url от хэша
			history.pushState("", document.title, window.location.pathname);
			const token = querystring.parse(hash.slice(1));

			/**
			 * Сохраняем токены в куки и store
			 */
			Cookies.set(`${platform}Token`, token);
			this.$store.dispatch(`${platform}/setToken`, token);
		}
	}
}
</script>
