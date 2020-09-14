/**
 * Routes:
 *   - ./src/pages/Auth.js
 */
import React from 'react';
import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';
// import ProxyModal from '../pages/Flow/ProxyModal';


export default props => {
  const { location } = props;
  const { pathname } = location;
  // eslint-disable-next-line no-undef
  // if (DEVELOP_SINGLE_PAGE === "true") {
  //   return <div {...props} />
  // }

  if (/\/login/i.test(pathname) || /\/test/i.test(pathname)) {
    return <div>{props.children}</div>;
  } else {
    return <BasicLayout {...props} />;
  }
  // console.log('hello', /\/login/i.test(pathname))
  // if (pathname === '/Flow/ProxyModal') {
  //   return <ProxyModal {...props} />;
  // }

  // return <BasicLayout {...props} />;
};
