import React, { Fragment } from "react"

import BasicLayout from '../../components/Layouts/BasicLayout'

import { Layout, message, Badge, Dropdown, Menu, Avatar, Divider, Icon } from 'antd';
import KeepAliveTabs from '../../components/Layouts/KeepAliveTabs'
import menuData from './menu'
import styles from './BasicLayout.less'
// import logoIcon from "./logo_collapsed.png"
// import logoImg from "./logo_collapsed_false.png"
const logoIcon = "data:image/png;base64,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"
const img = "data:image/png;base64,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"
class BasicLayoutDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItem: {}
    }
  }
  render() {
    /*********onCollapse(bool) 搜索展开回调
     * tabsActiveKey: 当前展示的路径key
     * openTabs:[{
        name:
        path:
        closable: false
     }]
     onTabEdit:function(targetKey,action){}  tab页编辑
     onTabChange:function(activeKey){}  tab页更改
     onClickItem：func点击菜单回调
     ******/
    const themeMenu = (
      <Menu selectedKeys={[]} mode="horizontal" className={styles.themeMenu}>
        {/* <div>主题设置</div> */}
        <Menu.Item key="dark">
          <Icon type="check-circle" theme="filled" className={styles.icon} style={{ color: '#rgba(0, 28, 55, 1)' }} />
          <div>默认</div>
        </Menu.Item>
        <Menu.Item key="blue">
          <div className={styles.coloritem} style={{ backgroundColor: '#004da0' }} />
          <div>深海蓝</div>
        </Menu.Item>
        <Menu.Item key="green">
          <div className={styles.coloritem} style={{ backgroundColor: 'rgba(81, 180, 116, 1)' }} />
          <div>深草绿</div>
        </Menu.Item>
      </Menu>
    )
    const headRight = (
      <React.Fragment>
        <span className={styles.action}>首页</span>
        <Badge dot={true} offset={[-7, 0]}>
          <a className={styles.action}>消息</a>
        </Badge>
        <a className={styles.action}>帮助文档</a>
        <Dropdown overlay={themeMenu} placement="bottomRight" overlayStyle={{ minWidth: '180px' }}>
          <a className={styles.action}>主题</a>
        </Dropdown>
      </React.Fragment>
    )
    return (<BasicLayout
      onClickItem={(data) => { console.log(data) }}
      menuClick={(item) => {
        console.log(item)
        this.setState({
          menuItem: item
        })
      }}
      currentUser={{ userName: "管理员", avatar: "" }}
      menuData={menuData()} theme="dark"
      openTabs={[{ name: "工作台", path: "/", closable: false }, { name: "管理", path: "/aa" }]}
      tabsActiveKey="/aa"
      headerRight={headRight}
      headerLogo="405"
      siderLogo={{
        img: require("./logo_collapsed_false.png"),
        icon: require("./logo_collapsed.png")
      }}
      headerUserClick={(data) => { console.log(data) }}
      componyName='云峰核信'
      componyJob='系统研发工程师==>系统研发工程师==>系统研发工程师==>系统研发工程师32131232131231231231232213213123123123213'
      menuChildren={
        <div>{this.state.menuItem.name}</div>
      }
    >
      <KeepAliveTabs />
    </BasicLayout>)
  }
}
export default BasicLayoutDemo