

export default {
  namespace: "user",
  state: {
    currentUser: {}
  },
  effects: {

  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}