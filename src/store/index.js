import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		character: {
			attributes: null
		}
  },
  mutations: {
		setAttributes(state, payload) {
			state.character.attributes = payload
		}
  },
  actions: {
  },
  modules: {
  }
})
