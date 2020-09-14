import {
  getRoleTreeData,
  getRoleData,
  getPuserData,
  addRoleData,
  updateRoleData,
  delManyRoleData,
  delOneRoleData,
  addRoleUserReal,
  delManyUserData,
  addRoleResReal,
  getRoleResReal
} from '@/services/role';

import { message } from 'antd';

const namespace = 'role'

export default {
  namespace,
  state: {
    roleData: [],
    ppuserData: [],
    roleTreeData: [],
    roleAllData: [],
    keys: [],
    pagination: {
      total: 20,
      page: 1,
      limit: 10
    },
    puserPagination: {
      total: 20,
      page: 1,
      limit: 10
    },

    allUserPagination: {
      total: 20,
      page: 1,
      limit: 10
    },

  },
  effects: {
    *addRoleResReal({ payload }, { call, put }) {
      const res = yield call(addRoleResReal, payload);
      return res
    },
    *addRoleUserReal({ payload }, { call, put }) {
      const { roleId, ...rest } = payload
      const res = yield call(addRoleUserReal, rest);
      return res
    },
    *getRoleResReal({ payload }, { call, put }) {
      const res = yield call(getRoleResReal, payload);
      //让树节点显示勾选
      return res

      // 

    },

    *delManyUserData({ payload }, { call, put }) {
      const { roleId, ...rest } = payload;
      const res = yield call(delManyUserData, rest)

      return res
    },


    *addRoleData({ payload }, { call, put }) {
      const res = yield call(addRoleData, payload);
      return res
    },
    *getRoleData({ payload }, { call, put }) {
      const res = yield call(getRoleData, payload);
      const newRes = res.data.data.reduce((r, c) => {
        return [
          ...r,
          {
            key: c.id,
            ...c
          }
        ]
      }, []);
      yield put({
        type: 'save',
        payload: {
          roleData: newRes,
          pagination: {
            total: res.data.total,
            page: res.data.pageNum,
            limit: res.data.pageSize
          }
        }
      })
    },
    *getUserAllData({ payload }, { call, put }) {
      const res = yield call(getPuserData, payload);
      const newRes = res.data.data.reduce((r, c) => {
        return [
          ...r,
          {
            key: c.id,
            ...c
          }
        ]
      }, []);
      yield put({
        type: 'save',
        payload: {
          roleAllData: newRes,
          allUserPagination: {
            total: res.data.total,
            page: res.data.pageNum,
            limit: res.data.pageSize
          }
        }
      })
    },
    *getPuserData({ payload }, { call, put }) {
      const res = yield call(getPuserData, payload);
      const newRes = res.data.data.reduce((r, c) => {
        return [
          ...r,
          {
            key: c.id,
            ...c
          }
        ]
      }, []);

      yield put({
        type: 'save',
        payload: {
          ppuserData: newRes,
          puserPagination: {
            total: res.data.total,
            page: res.data.pageNum,
            limit: res.data.pageSize
          }
        }
      })
    },


    *getRoleTreeData({ payload }, { call, put }) {
      const res = yield call(getRoleTreeData, payload)

      const replaceKey = (data) => {
        return data.reduce((r, c) => {
          const { list, resourceName, id, ...rest } = c
          c.children = list
          c.title = resourceName
          c.key = id
          if (c.list.length > 0) {
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
          roleTreeData: replaceKey(res.data)
        }
      })
    },
    *delManyRoleData({ payload }, { call, put }) {

      const res = yield call(delManyRoleData, payload);
      return res
    },
    *delOneRoleData({ payload }, { call, put }) {
      const { id } = payload;
      const res = yield call(delOneRoleData, id);
      return res

    },
    *updateRoleData({ payload }, { call, put }) {
      const res = yield call(updateRoleData, payload);
      return res
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    clearRecord(state, action) {
      return {
        ...state,
        ppuserData: [],
      }
    }

  }
}