import axios from 'axios';
import handleErrors from '@/config/handleErrors';

const base_url = 'http://localhost:8888';

const api = axios.create({
  baseURL: `${base_url}/api/`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    handleErrors(error.response);
    return Promise.reject(error);
  },
);

const route_web = axios.create({
  baseURL: `${base_url}/`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

export { api, route_web };
