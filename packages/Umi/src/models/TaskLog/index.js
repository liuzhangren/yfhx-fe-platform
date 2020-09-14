import router from 'umi/router';
import { message } from 'antd';

import {
  getTaskLogData
} from '@/services/TaskLog';


const namespace = 'TaskLog'

export default {
  namespace,
  state: {
    TaskLogData: [],
    TaskLogTreeData: [],
    pagination: {
      total: 20,
      page: 1,
      limit: 10
    }
  },
  effects: {
    *getTaskLogData({payload}, {call, put}) {
      const res = yield call(getTaskLogData, payload)
      const newRes = res.data.data.reduce((r, c) => {
        return [
          ...r,
          {
            key: c.id,
            ...c
          }
        ]
      }, [])
      yield put({
        type: 'save',
        payload: {
          TaskLogData: newRes,
          pagination: {
            total: res.data.total,
            page: res.data.pageNum,
            limit: res.data.pageSize
          }
        } 
      })
    },
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