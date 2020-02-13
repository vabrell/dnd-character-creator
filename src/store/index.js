import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		character: {
			attributes: null,
			race: null,
			class: null
		},
		filter: ''
  },
  mutations: {
		setAttributes(state, payload) {
			state.character.attributes = payload
		},
		setRace(state, payload) {
			state.character.race = payload
		},
		setClass(state, payload) {
			state.character.class = payload
		},
		setFilter(state, payload) {
			state.filter = payload
		}
  },
  actions: {
  },
  modules: {
  }
})
