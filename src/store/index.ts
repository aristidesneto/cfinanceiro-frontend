import { createStore } from 'vuex';

import auth from './modules/auth';
import entries from './modules/entries';
import categories from './modules/categories';
import creditCards from './modules/credit-cards';

export default createStore({
  modules: {
    auth,
    entries,
    categories,
    creditCards,
  },
});
