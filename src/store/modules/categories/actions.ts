import { api } from '../../../config/api'

export default {
  async categories({ commit }, { payload }) {
    const res = await api.get('categories', {
      params: payload,
    })
    commit('CATEGORIES_SET', res.data)
    commit('CATEGORIES_SET_PAGINATE', res.data.meta)
  },
  async createCategory({ commit }, { payload }) {
    await api.post('categories', payload)
  },
  async deleteCategory({ commit }, { id }) {
    await api.delete(`categories/${id}`)
  },
  async updateCategory({ commit }, { id, payload }) {
    await api.put(`categories/${id}`, payload)
  },
}
