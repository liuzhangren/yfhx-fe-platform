

import router from 'umi/router';

import { getMenu, getAllMenu, getAllMenuChild } from '../services/menu';



/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    menuActive: [],
    menuActiveId: null,
    allMenuData: [],
    oldData: [],
    openTabs: [],
    breadcrumbNameMap: {},
    tabsActiveKey: '/',
    params: {},
    openTabsSelectedKeys: {}
  },
  effects: {
    *delTabs({ payload }, { put }) {
      const idx = {
        name: '首页',
        path: '/',
        // icon: 'home',
        closable: false
      }
      const openTabs = JSON.parse(localStorage.getItem('KOTOMI-ROUTES') || JSON.stringify([idx]))

      let newOpenTabs = []
      if (payload && payload.targetKey) {
        //关闭当前
        if (payload.targetKey !== "/") {
          openTabs.forEach((tab) => {
            if (tab.path !== payload.targetKey) {
              newOpenTabs.push(tab)
            }
          })
        } else {
          newOpenTabs = openTabs;
        }
      } else {
        // 关闭全部标签
        // openTabs.forEach((tab) => {
        //   if (tab.path === '/') {
        //     newOpenTabs.push(tab)
        //   }
        // })
        newOpenTabs.push(idx)
      }

      localStorage.setItem('KOTOMI-ROUTES', JSON.stringify(newOpenTabs))

      if (payload && payload.targetKey === "/") {
      } else {
        yield put({
          type: 'delPutTabs',
          payload: {
            newOpenTabs
          },
        });
        router.push(newOpenTabs[newOpenTabs.length - 1].path)

      }
      return newOpenTabs[newOpenTabs.length - 1]
    },
    *delTabsElse({ payload }, { put }) {
      const idx = {
        name: '首页',
        path: '/',
        // icon: 'home',
        closable: false
      }
      const openTabs = JSON.parse(localStorage.getItem('KOTOMI-ROUTES') || JSON.stringify([idx]))
      const newOpenTabs = []

      if (payload && payload.targetKey === "/") {
        newOpenTabs.push(idx)
      } else {
        openTabs.forEach((tab) => {
          if (tab.path === payload.targetKey && tab.path !== "/") {
            newOpenTabs.push(tab)
          }
        })

        newOpenTabs.unshift(idx)
      }


      localStorage.setItem('KOTOMI-ROUTES', JSON.stringify(newOpenTabs))

      yield put({
        type: 'delPutTabs',
        payload: {
          newOpenTabs
        },
      });
      router.push(newOpenTabs[newOpenTabs.length - 1].path)
      return newOpenTabs[newOpenTabs.length - 1]
    },
    *putTabs({ payload }, { put }) {
      yield put({
        type: 'savePutTabs',
        payload,
      });
      let url = window.location.href;
      // 跨平台工作台直接跳转
      if ((payload.tabsActiveKey === '/open-task' || payload.tabsActiveKey === '/Workbench/MyWorkbench') && (url.indexOf('?') !== -1)) {
        // 拼接？后面的参数
        router.push('/Workbench/MyWorkbench' + '?' + url.split('?')[1])
      } else {
        router.push(payload.tabsActiveKey)
      }
    },
    *getMenuData(_, { call, put }) {
      const response = yield call(getMenu);
      if (response && response.data && response.data[0]) {
        const data = response.data[0].list;
        yield put({
          type: 'save',
          payload: { menuData: data, oldData: data },
        });
      }
    },
    *getAllMenuData(_, { call, put }) {
      const response = yield call(getAllMenu);
      if (response && response.data) {
        const data = response.data.data;
        if (!data.filter(itm => itm.url === '/Workbench/MyWorkbench').length) {
          data.push({
            resourceName: '工作台',
            url: '/Workbench/MyWorkbench',
            id: "-1"
          })
        }
        if (!data.filter(itm => itm.url === '/Process/ProcessProxy').length) {
          data.push({
            resourceName: '流程代理',
            url: '/Process/ProcessProxy',
            id: "-2"
          })
        }

        yield put({
          type: 'save',
          payload: {
            allMenuData: data.map((item) => {
              return { ...item, url: /^\/.+/.test(item.url) ? item.url : ("/" + item.url) }
            })
          },
        });
      }
    },
    *getAllMenuChild({ payload }, { call, put }) {
      const res = yield call(getAllMenuChild, payload)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            menuActive: res.data,
            menuActiveId: payload.id
          }
        })
        return res
      } else {
        return false
      }

    },

  },

  reducers: {
    delPutTabs(state, action) {
      const { newOpenTabs } = action.payload
      return {
        ...state,
        openTabs: newOpenTabs,
        tabsActiveKey: newOpenTabs[newOpenTabs.length - 1].path
      }

    },

    savePutTabs(state, action) {
      const openTabs = JSON.parse(localStorage.getItem('KOTOMI-ROUTES') || JSON.stringify([{
        name: '首页',
        path: '/',
        // icon: 'home',
        closable: false
      }]))

      let params = {}
      if (action.payload.tab && openTabs.indexOf(action.payload.tab)) {
        openTabs.push(
          action.payload.tab
        )

        const { payload: { tab: { params: param } } } = action
        params = {
          ...param
        }
      }
      //   // 处理浏览器回退，前进，手动输入tab显示不正确
      let hasOpen = openTabs.filter((item) => { return item.path === action.payload.tabsActiveKey })
      if (hasOpen && hasOpen.length) {

      } else {
        const tabs = state.allMenuData.filter(item => (item.url === action.payload.tabsActiveKey))[0]
        if (tabs) {

          openTabs.push({
            key: tabs.id,
            icon: tabs.icon,
            name: tabs.resourceName,
            path: /^\/.+/.test(tabs.url) ? tabs.url : ("/" + tabs.url),
            list: tabs.list
          })
        } else {
          console.error("地址错误")
        }
      }

      localStorage.setItem('KOTOMI-ROUTES', JSON.stringify(openTabs))


      const openTabsSelectedKeys = { ...state.openTabsSelectedKeys };
      if (action.payload.selectedKeys) {
        openTabsSelectedKeys[action.payload.tabsActiveKey] = action.payload.selectedKeys

      }

      return {
        ...state,
        openTabs,
        tabsActiveKey: action.payload.tabsActiveKey,
        params,
        openTabsSelectedKeys
      }

    },

    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

  },



};
