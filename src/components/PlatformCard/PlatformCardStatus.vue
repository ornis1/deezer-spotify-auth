<template>
	<v-card-text class="pb-0">
		<div class="card__status">
			<span :class="statusClasses">
				<v-icon size="16">
					mdi-circle
				</v-icon>
				{{ statusText }}
			</span>
			<span class="user" v-if="online && user">
				<v-icon>
					mdi-account
				</v-icon>
				<a
					class="user__link"
					target="_blank"
					:href="user.link"
					v-text="user.name"
				/>
			</span>
		</div>
	</v-card-text>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
	name: "PlatformCardStatus"
})
export default class PlatformCardStatus extends Vue {
	@Prop({ default: false })
	private readonly online!: Boolean;

	@Prop({ default: { link: "", name: "" } })
	private readonly user: User;

	// Стили
	get statusClasses(): string {
		return this.online ? "online" : "offline";
	}
	get statusText(): string {
		return this.online ? "Подключено" : "Отключено";
	}
}
</script>

<style lang="stylus" scoped>
.user {
	display block
	white-space nowrap
	overflow hidden
	text-overflow: ellipsis
	vertical-align middle
	&__link {
		text-decoration none
		color white
		&:hover {
			text-decoration underline
		}
	}
}
.card__status {
	display flex
	align-items center
	&>:nth-child(n) {
		flex-basis 50%
	}
}
.online {
	color: green
	& i {
		color: green
	}
}
.offline {
	color: red
	& i {
		color: red
	}
}
</style>
