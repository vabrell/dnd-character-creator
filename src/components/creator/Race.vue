<template>
<div>
	<div class="relative">
		<select v-if="races.length > 0" v-model="race" @change="getRaceDescription" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded focus:outline-none focus:bg-white focus:border-gray-500">
			<option disabled hidden selected value="">-- Select race --</option>
			<option v-for="race in races" :key="race.name" :value="race">{{ race.name }}</option>
		</select>
		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
			<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
		</div>
	</div>

	<div v-if="raceDescription" class="bg-red-100 shadow-lg shadow-inner p-5 text-gray-700">
		<h3 class="text-2xl mb-3">{{ subRaceDescription ? subRaceDescription.name : raceDescription.name }}</h3>
		<p class="mb-2" v-if="raceDescription.subraces.length > 0"><b>Subrace:</b>
			<template v-for="subrace in raceDescription.subraces">
				&nbsp;<input type="radio" name="subrace" :key="subrace.name" :value="subrace" v-model="subRace" @change="getSubRace"> {{ subrace.name }}
			</template>
			<br><span v-if="subRaceDescription">{{ subRaceDescription.desc }}</span>
		</p>
		<p><b>Ability Bonus:</b> {{ abilityBonuses }}
		<p><b>Size:</b> {{ raceDescription.size }}<br>{{ raceDescription.size_description }}</p>
		<p><b>Age:</b> {{ raceDescription.age }}</p>
		<p><b>Speed:</b> {{ raceDescription.speed }}ft</p>
		<p><b>Languages:</b> {{ knownLanguages }}<br>{{ raceDescription.language_desc	}}</p>
		<p v-if="raceDescription.language_options">
		<b>Extra languages</b> ({{ langLeft }})
		<br>
			<template v-for="lang in raceDescription.language_options.from">
				<span class="mr-4" :key="lang.name">
				<input type="checkbox" :disabled="langLeft < 1 && !lang.checked" v-model="lang.checked">
				{{ lang.name }}
				</span>
			</template>
		</p>
		<p v-if="subRaceDescription && subRaceDescription.language_options">
		<b>Extra languages</b> ({{ subLangLeft }})
		<br>
			<template v-for="lang in subRaceDescription.language_options.from">
				<span class="mr-4" :key="lang.name">
				<input type="checkbox" :disabled="subLangLeft < 1 && !lang.checked" v-model="lang.checked">
				{{ lang.name }}
				</span>
			</template>
		</p>
		<p><b>Alignment:</b> {{ raceDescription.alignment }}</p>
		<p v-if="startingProficiencies.length > 0"><b>Proficiencies:</b> {{ startingProficiencies }}</p>
		<p v-if="raceDescription.starting_proficiency_options">
		<b>Extra proficiencies</b> ({{ profLeft }})
		<br>
			<template v-for="prof in raceDescription.starting_proficiency_options.from">
				<span class="mr-4" :key="prof.name">
				<input type="checkbox" :disabled="profLeft < 1 && !prof.checked" v-model="prof.checked">
				{{ prof.name }}
				</span>
			</template>
		</p>
		<div v-if="allTraits.length > 0">
			<h4 class="text-xl font-bold my-2">Traits</h4>
			<dl>
				<template v-for="trait in allTraits">
					<div :key="trait._id">
						<dt><b>{{ trait.name }}</b></dt>
					<dd>{{ trait.desc[0] }}</dd>
					</div>
				</template>
			</dl>
		</div>
		<p v-if="raceDescription.trait_options">
		<b>Extra traits</b> ({{ traitLeft }})
		<br>
			<template v-for="trait in raceDescription.trait_options.from">
				<span class="mr-4" :key="trait.name">
				<input type="checkbox" :disabled="traitLeft < 1 && !trait.checked" v-model="trait.checked">
				{{ trait.name }}
				</span>
			</template>
		</p>

	</div>

	<div v-if="raceComplete">
		<button @click="nextPart" class="bg-red-500 text-white font-semibold hover:text-red-900 py-2 px-4 rounded">Next</button>
	</div>
</div>
</template>

