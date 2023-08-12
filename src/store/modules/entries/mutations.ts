export default {
  ENTRIES_SET_INCOME(state, data) {
    state.data_entries_income = data.data;
  },
  ENTRIES_SET_EXPENSE(state, data) {
    state.data_entries_expense = data.data;
  },
  // ENTRIES_SET_INCOME_BY_ID(state, data) {
  //   state.data_entries_by_id = data
  // },
  ENTRIES_SET_GROUP_INCOME(state, data) {
    state.data_entries_group_income = data;
  },
};
