import { api } from '../../../config/api'

export default {
  async categories({ commit }, { payload }) {
    const res = await api.get('categories', {
      params: payload,
    })
    commit('CATEGORIES_SET', res.data)
  },
}
