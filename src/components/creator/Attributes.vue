<template>
<div>
	<h2 class="text-3xl">Attributes</h2>
	<div class="grid grid-cols-2 gap-2">
		<div>
			<div class="py-2">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white">{{ attributes.str }}</span> STR
			</div>
			<div class="py-2">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white">{{ attributes.dex }}</span> DEX
			</div>
			<div class="py-2">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white">{{ attributes.con }}</span> CON
			</div>
			<div class="py-2">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white">{{ attributes.int }}</span> INT
			</div>
			<div class="py-2">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white">{{ attributes.wis }}</span> WIS
			</div>
			<div class="py-2">
				<span class="bg-red-400 px-2 py-1 rounded-full text-white">{{ attributes.cha }}</span> CHA
			</div>
		</div>
		<div class="grid grid-rows-2">
			<div>
				<button class="bg-transparent hover:bg-red-500 text-red-600 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded" @click="rollAttributes" :disabled="rolled" :class="{ 'opacity-50': rolled, 'cursor-not-allowed': rolled, 'bg-red-500': rolled, 'text-red-900': rolled, 'hover:text-red-900': rolled }">Generate attributes</button>
			</div>
			<div v-if="rolled">
				<button @click="nextPart" class="bg-red-500 text-white font-semibold hover:text-red-900 py-2 px-4 rounded">Next</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'Attributes',
	data() {
		return {
			attributes: {
				str: 0,
				dex: 0,
				con: 0,
				int: 0,
				wis: 0,
				cha: 0
			},
			rolled: false
		}
	},
	methods: {
		rollAttributes() {
			for (let [key] of Object.entries(this.attributes)) {
				let diceResult = []
				for (let n = 0; n < 4; n++) {
					diceResult.push(Math.floor(Math.random() * 6) + 1)
				}
				diceResult.splice(diceResult.indexOf(Math.min(...diceResult)), 1)
				this.attributes[key] = diceResult.reduce((a,b) => a+b, 0)
			}
			this.rolled = true
		},
		nextPart() {
			this.$emit('set-attributes', this.attributes)
		}
	}
}
</script>
