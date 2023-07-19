import { useStore } from 'vuex'
import axios from '../../../config/api'

export default {
  incomes({ commit }) {
    return new Promise((resolve, reject) => {
      const token = useStore().getters.token
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      axios.get('entries', options)
        .then((response) => {
          if (response.status === 200) {
            commit('ENTRIES_SET_DATA', response.data)
            resolve(response)
          }
        })
        .catch((errors) => {
          reject(errors)
        })
    })
  },
}
