import { api } from '@/config/api'
import { alertSuccess } from '@/config/alert'

const url = 'entries'

export default function useEntriesApi() {
  const getExpenses = async (params, options = {}) => {
    const data = {
      type: 'expense',
      ...params,
    }
    return await api.get(url, { params: data }, options)
      .then(response => response)
  }

  return {
    getExpenses,
  }
}
