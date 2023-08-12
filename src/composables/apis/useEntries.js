import { api } from '@/plugins/api';
import { alertSuccess } from '@/config/alert';

const url = 'entries';

export default function useEntriesApi() {
  const list = async (params, options = {}) => {
    return await api.get(url, { params }, options).then((response) => response);
  };

  const create = async (payload, options = {}) => {
    return await api
      .post(url, payload, options)
      .then((response) => alertSuccess(response.data.message));
  };

  const update = async (id, payload, options = {}) => {
    return await api
      .put(`${url}/${id}`, payload, options)
      .then((response) => alertSuccess(response.data.message));
  };

  const remove = async (id, options = {}) => {
    return await api
      .delete(`${url}/${id}`, options)
      .then((response) => alertSuccess(response.data.message));
  };

  return {
    list,
    create,
    update,
    remove,
  };
}
