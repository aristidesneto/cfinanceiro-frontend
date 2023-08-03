import { alertSuccess } from '../../../config/alert'
// import { categoriesToSelect } from '../../../utils/categories'
import { api } from '../../../config/api'

export default {
  async categories({ commit }, { payload }) {
    const res = await api.get('categories', {
      params: payload,
    })
    commit('CATEGORIES_SET', res.data.data)
    commit('CATEGORIES_SET_PAGINATE', res.data.meta)
    // commit('CATEGORIES_SET_SELECT', categoriesToSelect(res.data))
  },
  async createCategory({ commit }, { payload }) {
    await api.post('categories', payload)
      .then(res => alertSuccess(res))
  },
  async deleteCategory({ commit }, { id }) {
    await api.delete(`categories/${id}`)
      .then(res => alertSuccess(res))
  },
  async updateCategory({ commit }, { id, payload }) {
    await api.put(`categories/${id}`, payload)
      .then(res => alertSuccess(res))
  },
}
