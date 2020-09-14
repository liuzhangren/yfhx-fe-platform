import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import history from 'history';
import Exception404 from './Exception/404';

// 判断当前用户是否登入
function getLoginState() {
  const token = localStorage.getItem('token') || '';
  return token !== '';
}

const getLoginJump = () => {
  if (window.location.hash.indexOf('token') > 0) {
    return true
  }
    return false
}

// 是否是白名单路径 true表示是存在白名单，false表示不是
function isWhiteList(pathname) {
  const regix = /^(\/$)|(\/Workbench\/MyWorkbench$)|(.+(\/building)$)/g
  return pathname === '/login' || regix.test(pathname)
}

const isPermitRender = (location, menuData, routes) => {
  let is404 = true;
  let is403 = true;
  if (!menuData || !menuData.length) {
    is404 = false;
    is403 = false;
  }
  // 是否登入到系统，true表示已经登入，false表示未登入，或者已经过期
  const isLogin = getLoginState();
  const isOutJumpLogin = getLoginJump();
  // 当前路径名称
  const { pathname } = location
  // 未登入则跳转到登入页面
  if (!isLogin && isOutJumpLogin) {
    return '403'
  }
  if (!isLogin && !isOutJumpLogin) {
    return false
  }


  // 先判断页面是否存在

  if (!isWhiteList(pathname)) {
    for (let i = 0; i < routes.length; i += 1) {
      const o = routes[i].path;
      if (o === (pathname)) {
        is404 = false;
        break;
      }
    }
  } else {
    is404 = false;
  }
  if (is404) {
    return '404'
  }
  if (!isWhiteList(pathname)) {
    for (let i = 0; i < menuData.length; i += 1) {
      const o = menuData[i].url;
      if (o && o.indexOf(pathname) >= 0) {
        is403 = false;
        break;
      }
    }
  } else {
    is403 = false;
  }
  // 如果不存在则渲染其他页面
  if (is403) {
    return '403'
  }


  // 默认渲染
  return true
}
class AuthComponent extends React.Component {
  componentDidMount() {
    // fix 修复屏幕适配的问题
    window.addEventListener(
      'resize', () => {
        const { dispatch } = this.props;
        if (dispatch) {
          dispatch({ type: 'global/adaptContentSize' });
        }
      })
  }

  render() {
    const { children, location, allMenuData, route } = this.props;
    const { routes } = route;
    const re = isPermitRender(location, allMenuData, routes)
    // debugger
    if (re === '404') {
      return <Exception404 {...this.props} />
    } if (re === '403') {
      return <Redirect to="/403" />
    } if (!re) {
      return <Redirect to="/login" />
    }
    return children
  }
}

export default connect(({ menu: menuModel, global }) => ({
  menuData: menuModel.menuData,
  allMenuData: menuModel.allMenuData,
  global,
}))(AuthComponent);
