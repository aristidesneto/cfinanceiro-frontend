import { api } from '../../../config/api'

export default {
  async categories({ commit }, { payload }) {
    const res = await api.get('categories', {
      params: {
        type: payload.type,
      },
    })
    commit('CATEGORIES_SET', res.data)
  },
}
