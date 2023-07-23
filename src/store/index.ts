import { createStore } from 'vuex'

import auth from './modules/auth'
import incomes from './modules/entries'
import categories from './modules/categories'

export default createStore({
  modules: {
    auth,
    incomes,
    categories,
  },
})
