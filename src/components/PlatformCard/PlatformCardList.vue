<template>
	<v-card-text class="pt-0">
		<v-list>
			<v-list-item
				v-for="(categorie, index) in categories"
				:key="index"
				class="px-0"
			>
				<v-list-item-icon>
					<v-icon v-text="categorie.icon" />
				</v-list-item-icon>
				<v-list-item-content v-text="categorie.name" />
				<v-list-item-action class="d-flex justify-center">
					<span v-if="!categorie.loading">
						{{ categorie.data.total }}
					</span>
					<v-progress-circular size="20" v-else indeterminate />
				</v-list-item-action>
			</v-list-item>
		</v-list>
	</v-card-text>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";

@Component({
	name: "PlatformCardList",
	props: ["categories"]
})
export default class PlatformCardList extends Vue {
	@Prop({ required: true }) readonly categories!: ICategory[];
}
</script>
