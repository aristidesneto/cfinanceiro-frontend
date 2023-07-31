import { api } from '../../../config/api'
import { alertSuccess } from '../../../config/alert'
import { groupByIncome } from '../../../utils/incomes'

export default {
  // Income
  async incomes({ commit }, { params }) {
    const res = await api.get('entries', {
      params
    })
    commit('ENTRIES_SET_INCOME', res.data)
    commit('ENTRIES_SET_GROUP_INCOME', groupByIncome(res.data.data))
  },
  async incomeByID({ commit }, { id }) {
    const res = await api.get(`entries/${id}`)
    commit('ENTRIES_SET_INCOME_BY_ID', res.data)
  },
  async createIncome({ commit }, { payload }) {
    await api.post('entries', payload)
      .then(res => alertSuccess(res))
  },
  async updateIncome({ commit }, { id, payload }) {
    await api.put(`entries/${id}`, payload)
      .then(res => alertSuccess(res))
  },
  async removeIncome({ commit }, { id }) {
    await api.delete(`entries/${id}`)
      .then(res => alertSuccess(res))
  },
  // Expenses
  async expenses({ commit }, { params }) {
    const res = await api.get('entries', {
      params
    })
    commit('ENTRIES_SET_EXPENSE', res.data)
  },
}
