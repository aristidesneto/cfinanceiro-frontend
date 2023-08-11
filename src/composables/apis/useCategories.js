import { api } from '@/config/api'
import { alertSuccess } from '@/config/alert'

const url = 'categories'

export default function useCategoryApi() {
  const list = async (params, options = {}) => {
    return await api.get(url, { params }, options)
      .then(response => response)
  }

  const store = async (payload, options = {}) => {
    return await api.post(url, payload, options)
      .then(response => alertSuccess(response.data.message))
  }

  const remove = async (id, options = {}) => {
    return await api.delete(`${url}/${id}`, options)
      .then(response => alertSuccess(response.data.message))
  }

  const update = async (id, payload, options = {}) => {
    return await api.put(`${url}/${id}`, payload, options)
      .then(response => alertSuccess(response.data.message))
  }

  return {
    list,
    store,
    remove,
    update,
  }
}
