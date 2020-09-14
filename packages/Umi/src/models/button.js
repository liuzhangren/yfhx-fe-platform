import { getData } from '../services/button';


export default {
  namespace: 'button',

  state: {
    Data: [],
  },
  effects: {
    *getData({
      payload
    }, { call, put }) {
      const res = yield call(getData, payload)
      const newRes = res.data.map(item => {
        return item.url
      })
      yield put({
        type: 'save',
        payload: {
          Data: newRes,
        }
      })
    },

  },

  reducers: {

    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

  },



};
