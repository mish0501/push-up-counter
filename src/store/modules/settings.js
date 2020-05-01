import { SET_SETTINGS } from '../mutation-types'

let state = {
  reps: null,
  sets: null,
  total: null,
  timer: '',
}

let actions = {
  setSettings({ commit }) {
    let settings = JSON.parse(localStorage.getItem('settings')) || ''

    if (settings !== '') {
      commit(SET_SETTINGS, settings)
    }
  },

  saveSettings({ commit }, settings) {
    localStorage.setItem('settings', JSON.stringify(settings))

    commit(SET_SETTINGS, settings)
  },
}

let mutations = {
  [SET_SETTINGS](state, data) {
    Object.assign(state, data)
  },
}

export default { state, actions, mutations, namespaced: true }
