import { message } from 'antd';
import {
  changeNoticeReadStated,
  delSentMessageData,
  delBraftMessageData,
  delAcceptMessageData,
  sendMessageData,
  saveMessageData,
  fetchBraftNewsData,
  updateMessageData,
  delsAcceptMessageData,
  getReadStateData,
} from '@/pages/Message/services';

export default {
    namespace: 'message',
    state: {
      braftListInfo: {
        braftList: [],
      },
    },
    effects: {
      *fetchBraftNews({ payload }, { call, put }) {
        const res = yield call(fetchBraftNewsData);
        if (res.success === true) {
          yield put({ type: 'save', payload: { braftListInfo: { braftList: res.data.data } } })
        }
      },
      *changeNoticeReadState({ payload, callback }, { call }) {
        const res = yield call(changeNoticeReadStated, payload)
        callback(res);
      },
      *clearNotices({ payload, callback }, { call }) {
        const res = yield call(changeNoticeReadStated, payload);
        callback(res);
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
      *delSentMessage({ payload, callback }, { call }) {
        const res = yield call(delSentMessageData, payload);
        if (res.success === true) {
          message.info('删除成功！')
          callback()
        }
      },
      *delBraftMessage({ payload, callback }, { call }) {
        const res = yield call(delBraftMessageData, payload);
        if (res.success === true) {
          message.info('删除成功！')
          callback()
        }
      },
      *delAcceptMessage({ payload, callback }, { call }) {
        const res = yield call(delAcceptMessageData, payload);
        if (res.success === true) {
          message.info('删除成功！')
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
      *getReadState({ callback }, { call }) {
        const res = yield call(getReadStateData);
        if (res[0].success === true && res[1].success === true) {
          callback(res)
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
