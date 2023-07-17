export default {
  user: state => state.data.user,
  token: state => state.data.access_token,
  isAuthenticated: state => state.isAuthenticated,
}
