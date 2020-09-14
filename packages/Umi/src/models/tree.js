
import { Icon } from 'antd'
import {
  getSystemTree,
  getFacilityTree,
  getProLine,
  getCategoryTree,
} from '@/services/tree';

export default {
  namespace: 'tree',
  state: {
  },
  effects: {
    *getSystemTree ({ payload }, { call, put }) {
      const res = yield call(getSystemTree, payload);
      const replaceKey = data => data.reduce((r, c) => {
        if (c.pTree === '一级' || c.pTree === '二级') {
          if (c.pTree === '二级') {
            if (c.isEffective === '0') {
              c.title = `${c.systemSortName}(无效)`
            } else {
              c.title = c.systemSortName
            }
            c.value = c.systemSortCode
          } else {
            c.title = c.systemSortCode === 'root' ? c.systemSortName : c.systemSortCode
            c.value = ''
          }
          c.key = c.id
          c.children = c.list
          c.selectable = false
          if (c.list !== null && c.list.length > 0) {
            replaceKey(c.list)
          } else {
            c.children = []
          }
        } else {
          if (c.isEffective === '0') {
            c.title = `${c.systemName}(无效)`
          } else {
            c.title = c.systemName
          }
          c.value = c.systemCode
          c.key = c.id
          c.children = c.list
          if (c.list !== null && c.list.length > 0) {
            replaceKey(c.list)
          } else {
            c.children = []
          }
        }
        return [
          ...r,
          c,
        ]
      }, [])
      yield put({
        type: 'save',
        payload: {
          system: replaceKey(res.data[0].list),
        },
      })
    },
    *getFacilityTree ({ payload }, { call, put }) {
      const res = yield call(getFacilityTree, payload);
      const replaceKey = data => data.reduce((r, c) => {
        if (c.facilityStructureCode === 'root') {
          c.title = '厂房'
          c.value = ''
          c.key = c.id
          c.children = c.list
          if (c.list !== null && c.list.length > 0) {
            replaceKey(c.list)
          } else {
            c.children = []
          }
        } else {
          if (c.isEffective === '0') {
            c.title = `${c.facilityStructureName}(无效)`
          } else {
            c.title = c.facilityStructureName
          }

          c.value = c.facilityStructureCode
          c.key = c.id
          c.children = c.list
          if (c.list !== null && c.list.length > 0) {
            replaceKey(c.list)
          } else {
            c.children = []
          }
        }
        return [
          ...r,
          c,
        ]
      }, [])
      yield put({
        type: 'save',
        payload: {
          facility: replaceKey(res.data[0].list),
        },
      })
    },
    *getCategoryTree ({ payload }, { call, put }) {
      const res = yield call(getCategoryTree, payload);
      const replaceKey = data => data.reduce((r, c) => {
        if (c.categoryCode === '405') {
          c.title = '设备类别'
          c.value = ''
          c.key = c.id
          c.children = c.list
          if (c.list !== null && c.list.length > 0) {
            replaceKey(c.list)
          } else {
            c.children = []
          }
        } else {
          if (c.isEffective === '0') {
            c.title = `${c.categoryName}(无效)`
          } else {
            c.title = c.categoryName
          }
          c.value = c.categoryCode
          c.key = c.id
          c.children = c.list
          if (c.list !== null && c.list.length > 0) {
            replaceKey(c.list)
          } else {
            c.children = []
          }
        }
        return [
          ...r,
          c,
        ]
      }, [])
      yield put({
        type: 'save',
        payload: {
          category: replaceKey(res.data[0].list),
        },
      })
    },
  },
  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
}
