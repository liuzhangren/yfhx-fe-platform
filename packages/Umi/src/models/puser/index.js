import { message } from 'antd';
import {
  updatePuserData,
  updateManyPuserData,
  resetPwd,
  getPuserData,
  getOrgTreeData,
  getUserDictTree,
  setPuser,
  setManyPuser,
  saveDictUserReal,
} from '@/services/puser';
import {
  getDeviceTreeData,
} from '@/services/device';


const namespace = 'puser'

export default {
  namespace,
  state: {
    orgData: [],
    orgTreeData: [],
    deviceTreeData: [],

  },
  effects: {
    *saveDictUserReal({ payload, callBack }, { call, put }) {
      const res = yield call(saveDictUserReal, payload)
      if (res.success) {
        if (callBack) callBack()
        message.success('保存授权成功!')
      }
    },

    *getOrgTreeData(payload, { call, put }) {
      const res = yield call(getOrgTreeData)
      const replaceKey = data => data.reduce((r, c) => {
          const { list, orgName, orgNo, ...rest } = c
          c.children = list
          c.title = orgName
          c.key = orgNo
          if (c.list.length > 0) {
            replaceKey(c.list)
          }
          return [
            ...r,
            c,
          ]
        }, [])
      yield put({
        type: 'save',
        payload: {
          orgTreeData: replaceKey(res.data),
        },
      })
    },
    *getSsPuserData({ payload }, { call, put }) {
      const res = yield call(getPuserData, payload)
      const newRes = res.data.data.reduce((r, c) => [
          ...r,
          {
            ...c,
            key: c.id,
            id: c.account,
          },
        ], [])
      yield put({
        type: 'save',
        payload: {
          ssPuserData: newRes,
          pagination: {
            total: res.data.total,
            page: res.data.pageNum,
            limit: res.data.pageSize,
          },
        },
      })
      return res
    },

    *getUserDictTree({ payload }, { call, put }) {
      const res = yield call(getUserDictTree, payload)
      if (res.data.length > 0) {
        yield put({
          type: 'save',
          payload: {
            checkedKeys: res.data.reduce((r, c) => [
                ...r,
                ...(c.dictCode === 'EQUIP' ? [] : [c.dictCode]),
              ], []),
          },
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            checkedKeys: [],
          },
        })
      }
    },
    *getDeviceTreeData({ payload }, { call, put }) {
      const res = yield call(getDeviceTreeData, payload);
      const replaceKey = data => data.reduce((r, c) => {
          const { list, dictName, dictCode, ...rest } = c
          c.children = list
          c.title = dictName
          c.key = dictCode
          if (c.list && c.list.length > 0) {
            replaceKey(c.list)
          } else {
            c.children = []
          }
          return [
            ...r,
            c,
          ]
        }, [])
      yield put({
        type: 'save',
        payload: {
          deviceTreeData: replaceKey(res.data),
        },
      })
    },

    *updateManyPuserData({ payload }, { call, put }) {
      const res = yield call(updateManyPuserData, payload)
      if (res.code === 0) {
        message.success('取消成功');
        return res
      }
      return false
    },
    *updatePuserData({ payload }, { call, put }) {
      const res = yield call(updatePuserData, payload)
      if (res.code === 0) {
        message.success('取消成功');
        return res
      }
      return false
    },

    *resetPwd({ payload }, { call, put }) {
      const { id } = payload;
      const res = yield call(resetPwd, id)
      if (res.code === 0) {
        return res
      }
      return false
    },
    *setPuser({ payload }, { call, put }) {
      const { id, orgNo } = payload;
      const res = yield call(setPuser, id)
      if (res.code === 0) {
        message.success('设置成功');
        return res
      }
        return false
    },
    *setManyPuser({ payload }, { call, put }) {
      const { selectedRowKeys, orgNo } = payload;
      const res = yield call(setManyPuser, selectedRowKeys)
      if (res.code === 0) {
        message.success('设置成功');
        return res
      }
        return false
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
