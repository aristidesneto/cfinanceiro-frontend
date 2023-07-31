export default {
  CATEGORIES_SET(state, data) {
    state.data_categories = data
  },
  CATEGORIES_SET_PAGINATE(state, data) {
    state.data_categories_meta = data
  },
  CATEGORIES_SET_SELECT(state, data) {
    state.data_categories_select = data
  },
}
