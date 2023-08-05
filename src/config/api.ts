import axios from 'axios'

// const base_url = 'http://fcontrol-api.homelab.com'
const base_url = 'http://localhost:8888'

const api = axios.create({
  baseURL: `${base_url}/api/`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    'Accept': 'application/json',
    // 'X-Requested-With': 'XMLHttpRequest',
    // 'Access-Control-Allow-Origin': '*',
  },
})

const route_web = axios.create({
  baseURL: `${base_url}/`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  },
})

export {
  api,
  route_web,
}
