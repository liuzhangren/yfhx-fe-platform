import React, { Component } from 'react';
import { Layout, message, Badge, Dropdown, Menu, Avatar, Divider, Icon } from 'antd';
import styles from './Header.less';

const { Header } = Layout;

class HeaderView extends Component {

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  };

  render() {
    const { onMenuClick = function () { }, currentUser, collapsed, headerRight, headerLogo } = this.props

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={({ item, key, keyPath, domEvent }) => {
        onMenuClick({ item, key, keyPath, domEvent })
      }}>
        <Menu.Item key="userInfo" className={styles.menuItem}>
          <div className={styles.userInfo}>
            {/* <div className={styles.avatar}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
            </div> */}
            <div className={styles.info}>
              <div>{currentUser.userName}</div>
              <div style={{ color: '#999', fontSize: '12px' }}>部门: {this.props.componyName}</div>
              <div style={{ color: '#999', fontSize: '12px' }}>岗位: {this.props.componyJob}</div>

              {/* <Divider style={{ margin: '5px 0' }} /> */}
            </div>
          </div>
        </Menu.Item>

        {/* <Menu.Item key="userCenter" className={`${styles.menuItem} ${styles.setInfo}`}>
          个人基本信息设置
        </Menu.Item> */}
        <Menu.Item key="logout" className={`${styles.menuItem} ${styles.loginOut}`}>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Header
        style={{ padding: 0, zIndex: 2 }}
        className={`${styles.fixedHeader} ${styles.header}`}
      >
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>


        <span style={{ marginLeft: '10px', fontSize: '20px', fontWeight: 'bold', color: '#666' }}>{headerLogo}</span>
        <div className={`${styles.right}  ${styles.light}`} style={{fontSize: '16px'}}>
          {headerRight}

          <Dropdown overlay={menu} overlayClassName={`${styles.container}`}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
                icon="user"
                style={{ color: 'black', fontSize: '16px' }}
              />
              <span className={styles.name}>{currentUser.userName}</span>
            </span>
          </Dropdown>
        </div>

      </Header>
    );
  }
}

export default HeaderView;
