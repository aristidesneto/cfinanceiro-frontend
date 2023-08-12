export default {
  SET_AUTH(state, data) {
    state.isAuthenticated = data;
  },
  SET_DATA(state, data) {
    state.data = data;
  },
};
