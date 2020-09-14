import React, { Suspense } from 'react';
import { Layout, Menu, Row, Input, Tabs, Card, Icon, Dropdown } from 'antd';
import SiderMenu from './SiderMenu';
import Header from './Header';
import SubMenu from './SiderMenu/SubMenu';
import styles from './BasicLayout.less';

const { Content } = Layout;
class BasicLayout extends React.Component {
  static defaultProps = {
    siderLogo: {}
  }
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      // 当前选择的一级菜单
      selectMenuItem: undefined,
      selectMenuKey: [],
      // 子菜单的左偏移
      subMenuLeft: 180,
      // 当前搜索子节点菜单的关键字
      searchMenuTitle: undefined,
      subMenuExpand: false,//二级菜单是否展开
      subMenuSelected: undefined, //二级菜单选中
      subMenuSelectKey: [],// //二级菜单选中key
      tabsActiveKey: undefined,
      menuItemShow: false, // 菜单栏二级状态
      menusData: [] //储存一级菜单数值
    }
  }


  handleMenuCollapse = (collapsed) => {
    const { onCollapse = function () { } } = this.props;
    this.setState({ collapsed })
    onCollapse(collapsed)
  };

  onClickItemDid(item) {

    const { onClickItem = function () { } } = this.props
    if (item.list && item.list.length || (item.proxyChildren && item.proxyChildren.length)) {
      return;
    }
    onClickItem(item);
  }
  closeClick = ({ item, key, keyPath, domEvent }) => {
    // console.log(key)
    const { onCloseClick = function () { } } = this.props;
    onCloseClick(key);
  }
  tabBarExtraContent = () => {
    const menu = (
      <Menu onClick={this.closeClick}>
        <Menu.Item key="close1">
          <a target="_blank" rel="noopener noreferrer">
            关闭当前标签页
      </a>
        </Menu.Item>
        <Menu.Item key="close2">
          <a target="_blank" rel="noopener noreferrer">
            关闭全部标签页
      </a>
        </Menu.Item>
        <Menu.Item key="close3">
          <a target="_blank" rel="noopener noreferrer">
            关闭其他标签页
      </a>
        </Menu.Item>
      </Menu>
    );
    return <Dropdown overlay={menu}>
      <div className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{
        padding: "0 12px", marginLeft: "12px", cursor: "pointer"
      }}>
        关闭 <Icon type="down" />
      </div>
    </Dropdown>
  }

  menuClose = () => {
    this.setState({
      menuItemShow: false,
      menusData: []
    })
    this.props.menuClose()
  }

  render() {
    const { currentUser,
      menuData,
      onClickItem,
      menuClick,
      menuHover,
      menuLeave,
      tabsActiveKey,
      openTabs,
      onTabEdit = function () { },
      onTabChange = function () { },
      headerRight,
      headerLogo,
      siderLogo,
      menuChildren,
      loginoutClick = function () { },
      userInfoClick = function () { },
      userCenterClick = function () { },
    } = this.props
    const { collapsed } = this.state;
    // - START 删除当前的子节点，让菜单只展现第一层的节点数据 
    const mainMenu = []
    menuData.forEach((item) => {
      mainMenu.push({
        key: item.id,
        icon: item.icon,
        name: item.resourceName,
        path: /^\/.*/.test(item.url) ? item.url : ("/" + item.url),
        proxyChildren: item.list,
        id: item.id
      })
    })
    // - END
    const {
      selectMenuItem,
      subMenuLeft,
      subMenuExpand,
      selectMenuKey,
      subMenuSelectKey
    } = this.state

    return (
      <Layout style={{ position: 'relative', minHeight: '100vh', maxHeight: "100vh" }}>
        {
          this.state.menuItemShow &&
          <div style={{
            width: '100%',
            height: '100%',
            zIndex: 4,
            background: 'rgba(0, 0, 0, 0.2)',
            position: 'fixed',
            top: 0,
            left: 0,
          }}
            onClick={this.menuClose}
          >

          </div>
        }

        <SiderMenu collapsed={collapsed}
          ref="SiderMenu"
          onCollapse={this.handleMenuCollapse}
          theme="dark"
          logo={siderLogo}
          menuData={mainMenu}
          // menuClick={menuClick}
          menuClick={(item) => {
            menuClick(item)
            if (item.proxyChildren.length === 0) {
              this.menuClose()
              return
            }
            const { menusData } = this.state
            // 目的：为了记录当前菜单的状态是否隐藏
            // 如果没有key 则 push 否则 删除key
            if (menusData.indexOf(item.key) === -1) {
              var menuData = []
              menuData.push(item.key)
              this.setState({
                menuItemShow: true
              })
              this.setState({
                menusData: [
                  ...menuData
                ]
              })
            } else {
              this.menuClose()
              // this.setState({
              //   menuItemShow: false
              // })
            }

          }}
          // menuHover={(item) => {
          //   this.setState({
          //     menuItemShow: true
          //   })
          //   menuHover(item)
          // }}

          onClickItem={(data) => {
            console.log('data', data)
            let isSubMenuExpand = false;
            if (data.proxyChildren && data.proxyChildren.length) {
              isSubMenuExpand = true;
            }
            this.setState({
              selectMenuItem: data,
              searchMenuTitle: undefined,
              subMenuExpand: isSubMenuExpand,
              selectMenuKey: [data.key],

              subMenuSelected: undefined,
              subMenuSelectKey: []

            })

            this.onClickItemDid(data)
            // this.handleMenuCollapse(true)
          }}
          collapsedWidth={50}
          selectedKeys={selectMenuKey}
        />
        {
          !this.state.collapsed ?
            <div
              style={{
                position: "absolute",
                top: '50px',
                // left: `${this.state.collapsed ? '50px' : '180px'} `,
                left: `${this.state.menuItemShow ? '180px' : '-1311px'} `,
                zIndex: '5',
                // width: '87.5%',
                height: window.innerHeight - 50,
                background: '#ececec',
                transition: '0.2s'
              }}
            >{menuChildren}</div>
            :
            <div
              style={{
                position: "absolute",
                top: '50px',
                // left: `${this.state.collapsed ? '50px' : '180px'} `,
                left: `${this.state.menuItemShow ? '50px' : '-1311px'} `,
                zIndex: '5',
                // width: '87.5%',
                height: window.innerHeight - 50,
                background: '#ececec',
                transition: '0.2s'
              }}
            >{menuChildren}</div>
        }
        <Layout>
          <Header
            onCollapse={this.handleMenuCollapse}
            currentUser={currentUser}
            collapsed={collapsed}
            headerRight={headerRight}
            headerLogo={headerLogo}
            componyName={this.props.componyName}
            componyJob={this.props.componyJob}
            onMenuClick={({ item, key, keyPath, domEvent }) => {
              if (key === "userInfo") {
                userInfoClick(currentUser)
              }
              if (key === "userCenter") {
                userCenterClick(currentUser)
              }
              if (key === "logout") {
                loginoutClick(currentUser)
              }
            }}
          />
          <Content className={styles.content}>
            <Layout style={{ width: "100%", height: "100%" }}>
              {selectMenuItem === undefined || !subMenuExpand ? undefined : (
                <SubMenu className={styles.kotomiBasicLayoutSiderSubMenu}
                  menuData={selectMenuItem.proxyChildren}
                  subMenuLeft={subMenuLeft}
                  onCollapse={this.handleMenuCollapse}
                  width={170}
                  onClickItem={(data) => {
                    this.setState({
                      subMenuSelected: data,
                      subMenuExpand: false,
                      subMenuSelectKey: [data.key]
                    })

                    this.onClickItemDid(data)
                    // this.handleMenuCollapse(true)
                  }}

                  selectedKeys={subMenuSelectKey}
                />)}
              <Content className={styles.cardTabs}>
                <Tabs
                  className="CardTabs"
                  tabBarStyle={{ backgroundColor: "#fff", borderBottom: "1px solid #001c37" }}
                  activeKey={tabsActiveKey}
                  type="editable-card"
                  hideAdd
                  onEdit={(targetKey, action) => {
                    onTabEdit(targetKey, action)
                  }}
                  onChange={(activeKey) => {
                    onTabChange(activeKey)
                  }}
                  tabBarExtraContent={this.tabBarExtraContent()}
                >
                  {openTabs.map(pane => (
                    <Tabs.TabPane
                      tab={
                        <span>
                          {pane.name}
                        </span>
                      }
                      key={pane.path}
                      closable={pane.closable === false ? false : undefined}
                    >

                      {tabsActiveKey === pane.path || tabsActiveKey === ("/" + pane.path) ? this.props.children : undefined}
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </Content>
            </Layout>
          </Content>
        </Layout>

      </Layout>
    )
  }
}
export default BasicLayout