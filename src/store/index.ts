import { createStore } from 'vuex'

import auth from './modules/auth'
import incomes from './modules/incomes'

export default createStore({
  modules: {
    auth,
    incomes,
  },
})
