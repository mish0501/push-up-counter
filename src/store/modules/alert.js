import { SET_ALERT } from '../mutation-types'

let state = {
  type: '',
  text: '',
}

let actions = {
  alert({ commit }, data) {
    commit(SET_ALERT, data)
  },
}

let mutations = {
  [SET_ALERT](state, data) {
    Object.assign(state, data)
  },
}

export default { state, actions, mutations, namespaced: true }
