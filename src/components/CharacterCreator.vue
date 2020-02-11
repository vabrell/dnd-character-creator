<template>
  <div class="container mx-auto">
		<h1 class="text-4xl mb-3">Character Creator</h1>
		<div class="container p-3 mt-5">
			<Attributes @set-attributes="updateAttributes" v-if="$store.state.character.attributes === null"></Attributes>
			<Race @set-race="updateRace" v-if="$store.state.character.attributes !== null && $store.state.character.race === null"></Race>
			<Class v-if="$store.state.character.race !== null && $store.state.character.class === null"></Class>
		</div>
  </div>
</template>

<script>
import Attributes from '@/components/creator/Attributes.vue'
import Race from '@/components/creator/Race.vue'
import Class from '@/components/creator/Class.vue'

export default {
  name: 'CharacterCreator',
	components: {
		Attributes,
		Race,
		Class
	},
	methods: {
		updateAttributes(attributes) {
			this.$store.commit('setAttributes', attributes)
		},
		updateRace(selectedRace) {
			const attributes = this.$store.state.character.attributes
			selectedRace.raceDescription.ability_bonuses.forEach(ability => {
				attributes[ability.name.toLowerCase()] += ability.bonus
			})
			if(selectedRace.subRaceDescription && selectedRace.subRaceDescription.ability_bonuses) {
				selectedRace.subRaceDescription.ability_bonuses.forEach(ability => {
					attributes[ability.name.toLowerCase()] += ability.bonus
				})
			}
			this.updateAttributes(attributes)

			this.$store.commit('setRace', selectedRace)
		}
	}
}
</script>

<style scoped lang="scss">
</style>
