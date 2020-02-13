<template>
<div ref="spellbook">
	<h2 class="text-3xl py-3">Spellbook</h2>
	<div class="container">
		<input class="w-full text-xl py-2 px-4 border-b-4 border-grey-300 focus:border-red-200" v-model="filter" placeholder="Filter spells...">
	</div>
	<div class="grid grid-cols-3 gap-3 mt-2">
		<div :class="{'col-span-3': !spellDescription}">
			<ul>
				<li class="text-lg hover:bg-red-200 hover:text-red-600 py-1 px-2 rounded my-1" :class="{'bg-red-200': selected(spell.index), 'text-red-600': selected(spell.index)}" v-for="spell in spellList" :key="spell.index"><router-link class="w-full inline-block" :to="`/spellbook/${spell.index}`" @click.native="updateSelectedSpell">{{ spell.name }}</router-link></li>
			</ul>
		</div>
		<div class="col-span-2 pt-2" v-if="spellDescription">
			<h3 class="text-2xl font-semibold mb-2">{{ spellDescription.name }}</h3>
			<p><b>School:</b> {{ spellDescription.school.name }}</p>
			<p><b>Level:</b> {{ spellDescription.level }}</p>
			<p><b>Classes:</b> {{ classes(spellDescription.classes) }}</p>
			<p><b>Range:</b> {{ spellDescription.range }}</p>
			<p><b>Casting time:</b>
				{{ spellDescription.casting_time }}
				<span class="bg-red-500 text-white rounded-full py-1 px-2" v-if="spellDescription.ritual">R</span>
			</p>
			<p><b>Duration:</b>
				{{ spellDescription.duration }}
				<span class="bg-red-500 text-white rounded-full py-1 px-2" v-if="spellDescription.concentration">C</span>
			</p>
			<p><b>Components:</b> {{ spellDescription.components.join(', ') }}</p>
			<p><b>Material:</b> {{ spellDescription.material }}</p>
			<h4 class="text-xl font-semibold">Description</h4>
			<template v-for="(desc, index) in spellDescription.desc">
				<p class="my-2" :key="`desc_${index}`">{{ desc }}</p>
			</template>
			<h4 v-if="spellDescription.higher_level" class="text-xl font-semibold">Higher level</h4>
			<template v-for="(desc, index) in spellDescription.higher_level">
				<p class="my-2" :key="`high_${index}`">{{ desc }}</p>
			</template>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'spell-book',
	created() {
		this.getFilteredSpells()
		
		if (this.$route.params.spell) {
			this.updateSelectedSpell()
		}
	},
	computed: {
		filter: {
			get() {
				return this.$store.state.filter
			},
			set(input) {
				this.$store.commit('setFilter', input)
				this.getFilteredSpells()
			}
		}
	},
	methods: {
		selected(spell) {
			return this.selectedSpell === spell
		},
		updateSelectedSpell() {
			this.selectedSpell = this.$route.params.spell
			window.scrollTo(0, 0)
			fetch(`https://www.dnd5eapi.co/api/spells/${this.selectedSpell}`)
				.then(response => response.json())
				.then(result => {
					this.spellDescription = result
				})
		},
		classes(classes) {
			const arr = []
			classes.forEach(cls => {
				arr.push(cls.name)
			})
			return arr.join(', ')
		},
		getFilteredSpells() {
			let filter = this.$store.state.filter
			filter = filter.replace(' ', '+')
			fetch(`https://www.dnd5eapi.co/api/spells/?name=${filter}`)
				.then(response => response.json())
				.then(result => {
					this.spellList = result.results
				})
		}
	},
	data() {
		return {
			selectedSpell: null,
			spellList: null,
			spellDescription: null
		}
	}
}
</script>
