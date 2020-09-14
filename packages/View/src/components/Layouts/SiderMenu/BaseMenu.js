/* eslint-disable */
import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import styles from './index.less';
import Icon from '../../Icon';

const { SubMenu } = Menu;

export default class BaseMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  constructor(props) {
    super(props)
    this.state = {
      openKeysState: []
    }
  }
  componentDidMount() {
    const nextProps = this.props;
    if (nextProps.iconShow === false) {
      const props = { ...nextProps }
      props.defaultOpenKeys = props.defaultOpenKeys || []
      const { openKeysState } = this.state;
      if (openKeysState.sort().toString() !== nextProps.defaultOpenKeys.sort().toString()) {
        this.setState({ openKeysState: nextProps.defaultOpenKeys })
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.iconShow === false) {
      const props = { ...nextProps }
      props.defaultOpenKeys = props.defaultOpenKeys || []
      const { openKeysState } = this.state;
      if (openKeysState.sort().toString() !== nextProps.defaultOpenKeys.sort().toString()) {
        this.setState({ openKeysState: nextProps.defaultOpenKeys })
      }
    }


  }

  getMenuDataFormat(data) {
    const mainMenu = []
    if (!data.some(child => child.name)) {
      data.forEach((item) => {
        console.log(/^\/.+/.test(item.url) ? item.url : ("/" + item.url))
        mainMenu.push({
          key: item.id,
          icon: item.icon,
          name: item.resourceName,
          path: /^\/.+/.test(item.url) ? item.url : ("/" + item.url),
          list: item.list
        })
      })
      return mainMenu
    }
    return data
  }
  getNavMenuItems(menusData) {
    if (!menusData) {
      return [];
    }
    const data = this.getMenuDataFormat(menusData)
    return data
      .filter(item => item.name)
      .map((item, index) => this.getSubMenuOrItem(item, index))
  };

  // Get the currently selected menu
  getSelectedMenuKeys(pathname) {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem(item, index) {
    const self = this
    // doc: add hideChildrenInMenu
    if (item.list && item.list.length && this.getMenuDataFormat(item.list).some(child => child.name)) {

      const { name } = item;
      return (
        <SubMenu
          title={name}
          key={item.key}
          onTitleClick={({ key, domEvent }) => {

          }}
        >
          {this.getNavMenuItems(item.list)}
        </SubMenu>
      );
    }
    return (
      <Menu.Item
        key={item.key}
        onClick={() => {

        }}
      >
        {this.getMenuItemPath(item)}
      </Menu.Item>
    )
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath(item) {
    const { name, icon } = item;
    const itemPath = this.conversionPath(item.path);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target || '_blank'}>
          <Icon type={icon} />
          <span>{name}</span>
        </a>
      );
    }
    const { location, onCollapse = function () { } } = this.props;


    // fix 菜单path为空的点击无效
    // const isNotHavePath = itempath || true
    // if (!isNotHavePath) {
    //   return <div><Icon type={icon} /><span>{name}</span></div>
    // }
    // end 

    // fix 修复路由不正确的时候出现错误页面
    // const pathIsNull = itemPath || true;
    // if (pathIsNull == true) {
    //   return (
    //     <a target={target || '_blank'}>
    //       <Icon type={icon} />
    //       <span>{name}</span>
    //     </a>
    //   );
    // }
    // end

    return (
      <a
        // to={}
        // target={target}
        // replace={itemPath === location.pathname}
        onMouseOver={() => {
          this.props.menuHover && this.props.menuHover(item)
          this.setState({
            menuShow: true
          })
        }}
        onMouseLeave={() => {
          this.props.menuLeave && this.props.menuLeave()
          this.setState({
            menuShow: false
          })
        }}
        onClick={(itemPath) => {
          this.props.menuClick && this.props.menuClick(item)
          const onClickItem = this.props.onClickItem || function () { }
          // ***menu默认修改，如需以后该样式，则不return
          // return
          // onCollapse(true);
          // onClickItem(item)

        }}
      >
        {this.props.iconShow === false ? null : (<Icon type={icon} />)}
        <span>{name}</span>

      </a>
    );
  };

  conversionPath(path) {
    return path
    /*
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
    */
  };

  getPopupContainer(fixedHeader, layout) {
    if (fixedHeader && layout === 'topmenu') {
      return this.wrap;
    }
    return document.body;
  };


  render() {
    // if pathname can't match, use the nearest parent's key
    // let selectedKeys = this.getSelectedMenuKeys(pathname);
    // if (!selectedKeys.length && openKeys) {
    //   selectedKeys = [openKeys[openKeys.length - 1]];
    // }
    // let props = {};
    // if (openKeys && !collapsed) {
    //   props = {
    //     openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
    //   };
    // }
    const { handleOpenChange, style, menuData, openKeys, defaultOpenKeys,
      theme,
      className,
      collapsed,
      fixedHeader,
      layout,
      selectedKeys,
      onCollapse,
      onClickItem,
      iconShow,
      subMenuLeft,
      ...rest } = this.props;
    const cls = `${className}`;
    const { openKeysState } = this.state;
    return (
      <Menu
        key="Menu"
        openKeys={openKeysState}
        theme={theme}
        onOpenChange={(v) => {
          this.setState({
            openKeysState: v,
            firstHide: false,
          })

          handleOpenChange && handleOpenChange()
        }}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
        mode="inline"
        {...rest}
      // getPopupContainer={() => this.getPopupContainer(fixedHeader, layout)}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
