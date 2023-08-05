import { api } from '../../../config/api'

export default {
  async creditCards({ commit }, { params }) {
    const res = await api.get('credit-cards', {
      params,
    })
    commit('CREDITCARDS_SET', res.data)
  },
}
