import { message } from 'antd';
import {
  fetchNoticesData,
  changeNoticeReadStated,
  sendMessageData,
  saveMessageData,
  fetchBraftNewsData,
  updateMessageData,
  delsAcceptMessageData,
} from '@/pages/Message/services';

export default {
    namespace: 'message',
    state: {
      noticesList: {
        notices: [],
      },
      braftListInfo: {
        braftList: [],
      },
    },
    effects: {
      *fetchNotices({ payload }, { call, put }) {
        const res = yield call(fetchNoticesData)
        if (res.success === true) {
          yield put({ type: 'save', payload: { noticesList: { notices: res.data } } })
        }
      },
      *fetchBraftNews({ payload }, { call, put }) {
        const res = yield call(fetchBraftNewsData);
        if (res.success === true) {
          yield put({ type: 'save', payload: { braftListInfo: { braftList: res.data.data } } })
        }
      },
      *changeNoticeReadState({ payload }, { call, put }) {
        const res = yield call(changeNoticeReadStated, payload)
        if (res.success === true) {
          const resu = yield call(fetchNoticesData)
          if (resu.success === true) {
            yield put({ type: 'save', payload: { noticesList: { notices: res.data } } })
          }
        }
      },
      *clearNotices({ payload }, { call, put }) {
        const res = yield call(changeNoticeReadStated, payload)
        if (res.success === true) {
          const resu = yield call(fetchNoticesData)
          if (resu.success === true) {
            yield put({ type: 'save', payload: { noticesList: { notices: res.data } } })
          }
        }
      },
      *sendMessage({ payload, callback }, { call }) {
        const res = yield call(sendMessageData, payload);
        if (res.success === true) {
          message.info('提交成功！')
          callback()
        }
      },
      *saveMessage({ payload, callback }, { call }) {
        const res = yield call(saveMessageData, payload);
        if (res.success === true) {
          message.info('保存成功！')
          callback()
        }
      },
      *updateMessage({ payload, callback }, { call }) {
        const res = yield call(updateMessageData, payload);
        if (res.success === true) {
          message.info('保存成功！')
          callback()
        }
      },
      *delsAcceptMessage({ payload, callback }, { call }) {
        const res = yield call(delsAcceptMessageData, payload);
        if (res.success === true) {
          message.info('删除成功！')
          callback()
        }
      },
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload,
            }
        },
    },
}
