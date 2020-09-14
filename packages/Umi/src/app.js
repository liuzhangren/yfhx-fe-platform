import request from '@/utils/request'
import router from 'umi/router';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

// 运行时修改路由
// export function patchRoutes(routes) {
//   // Modify routes as you wish
// }

// 自定义 render，比如在 render 前做权限校验
export function render(oldRender) {
  const taskUrl = window.location.href;
  // 跨平台工作台直接跳转
  if (taskUrl.indexOf('userId') !== -1) {
    const address = taskUrl.split('?')[0]
    const search = taskUrl.split('?')[1]
    const strs = search.split('&');
    const query = {};
    for (let i = 0; i < strs.length; i += 1) {
      query[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
    request(`/v1/oa/auth?taskId=${query.taskId}&userId=${query.userId}`, {
      method: 'post',
    }).then(res => {
      if (res.code === 0) {
        localStorage.removeItem('KOTOMI-ROUTES')
        localStorage.setItem('token', `Bearer ${res.data.token}`);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        localStorage.setItem('KOTOMI-ROUTES',
          JSON.stringify([
            {
              name: '首页',
              path: '/',
              closable: false,
            },
            {
              key: 'workbench',
              icon: 'control',
              name: '工作台',
              path: '/Workbench/MyWorkbench',
              proxyChildren: [],
              id: 'workbench',
            },
          ]),
        )
        // window.location.href = 'http://localhost:8001/#/Workbench/MyWorkbench'
        const taskAddress = address.split('#')
        if (taskAddress[1] === '/open-task' || taskAddress[1] === '/Workbench/MyWorkbench') {
          // window.location.href = `${`${taskAddress[0]}#/Workbench/MyWorkbench` + '?'}${search}`
          window.location.href = `${taskAddress[0]}#/Workbench/MyWorkbench?${search}`
          oldRender()
        }
      } else if (res.code === '403') {
        // window.location.href = '/403'
        router.replace('/403')
      } else {
        window.location.href = '/login'
      }
    })
  } else {
    const url = window.location.search;
    if (url.indexOf('?') !== -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      const query = {};
      for (let i = 0; i < strs.length; i += 1) {
        query[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
      if (query.token) {
        request(`/v1/token/auth?token=${query.token}`, { method: 'POST' }).then(res => {
          if (res && res.code === 0) {
            localStorage.setItem('token', `Bearer ${res.data.token}`);
            localStorage.setItem('userInfo', JSON.stringify(res.data));

            localStorage.removeItem('KOTOMI-ROUTES')

            // oldRender()
            window.location.href = '/'
          } else if (res.code === '403') {
            // window.location.href = '/403'
            router.replace('/403')
          } else {
            oldRender()
          }
        })
      } else {
        oldRender()
      }
    } else {
      oldRender()
    }
  }
}

// 自定义 rootContainer，解决之前使用数据流库（比如 unstated、redux）麻烦的问题
// export function rootContainer(container) {
//   const React = require('react');
//   const { Provider } = require('unstated');
//   return React.createElement(Provider, null, container);
// }
