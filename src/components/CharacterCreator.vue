<template>
  <div class="container mx-auto">
		<h1 class="text-4xl mb-3">Character Creator</h1>
		<div class="container p-3 mt-5">
			<Attributes @set-attributes="updateAttributes" v-if="$store.state.character.attributes === null"></Attributes>
			<Race @set-race="updateRace" v-if="$store.state.character.attributes !== null && $store.state.character.race === null"></Race>
			<Class @set-class="updateClass" v-if="$store.state.character.race !== null && $store.state.character.class === null"></Class>
			<Summary :attributes="$store.state.character.attributes" :race="$store.state.character.race" :selClass="$store.state.character.class" v-if="$store.state.character.attributes && $store.state.character.race && $store.state.character.class"></Summary>
		</div>
  </div>
</template>

<script>
import Attributes from '@/components/creator/Attributes.vue'
import Race from '@/components/creator/Race.vue'
import Class from '@/components/creator/Class.vue'
import Summary from '@/components/creator/Summary.vue'

export default {
  name: 'CharacterCreator',
	components: {
		Attributes,
		Race,
		Class,
		Summary
	},
	data() {
		return {
			spellcasting: false
		}
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
		},
		updateClass(selectedClass) {
			this.$store.commit('setClass', selectedClass)
			this.spellcasting = selectedClass.spellcasting
		}
	}
}
</script>

<style scoped lang="scss">
</style>
