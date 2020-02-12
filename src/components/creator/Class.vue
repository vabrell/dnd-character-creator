<template>
<div>
	<h2 class="text-4xl">Class</h2>
	<div class="relative">
		<select v-if="classes.length > 0" v-model="selectedClass" @change="getClassDescription" class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded focus:outline-none focus:bg-white focus:border-gray-500">
			<option disabled hidden selected value="">-- Select class--</option>
			<option v-for="aClass in classes" :key="aClass.name" :value="aClass">{{ aClass.name }}</option>
		</select>
		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
			<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
		</div>
	</div>

	<div v-if="classDescription" class="bg-red-100 shadow shadow-inner p-5">
		<h3 class="text-3xl mb-3">{{ classDescription.name }}</h3>
		<p><b>Hit die:</b> {{ classDescription.hit_die }}</p>
		<p><b>Saving Throws:</b> {{ savingThrows }}</p>
		<p><b>Proficiencies:</b> {{ proficiencies }}</p>
		<p><b>Proficiency Choices</b><br>
			<template v-for="(profs, index) in classDescription.proficiency_choices">
				<div :key="index">
					<p><b>Choose:</b> {{ profLeft(profs) }}</p>
					<template v-for="prof in profs.from">
						<span class="mr-4" :key="prof.name">
						<input type="checkbox" :disabled="profLeft(profs) < 1 && !prof.checked" v-model="prof.checked">
						{{ prof.name }}
						</span>
					</template>
				</div>
			</template>
		</p>
		<p v-if="startingEquipment"><b>Starting Equipment:</b> {{ startingEq }}</p>
		<p v-if="startingEquipment"><b>Starting Equipment Choices</b><br>
			<template v-for="(choices, index) in eqChoices">
				<div :key="index">
					<template v-for="(eqs, ind) in choices">
						<div :key="ind">
							<p><b>Choose:</b> {{ eqLeft(eqs) }}</p>
							<template v-for="eq in eqs.from">
								<span class="mr-4" :key="eq.name">
								<input type="checkbox" :disabled="eqLeft(eqs) < 1 && !eq.checked" v-model="eq.checked">
								{{ eq.item.name }} x{{ eq.quantity }}
								</span>
							</template>
						</div>
					</template>
				</div>
			</template>
		</p>
		<div v-if="spellcasting">
			<h3 class="text-xl my-2">Spellcasting</h3>
			<p><b>Spellcasting Ability:</b> {{ spellcasting.spellcasting_ability.name }}</p>
			<template v-for="(info, index) in spellcasting.info">
				<div :key="index">
					<dt class="font-semibold">{{ info.name }}</dt>
					<dd>
						<p v-for="desc in info.desc" :key="desc">{{ desc }}</p>
					</dd>
				</div>
			</template>
		</div>
	</div>


	<div v-if="classComplete">
		<button @click="nextPart" class="bg-red-500 text-white font-semibold hover:text-red-900 py-2 px-4 rounded">Next</button>
	</div>
</div>
</template>

<script>
export default {
	name: 'Class',
	created() {
		fetch('https://www.dnd5eapi.co/api/classes')
			.then(response => response.json())
			.then(result => {
				this.classes = result.results
			})
	},
	computed: {
		savingThrows() {
			const arr = []
			this.classDescription.saving_throws.forEach(save => {
				arr.push(save.name)
			})
			return arr.join(', ')
		},
		proficiencies() {
			const arr = []
			this.classDescription.proficiencies.forEach(prof => {
				arr.push(prof.name)
			})
			return arr.join(', ')
		},
		startingEq() {
			const arr = []
			this.startingEquipment.starting_equipment.forEach(eq => {
				arr.push(`${eq.item.name} x${eq.quantity}`)
			})
			return arr.join(', ')
		},
		eqChoices() {
			const arr = []
			for (let n = 1; n <= this.startingEquipment.choices_to_make; n++) {
				arr.push(this.startingEquipment[`choice_${n}`])
			}
			return arr
		},
		classComplete() {
			if (!this.selectedClass) return false

			if (!this.startingEquipment) return false

			return true
		}
	},
	data() {
		return {
			classes: [],
			selectedClass: null,
			classDescription: null,
			startingEquipment: null,
			spellcasting: null
		}
	},
	methods: {
		getClassDescription() {
			this.startingEquipment = null
			fetch(`https://www.dnd5eapi.co${this.selectedClass.url}`)
				.then(response => response.json())
				.then(result => {
					this.classDescription = result
					this.getStartingEquipment(result.starting_equipment)
					if (result.spellcasting) {
						this.getSpellcasting(result.spellcasting)
					}
				})
		},
		getStartingEquipment(equipment) {
			fetch(`https://www.dnd5eapi.co${equipment.url}`)
				.then(response => response.json())
				.then(result => {
					this.startingEquipment = result
				})
		},
		getSpellcasting(spellcasting) {
			fetch(`https://www.dnd5eapi.co${spellcasting.url}`)
				.then(response => response.json())
				.then(result => {
					this.spellcasting = result
				})
		},
		profLeft(profs) {
			let count = profs.choose
			profs.from.forEach(prof => {
				if (prof.checked) {
					count--
				}
			})
			return count
		},
		eqLeft(eqs) {
			let count = eqs.choose
			eqs.from.forEach(eq => {
				if (eq.checked) {
					count--
				}
			})
			return count
		},
		nextPart() {
			const selectedClass = {
				sClass: this.selectedClass,
				classDescription: this.classDescription,
				startingEquipment: this.startingEquipment
			}

			this.$emit('set-class', selectedClass)
		}
	}
}
</script>
