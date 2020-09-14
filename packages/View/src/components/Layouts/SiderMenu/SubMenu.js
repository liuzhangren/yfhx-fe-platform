import React from "react"
import { Layout, Input, Row } from 'antd';
import BaseMenu from './BaseMenu';
import styles from "./SubMenu.less"

const { Sider } = Layout;
class SubMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMenuTitle: undefined
    }
  }

  getSearchMenu(menuData, searchString) {
    let data = [];
    menuData.map((element) => {
      if (element.resourceName.indexOf(searchString) >= 0) {
        data.push(element)
      } else {
        if (element.list && element.list.length > 0) {
          element.list = this.getSearchMenu(element.list, searchString);
          if (element.list.length > 0) {
            data.push(element)
          }
        }
      }
    })
    // data = menuData.filter((element) => {
    //   // 过滤筛选框的值   (包括子集)
    //   if (element.resourceName.indexOf(searchString) >= 0) {
    //     return true;
    //   } else {
    //     if (element.list && element.list.length > 0) {

    //       element.list = this.getSearchMenu(element.list, searchString)
    //       const names = element.list.map((item) => { return item.resourceName })
    //       if (names.join(",").indexOf(searchMenuTitle) >= 0) {
    //         expandKeys.push(element.id)
    //         return true
    //       } else {
    //         return false;
    //       }
    //     }

    //   }
    // })
    // console.log(data)
    return data;
  }


  renderMenuData() {
    let { searchMenuTitle } = this.state;

    const { menuData, className, ...rest } = this.props;
    let data = [];
    let expandKeys = [];
    if (searchMenuTitle) {
      data = this.getSearchMenu(JSON.parse(JSON.stringify(menuData)), searchMenuTitle)
      data.map((item) => {
        expandKeys.push(item.id)
      })
      // data = menuData.filter((element) => {
      //   // 过滤筛选框的值   (包括子集)
      //   if (element.resourceName.indexOf(searchMenuTitle) >= 0) {
      //     return true;
      //   } else {
      //     const names = element.list.map((item) => { return item.resourceName })
      //     if (names.join(",").indexOf(searchMenuTitle) >= 0) {
      //       expandKeys.push(element.id)
      //       return true
      //     } else {
      //       return false;
      //     }
      //   }


      // })
    } else {
      data = menuData
    }
    if (!data.length) {
      return <div style={{ textAlign: "center", color: "#999" }}>无符合条件目录</div>
    }
    const subMenu = <BaseMenu menuData={data} defaultOpenKeys={expandKeys} style={{ border: 0, overflowX: "hidden" }} {...rest} iconShow={false} />
    return subMenu
  }

  render() {

    const { handleOpenChange, style, menuData, className, subMenuLeft, selectedKeys, onClickItem, ...rest } = this.props;
    return (
      <Sider className={className} style={{
        overflow: 'auto',
      }} {...rest}>
        <Row className={styles.search} style={{ margin: "9px" }}>
          <Input.Search
            onChange={e => {
              this.setState({
                searchMenuTitle: e.target.value
              })
            }}
          />
        </Row>
        <Row>
          {this.renderMenuData()}
        </Row>
      </Sider>)
  }
}
export default SubMenu
