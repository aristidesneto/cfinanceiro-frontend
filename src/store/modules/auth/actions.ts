import { api, route_web } from '../../../config/api'

function setData(commit, data) {
  commit('SET_AUTH', true)
  commit('SET_DATA', data.data)
}

export default {
  async onLogin({ commit }, { payload }) {
    await route_web.get('sanctum/csrf-cookie')
    await route_web.post('login', payload)
    const data = await api.get('authenticated/me')
    setData(commit, data)
  },
  async logout({ commit }) {
    await route_web.post('logout')
    commit('SET_AUTH', false)
    commit('SET_DATA', {})
  },
  async me({ commit }) {
    const data = await api.get('authenticated/me')
    setData(commit, data)
  },
}
