<template>
<div>
	<h2 class="text-3xl mb-3">{{ race.subrace ? race.subrace.name : race.race.name }} {{ selClass.classDescription.name }}</h2>
	<div class="grid grid-cols-3 gap-4 px-8">
			<div class="flex justify-center items-center">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white mr-1">{{ attributes.str }}</span> STR
			</div>
			<div class="flex justify-center items-center">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white mr-1">{{ attributes.dex }}</span> DEX
			</div>
			<div class="flex justify-center items-center">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white mr-1">{{ attributes.con }}</span> CON
			</div>
			<div class="flex justify-center items-center">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white mr-1">{{ attributes.int }}</span> INT
			</div>
			<div class="flex justify-center items-center">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white mr-1">{{ attributes.wis }}</span> WIS
			</div>
			<div class="flex justify-center items-center">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white mr-1">{{ attributes.cha }}</span> CHA
			</div>
	</div>
	<p class="mt-3"><b>Hit die:</b> d{{ selClass.classDescription.hit_die }}</p>
	<p><b>Saving throws:</b> {{ savingThrows }}</p>
	<p><b>Speed:</b> {{ race.raceDescription.speed }}ft</p>
	<p><b>Size:</b> {{ race.raceDescription.size }}<br>{{ race.raceDescription.size_description }}</p>
	<p><b>Age:</b> {{ race.raceDescription.age }}</p>
	<p><b>Alignment:</b> {{ race.raceDescription.alignment }}</p>
	<p><b>Languages:</b> {{ languages }}</p>
	<p><b>Proficiencies:</b> {{ proficiencies }}</p>
	<p class="mt-2"><b>Starting equipment</b></p>
	<ul>
		<li v-for="item in startEq" :key="item.name">{{ item.name }} x{{ item.quantity }}</li>
	</ul>
	<h3 class="text-2xl py-2">Traits</h3>
	<dl>
	<template v-for="trait in traits">
		<div :key="trait._id">
			<dt class="font-semibold">{{ trait.name }}</dt>
			<dd>{{ trait.desc[0] }}</dd>
		</div>
	</template>
	</dl>
</div>
</template>

<script>
export default {
	name: 'Summary',
	props: {
		attributes: {
			type: Object
		},
		race: {
			type: Object
		},
		selClass: {
			type: Object
		}
	},
	data() {
		return {
			traits: []
		}
	},
	computed: {
		languages() {
			const arr = []
			this.race.raceDescription.languages.forEach(lang => {
				arr.push(lang.name)
			})

			if (this.race.raceDescription.language_options) {
				this.race.raceDescription.language_options.from.forEach(lang => {
					if (lang.checked) {
						arr.push(lang.name)
					}
				})
			}

			if (this.race.subRaceDescription && this.race.subRaceDescription.language_options) {
				this.race.subRaceDescription.language_options.from.forEach(lang => {
					if (lang.checked) {
						arr.push(lang.name)
					}
				})
			}
			return arr.join(', ')
		},
		proficiencies() {
			const arr = []
			this.race.raceDescription.starting_proficiencies.forEach(prof => {
				arr.push(prof.name)
			})

			if (this.race.raceDescription.starting_proficiency_options) {
				this.race.raceDescription.starting_proficiency_options.from.forEach(prof => {
					if (prof.checked) {
						arr.push(prof.name)
					}
				})
			}

			this.selClass.classDescription.proficiencies.forEach(prof => {
				arr.push(prof.name)
			})

			if (this.selClass.classDescription.proficiency_options) {
				this.selClass.classDescription.proficiency_options.forEach(option => {
					option.from.forEach(prof => {
						if (prof.checked) {
							arr.push(prof.name)
						}
					})
				})
			}
			return arr.join(', ')
		},
		savingThrows() {
			const arr = []
			this.selClass.classDescription.saving_throws.forEach(st => {
				arr.push(st.name)
			})
			return arr.join(', ')
		},
		startEq() {
			const arr = []
			this.selClass.startingEquipment.starting_equipment.forEach(eq => {
				arr.push({
					quantity: eq.quantity,
					name: eq.item.name
				})
			})

			for (let n = 1; n <= this.selClass.startingEquipment.choices_to_make; n++) {
				this.selClass.startingEquipment[`choice_${n}`].forEach(eq => {
					eq.from.forEach(item => {
						if (item.checked) {
							arr.push({
								quantity: item.quantity,
								name: item.item.name
							})
						}
					})
				})
			}
			return arr
		}
	},
	created() {
		const promises = []
		this.race.raceDescription.traits.forEach(trait => {
			promises.push(fetch(`https://www.dnd5eapi.co${trait.url}`)
				.then(response => response.json())
				.then(result => {
					this.traits.push(result)
				}))
		})
		Promise.all(promises).then(() => {
			if (this.race.subRaceDescription) {
				this.race.subRaceDescription.racial_traits.forEach(trait => {
					const arr = this.traits.filter((v, i, s) => s.findIndex(v2 => v2.name === trait.name) === i )
					if (arr.length < 1) {
						fetch(`https://www.dnd5eapi.co${trait.url}`)
							.then(response => response.json())
							.then(result => {
								this.traits.push(result)
							})
						}
					})
				}
		})
	}
}
</script>
