<template>
  <div class="container mx-auto">
		<h1 class="text-4xl mb-3">Character Creator</h1>
		<div class="container p-3 mt-5">
			<Attributes @set-attributes="updateAttributes" v-if="$store.state.character.attributes === null"></Attributes>
		</div>
  </div>
</template>

<script>
import Attributes from '@/components/creator/Attributes.vue'
export default {
  name: 'CharacterCreator',
	components: {
		Attributes
	},
	methods: {
		updateAttributes(attributes) {
			this.$store.commit('setAttributes', attributes)
		}
	}
}
</script>

<style scoped lang="scss">
</style>
