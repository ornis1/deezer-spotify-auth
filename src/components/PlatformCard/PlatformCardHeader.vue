<template>
	<v-card-title>
		<v-img
			v-if="isDeezer"
			:src="platform.icon"
			height="36"
			max-width="52"
			contain
			class="mr-4"
		/>
		<v-icon v-else large v-html="platform.icon" class="mr-4" />
		<span v-text="platform.title" />
		<v-spacer></v-spacer>
		<v-btn @click="handleClick" icon v-if="online">
			<v-icon>mdi-refresh</v-icon>
		</v-btn>
	</v-card-title>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";

@Component({
	name: "PlatformCardHeader"
})
export default class PlatformCardHeader extends Vue {
	@Prop({
		default: {
			title: "",
			icon: ""
		}
	})
	private readonly platform!: IPlatform;

	@Prop({ default: false })
	readonly online!: Boolean;

	get isDeezer(): Boolean {
		return this.platform?.title?.toLowerCase() === "deezer";
	}

	@Emit("refresh")
	handleClick() {}
}
</script>
