/*
 * @Author: your name
 * @Date: 2020-07-27 09:54:35
 * @LastEditTime: 2020-08-11 11:44:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /plateForm_FE/packages/View/src/components/Layouts/SiderMenu/index.js
 */ 
import React, { PureComponent, Suspense } from 'react';
import { Layout, Spin } from 'antd';
import styles from './index.less';
import PageLoading from '../../PageLoading';
import BaseMenu from './BaseMenu';
//const BaseMenu = React.lazy(() => import('./BaseMenu'));
import classNames from 'classnames';

const { Sider } = Layout;

let firstMount = true;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: []
    };
  }


  componentDidMount() {
    firstMount = false;
  }




  render() {
    const { logo, collapsed, onCollapse, theme, menuData, onClickItem, menuClick, menuHover, menuLeave, selectedKeys, ...rest } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderBar]: true,
      [styles.light]: theme === 'light',
    });
    const siderLogoName = classNames({
      "Sider_logo_img": true,
      "Sider_logo_img_show": !collapsed,
    });

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={collapse => {
          if (firstMount) {
            onCollapse(collapse);
          }
        }}
        width={180}
        theme={theme}

        className={siderClassName}
        {...rest}
      >
        {Object.keys(logo).length ? <div className="Sider_logo">
          <div className="Sider_logo_icon">
            <img src={logo.icon}></img>
          </div>
          <div className={siderLogoName}>
            <img src={logo.img} ></img>
          </div>
        </div> : null}


        <Spin spinning={!(menuData && menuData.length)} >
          <BaseMenu
            {...this.props}
            mode="inline"
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
          />
        </Spin>
      </Sider>
    );
  }
}
