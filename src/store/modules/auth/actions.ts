import axios from '../../../config/api'

export default {
  login({ commit }, { payload }) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
      axios.post('token', payload, options)
        .then((response) => {
          if (response.status === 200) {
            commit('SET_DATA', response.data)
            commit('SET_AUTH', true)
            resolve(response)
          }
        })
        .catch((errors) => {
          reject(errors)
        })
    })
  },
}