<script>
export default {
	name: 'Race',
	created() {
		fetch('https://www.dnd5eapi.co/api/races')
			.then(response => response.json())
			.then(result => {
				this.races = result.results
			})
	},
	computed: {
		abilityBonuses() {
			let arr = []
			this.raceDescription.ability_bonuses.forEach(ability => {
				arr.push(`${ability.name} +${ability.bonus}`)
			})
			if (this.subRaceDescription) {
				this.subRaceDescription.ability_bonuses.forEach(ability => {
					arr.push(`${ability.name} +${ability.bonus}`)
				})
			}
			return arr.join(', ')
		},
		knownLanguages() {
			let arr = []
			this.raceDescription.languages.forEach(lang => {
				arr.push(lang.name)
			})
			if (this.raceDescription.language_options) {
				this.raceDescription.language_options.from.forEach(lang => {
					if (lang.checked) {
						arr.push(lang.name)
					}
				})
			}
			if (this.subRaceDescription && this.subRaceDescription.language_options) {
				this.subRaceDescription.language_options.from.forEach(lang => {
					if (lang.checked) {
						arr.push(lang.name)
					}
				})
			}
			return arr.join(', ')
		},
		startingProficiencies() {
			let arr = []
			this.raceDescription.starting_proficiencies.forEach(prof => {
				arr.push(prof.name)
			})
			if (this.raceDescription.starting_proficiency_options) {
				this.raceDescription.starting_proficiency_options.from.forEach(prof => {
					if (prof.checked) {
						arr.push(prof.name)
					}
				})
			}
			return arr.join(', ')
		},
		langLeft() {
			let count = this.raceDescription.language_options.choose
			this.raceDescription.language_options.from.forEach(lang => {
				if (lang.checked) {
					count--
					if (count < 1) {
						return count
					}
				}
			})
			return count
		},
		subLangLeft() {
			let count = this.subRaceDescription.language_options.choose
			this.subRaceDescription.language_options.from.forEach(lang => {
				if (lang.checked) {
					count--
					if (count < 1) {
						return count
					}
				}
			})
			return count
		},
		profLeft() {
			let count = this.raceDescription.starting_proficiency_options.choose
			this.raceDescription.starting_proficiency_options.from.forEach(prof => {
				if (prof.checked) {
					count--
					if (count < 1) {
						return count
					}
				}
			})
			return count
		},
		traitLeft() {
			let count = this.raceDescription.trait_options.choose
			this.raceDescription.trait_options.from.forEach(trait => {
				if (trait.checked) {
					count--
					if (count < 1) {
						return count
					}
				}
			})
			return count
		},
		raceComplete() {
			if (!this.raceDescription) return false

			if (this.raceDescription.starting_proficiency_options) {
				if (this.profLeft > 0) return false
			}

			if (this.raceDescription.language_options) {
				if (this.langLeft > 0) return false
			}

			if (this.raceDescription.trait_options) {
				if (this.traitLeft > 0) return false
			}
			
			if (this.raceDescription.subraces.length > 0 && !this.subRaceDescription) return false

			if (this.raceDescription.subraces.length > 0 && this.subRaceDescription) {
				if (this.subRaceDescription.language_options) {
					if (this.subLangLeft > 0) return false
				}
			}

			return true
		}
	},
	data() {
		return {
			races: [],
			race: '',
			raceDescription: null,
			subRace: null,
			subRaceDescription: null,
			allTraits: []
		}
	},
	methods: {
		getRaceDescription() {
			this.subRace = null
			this.subRaceDescription = null
			this.allTraits = []
			fetch(`https://www.dnd5eapi.co${this.race.url}`)
				.then(response => response.json())
				.then(result => {
					this.raceDescription = result
					this.getTraitDescription(result.traits)
				})
		},
		getSubRace() {
			fetch(`https://www.dnd5eapi.co${this.subRace.url}`)
				.then(response => response.json())
				.then(result => {
					this.subRaceDescription = result
					if (result.racial_traits.length > 0) {
						this.getTraitDescription(result.racial_traits)
					}
				})
		},
		getTraitDescription(traits) {
			traits.forEach(trait => {
				fetch(`https://www.dnd5eapi.co${trait.url}`)
					.then(response => response.json())
					.then(result => {
						this.allTraits.push(result)
					})
			})
		},
		nextPart() {
			const selectedRace = {
				race: this.race,
				raceDescription: this.raceDescription,
				subrace: this.subRace,
				subRaceDescription: this.subRaceDescription
			}
			
			this.$emit('set-race', selectedRace)
		}
	}
}
</script>
