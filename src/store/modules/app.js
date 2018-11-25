const state = {
  loading: {
    state: null
  }
}

const getters = {}

const actions = {
  update_app_title({ commit, state }, title) {
    window.document.title = title
  }
}

const mutations = {
  update_app_loading(state, payload) {
    state.loading = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
