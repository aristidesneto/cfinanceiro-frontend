import { api } from '@/config/api';
import { alertSuccess } from '@/config/alert';

export default function useEntriesApi(url) {
  const listExpenses = async (params, options = {}) => {
    const data = {
      type: 'expense',
      ...params,
    };
    return await api
      .get(url, { params: data }, options)
      .then((response) => response);
  };

  const createExpense = async (payload, options = {}) => {
    const data = {
      type: 'expense',
      ...payload,
    };
    return await api
      .post(url, data, options)
      .then((response) => alertSuccess(response.data.message));
  };

  return {
    listExpenses,
    createExpense,
  };
}
