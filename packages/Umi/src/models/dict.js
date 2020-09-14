
import {
  getDeviceData,
  getEquipRedis,
  getPlatformRedis,
  getData,
  getBusRedis,
  getDictRedis,
} from '@/services/device';
import { message } from 'antd';

export default {
  namespace: 'dict',
  state: {
    busData: {},
    dictData: {},
  },
  effects: {
    *getDict ({ payload }, { call, put }) {
      const { type } = payload;
      const res = yield call(getDeviceData, { limit: 100, page: 1, pcode: type })
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            [type]: res.data.data.map(item => ({ ...item, value: item.dictCode, keys: item.dictCode, label: item.dictName })),
          },
        })
        return res
      }
      return false
    },
    *getEquipRedis ({ payload }, { call, put }) {
      const { pcodes, busType = 'EQUIP' } = payload;
      const ids = pcodes.map(item => `pcodes=${item}`)

      const res = yield call(getEquipRedis, `${ids.join('&')}&busType=${busType}`)
      if (res.code === 0) {
        console.log(res)

        for (let i = 0; i < res.data.length; i++) {
          const o = res.data[i];
          o.list.sort((a, b) => (b.isEffective - a.isEffective));
          yield put({
            type: 'save',
            payload: {
              [o.dictCode]: o.list.map(item => ({ ...item, value: item.dictCode, keys: item.dictCode, label: item.dictName })),
            },
          })
        }
        // yield put({
        //   type: 'save',
        //   payload: {
        //     [type]: res.data.data.map((item) => {
        //       return { ...item, value: item.dictCode, keys: item.dictCode, label: item.dictName }
        //     }),
        //   }
        // })
        return res
      }
      return false
    },
    *getPlatformRedis ({ payload }, { call, put }) {
      const { pcodes } = payload;
      const ids = pcodes.map(item => `pcodes=${item}`)
      const res = yield call(getPlatformRedis, ids.join('&'))
      if (res.code === 0) {
        for (let i = 0; i < res.data.length; i++) {
          const o = res.data[i];
          o.list.sort((a, b) => (b.isEffective - a.isEffective));
          yield put({
            type: 'save',
            payload: {
              [o.dictCode]: o.list.map(item => ({ ...item, value: item.dictCode, keys: item.dictCode, label: item.dictName })),
            },
          })
        }
        // yield put({
        //   type: 'save',
        //   payload: {
        //     [type]: res.data.data.map((item) => {
        //       return { ...item, value: item.dictCode, keys: item.dictCode, label: item.dictName }
        //     }),
        //   }
        // })
        return res
      }
      return false
    },

    *getData ({ payload }, { call, put }) {
      const { type } = payload;
      const res = yield call(getData, { limit: 100, page: 1, pcode: type })
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            [type]: res.data.data.map(item => ({ ...item, value: item.dictCode, keys: item.dictCode, label: item.dictName })),
          },
        })
        return res
      }
      return false
    },
    *getBusRedis ({ payload }, { call, put }) {
      const res = yield call(getBusRedis, payload)
      if (res.code === 0) {
        const obj = {};
        res.data.map(item => {
          obj[item.dictCode] = item.list;
        })
        yield put({
          type: 'save',
          payload: {
            busData: obj,
          },
        })
        return res
      }
      return false
    },
    *getDictRedis ({ payload }, { call, put }) {
      const res = yield call(getDictRedis, payload)
      if (res.code === 0) {
        const obj = {};
        res.data.map(item => {
          obj[item.dictCode] = item.list;
        })
        yield put({
          type: 'save',
          payload: {
            dictData: obj,
          },
        })
        return res
      }
      return false
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
