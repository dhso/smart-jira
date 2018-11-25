import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/modules/app'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app
  },
  plugins: debug ? [createLogger()] : []
})

export default store
