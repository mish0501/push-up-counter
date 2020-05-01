import { SET_DONE, WORKOUT_DONE } from '../mutation-types'

let state = {
  setsDone: 0,
  totalDone: 0,

  smoothData: [],
  sensorData: [],
}

let actions = {
  setDone({ commit }, data) {
    commit(SET_DONE, data)
  },

  workoutDone({ commit }, data) {
    commit(WORKOUT_DONE, data)
  },
}

let mutations = {
  [SET_DONE](state, { smoothData, sensorData, count }) {
    state.setsDone += 1

    state.totalDone += count

    state.smoothData = [...state.smoothData, ...smoothData]
    state.sensorData = [...state.sensorData, ...sensorData]
  },

  [WORKOUT_DONE](state, { smoothData, sensorData, count }) {
    state.totalDone += count

    state.smoothData = [...state.smoothData, ...smoothData]
    state.sensorData = [...state.sensorData, ...sensorData]
  },
}

export default { state, actions, mutations, namespaced: true }
