import {
  getOrgData,
  getOrgTreeData,
  addOrgData,
  delManyOrgData,
  delOneOrgData,
  updateOrgData,
  getExecutive
} from '@/services/org';

import { message } from 'antd';

const namespace = 'org'

export default {
  namespace,
  state: {
    orgData: [],
    currentSelectedRow: {},
    orgTreeData: [],
    pagination: {
      total: 20,
      page: 1,
      limit: 10
    }
  },
  effects: {
    *getExecutive({payload}, {call, put}) {
      const res = yield call(getExecutive, payload);
      
      yield put({
        type: 'save',
        payload: {
          temp: res.data
        }
      })
    },
    *getOrgData({payload}, {call, put}) {
      const res = yield call(getOrgData, payload)
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
          orgData: newRes,
          pagination: {
            total: res.data.total,
            page: res.data.pageNum,
            limit: res.data.pageSize
          }
        } 
      })
      return  res
    },
    *getOrgTreeData(payload, {call, put}) {
      const res = yield call(getOrgTreeData)
      
      const replaceKey = (data) => {
        return data.reduce((r, c) => {
          const { list, orgName, orgNo, ...rest } = c
          c.children = list
          c.title = orgName
          c.key = orgNo
          if(c.list.length > 0) {
            replaceKey(c.list)
          }
          return [
            ...r,
            c
          ]
        }, [])
      }
      yield put({
        type: 'save',
        payload: {
          orgTreeData: replaceKey(res.data)
        } 
      })
    },
    *addOrgData({ payload }, { call, put }) {
      const res = yield call(addOrgData, payload)
      if (res.code === 0) {
          message.success('新增成功');
          return res
      } else {
          return false
      }
    },
    *delManyOrgData({payload}, {call, put}) {
      const res = yield call(delManyOrgData, payload);
      if (res.code === 0) {
          message.success('删除成功');
          return res
      } else {
          return false
      }
    },
    *delOneOrgData({payload}, {call, put}) {
      const res = yield call(delOneOrgData, payload);
      if (res.code === 0) {
          message.success('删除成功');
          return res
      } else {
          return false
      }
    },
    *updateOrgData({payload}, {call, put}) {
      const res = yield call(updateOrgData, payload)

      if (res.code === 0) {
          message.success('编辑成功');
          return res
      } else {
          return false
      }
    },
    *clearData({ payload }, { put, call }) {
      let data =this.state.orgData
      data[0].orgName='0'
      yield put({
          type: 'save',
          payload: {
            orgData:data
          }

      })
  }
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