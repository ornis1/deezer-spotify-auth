<template>
	<v-card width="300">
		<PlatformCardHeader
			:platform="platform"
			@refresh="loadData"
			:online="online"
		/>
		<PlatformCardStatus :online="online" :user="user" />
		<PlatformCardList :categories="categories" />
		<v-card-actions>
			<v-btn
				:class="['mx-auto', 'white--text']"
				color="red"
				tile
				dark
				:elevation="0"
				:ripple="false"
				@click="handleClick"
				v-text="btnText"
			/>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
interface IPerson {
	name: string;
	age: number;
	money: number;
}

import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component({
	name: "PlatformCard",
	components: {
		PlatformCardHeader: () =>
			import("@/components/PlatformCard/PlatformCardHeader.vue"),
		PlatformCardStatus: () =>
			import("@/components/PlatformCard/PlatformCardStatus.vue"),
		PlatformCardList: () =>
			import("@/components/PlatformCard/PlatformCardList.vue")
	}
})
export default class Card extends Vue {
	@Prop()
	readonly platformName!: string;

	user: User = null;
	platforms: { [key: string]: IPlatform } = {
		spotify: {
			title: "Spotify",
			icon: "mdi-spotify"
		},
		deezer: {
			title: "Deezer",
			icon: `${require("@/assets/deezer-logo.png")}`
		}
	};
	categories: { [key: string]: ICategory } = {
		playlists: {
			name: "Плейлисты",
			icon: "mdi-playlist-music",
			data: [],
			loading: false
		},
		albums: {
			name: "Альбомы",
			icon: "mdi-view-list",
			data: [],
			loading: false
		},
		tracks: {
			name: "Треки",
			icon: "mdi-album",
			data: [],
			loading: false
		}
	};
	get online(): Boolean {
		return !!this.token;
	}

	get token(): string {
		return this.$store.getters[`${this.platformName}/accessToken`];
	}

	get platform(): IPlatform {
		return this.platforms[this.platformName];
	}

	get btnText(): string {
		return this.online ? "Отключиться" : "Подключиться";
	}
	// Methods
	public handleClick(): void {
		this.online ? this.logout() : this.login();
	}

	login(): void {
		window.location.href = `http://localhost:8888/login/${this.platformName}`;
	}

	async logout(): Promise<void> {
		const Cookies = await import("js-cookie");

		Cookies.remove(`${this.platformName}Token`);
		this.$store.dispatch(`${this.platformName}/setToken`, null);

		const keys = Object.keys(this.categories);
		keys.map(key => (this.categories[key].data = []));
	}

	setLoading(): void {
		// Устанавливаем флаги загрузки
		Object.keys(this.categories).map(
			key => (this.categories[key].loading = true)
		);
	}
	async loadData() {
		this.setLoading();
		let res: any = null;

		// Динамический импорт нужного Api
		const { default: Api } = await import(`@/service/${this.platformName}.ts`);
		const api = new Api(this.token);

		// Порядок функций должен быть как в $data.categories
		res = await Promise.all([
			api.myPlaylists(),
			api.myAlbums(),
			api.myTracks()
		]);

		Object.keys(this.categories).map((key, index) => {
			this.categories[key].data = res[index].data;
			this.categories[key].loading = false;
		});
	}
	async loadUser() {
		const { default: Api } = await import(`@/service/${this.platformName}.ts`);
		const api = new Api(this.token);
		this.user = await api.me();
	}

	@Watch("online", { immediate: true })
	async handler(newVal: Boolean) {
		// Если платформа подключена, то делаем запросы на получение данных
		if (newVal) {
			this.loadUser();
			this.loadData();
		}
	}
}
</script>

<style lang="stylus"></style>
