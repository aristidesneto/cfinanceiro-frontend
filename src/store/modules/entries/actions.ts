// import { useStore } from 'vuex'
import { api } from '../../../config/api'

export default {
  async incomes({ commit }) {
    const res = await api.get('entries', {
      params: {
        type: 'income',
      },
    })
    commit('ENTRIES_SET_INCOME', res.data)
  },
  async exnpenses({ commit }) {
    const res = await api.get('entries', {
      params: {
        type: 'expense',
      },
    })
    commit('ENTRIES_SET_EXPENSE', res.data)
  },
}
