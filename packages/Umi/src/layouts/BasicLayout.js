import React from 'react';
import { withRouter } from 'dva/router';
import 'antd/dist/antd.less';
import { BasicLayout, Icon } from 'view';
import { generateThemeColor, changeAntdTheme } from 'dynamic-antd-theme-yfhx';
import { connect } from 'dva';
import { Dropdown, Menu, Tooltip, message } from 'antd';
import styles from './BasicLayout.less';
// import starIcon from '../assets/star-active.svg'
// import noStarIcon from '../assets/star.svg'
import chaIcon from '../assets/cha-icon.png'
import NoticeIconView from '../pages/Message';


class App extends React.PureComponent {
  state = {
    theme: 'dark',
    // drawerVisible: false,
    menuActive: [],
    // 搜索条件
    searchData: '',
    // menuHeight: window.innerHeight - 50,
  };

  componentWillMount() {
    changeAntdTheme(generateThemeColor('#282838'));
    // if (window.location.pathname === '/') {
    //   localStorage.removeItem('KOTOMI-ROUTES')
    // }
  }

  showNotice = visible => !visible

  componentDidMount() {
    const {
      // menuData,
      // openTabs,
      // tabsActiveKey,
      dispatch,
      location: { pathname },
    } = this.props;

    // 获取用户信息，如果不存在，重新登录
    let userInfo = localStorage.getItem('userInfo');
    userInfo = userInfo && JSON.parse(userInfo);
    if (!userInfo || !userInfo.token) {
      dispatch({
        type: 'login/logout',
      });
    } else {
      dispatch({
        type: 'user/save',
        payload: { currentUser: userInfo },
      });
      dispatch({
        type: 'menu/getMenuData',
      })
      dispatch({
        type: 'menu/getAllMenuData',
      });
      dispatch({
        type: 'button/getData',
      });
      dispatch({
        type: 'menu/putTabs',
        payload: {
          tabsActiveKey: pathname,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      tabsActiveKey,
      dispatch,
      location: {
        pathname,
        // search
      },
    } = nextProps;
    if (tabsActiveKey !== pathname) {
      dispatch({
        type: 'menu/putTabs',
        payload: {
          tabsActiveKey: pathname,
        },
      });
    }
  }

  menuClick = data => {
    const { dispatch, openTabs } = this.props;
    const newOpenTabs = [...openTabs];
    const newOpenTabsFilter = newOpenTabs.filter(tab => tab.name === data.name);

    // 如果页面已经打开过，则切换到之前打开的页面
    if (newOpenTabsFilter.length > 0) {
      dispatch({
        type: 'menu/putTabs',
        payload: {
          tabsActiveKey: newOpenTabsFilter[0].path,
        },
      });
      return;
    }

    // 否则跳转到其他页面
    const path = data.path || '';
    if (path !== '') {
      dispatch({
        type: 'menu/putTabs',
        payload: {
          tab: data,
          tabsActiveKey: path,
        },
      });
    }
  };

  menuItemFetch = id => {
    // const { menuId } = this.state
    // if (menuId === id) return
    const { dispatch } = this.props
    dispatch({
      type: 'menu/getAllMenuChild',
      payload: {
        id,
      },
    })
      .then(res => {
        this.setState({
          menuId: id,
          menuActive: res.data,
        })
        const repeatData = this.getSearchMenu(res.data, this.state.searchData)
        dispatch({
          type: 'menu/save',
          payload: {
            menuActive: repeatData,
          },
        })
      })
  }

  // renderDom = (data) => {
  //   const dom = []
  //   const divDom = []
  //   var height = window.innerHeight - 56 - 24
  //   data.map((item) => {
  //     if ((item.list.length + 1) * 40 < height) {
  //       console.log(111, height)
  //       height -= (item.list.length + 1) * 40
  //       divDom.push(item)
  //     } else {
  //       height = 0
  //     }
  //   })
  //   console.log('divDom', divDom)
  //   console.log(dom)
  //   console.log(height)
  //   console.log(data)
  // }

  // 修改后的menu
  menuOnClick = async data => {
    // const dom = this.renderDom(data.proxyChildren)
    // this.setState({ dom })
    if (data.proxyChildren.length === 0) {
      this.menuClick(data)
    }
    // this.menuItemFetch(data)
    this.setState({
      // drawerVisible: true,
      menuActive: data.proxyChildren,
      menuItemData: data.proxyChildren,
    })
  }

  changeColorMode = e => {
    // #0000FF #50c878 #1890ff
    this.setState({
      theme: e.key,
    });
    if (e.key === 'blue') {
      changeAntdTheme(generateThemeColor('#1C4D9B'));
    } else if (e.key === 'dark') {
      changeAntdTheme(generateThemeColor('#282838'));
    } else if (e.key === 'green') {
      changeAntdTheme(generateThemeColor('#6CB17A'));
    } else if (e.key === 'saucePurple') {
      changeAntdTheme(generateThemeColor('#6938C9'));
    } else if (e.key === 'volcanic') {
      changeAntdTheme(generateThemeColor('#F26033'));
    }
  };

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
    return (
      <Dropdown overlay={menu}>
        <div
          className="ant-dropdown-link"
          onClick={e => e.preventDefault()}
          style={{
            padding: '0 12px',
            marginLeft: '12px',
            cursor: 'pointer',
          }}
        >
          关闭 <Icon type="down" />
        </div>
      </Dropdown>
    );
  };

  // 获取常用功能入口列表(入口)
  getEntryList() {
    const self = this;
    const { dispatch } = self.props;
    dispatch({
      type: 'home/getEntryList',
      payload: {},
    });
  }

  // 获取可添加的功能入口下拉下单(入口)
  getEntryMenuResource() {
    const self = this;
    const { dispatch } = self.props;
    dispatch({
      type: 'home/getEntryMenuResource',
      payload: {},
    });
  }

  // 常用功能入口跳转(入口)
  openTabs = tabsActiveKey => {
    const { dispatch } = this.props;
    // this.refs.SiderMenu()
    this.SM.menuClose()
    dispatch({
      type: 'menu/putTabs',
      payload: {
        tabsActiveKey: /^\/.+/.test(tabsActiveKey) ? tabsActiveKey : (`/${tabsActiveKey}`),
      },
    });
  };

  // 删除常用功能入口(入口)
  handleDelEntry(id, name) {
    // if (e) e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'home/handleDelOneEntry',
      payload: id,
      callBack: async res => {
        if (res && res.success) {
          const { menuId } = this.state
          // self.menuModal.hide();
          message.success(`删除${name}功能入口成功`);
          this.getEntryList();
          this.getEntryMenuResource()
          this.menuItemFetch(menuId)
        }
      },
    });
  }

  addUseFunc = (e, obj) => {
    const { icon, resourceName, url } = obj
    if (obj.common === 1) {
      // obj.common = 0

      this.handleAddEntry({ icon: icon || 'file', moduleName: resourceName, url }, this.state.type);
      // this.setState({
      //   test: []
      // })
    } else {
      // obj.common = 1

      this.handleDelEntry(obj.commonId, obj.resourceName, 'del')
      // this.setState({
      //   test: []
      // })
    }
  }

  // 添加常用功能入口(入口)
  handleAddEntry(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/handleAddOneEntry',
      payload,
      callBack: res => {
        if (res && res.success) {
          // self.menuModal.hide();
          const { menuId } = this.state
          message.success('添加常用功能入口成功!');
          this.getEntryList();
          this.getEntryMenuResource()
          this.menuItemFetch(menuId)
        }
      },
    });
  }

  // 计算子元素最多条数
  calculationMax = () => {
    const { menuActive } = this.state
    let maxCount = 0
    menuActive.forEach(item => {
      if (item.list.length > maxCount) {
        maxCount = item.list.length
      }
    })
    return maxCount
  }

  // 计算宽度
  calculationCount = (data, count) => {
    // 获取屏幕高
    const wdHeight = window.innerHeight
    // const wdHeight = this.props.baseHeight
    const maxCount = this.calculationMax()
    // 视口高度 - 头部高度 - 上下内边距 - 搜索框和上内边距
    const menuCount = ((wdHeight - 50 - 48 - 56) / 40).toFixed(0)

    count += data.length
    data.forEach(item => {
      count += item.list.length
    })
    this.maxHeight = menuCount > maxCount ? menuCount : maxCount
    return this.modFloat(count / (menuCount > maxCount ? menuCount : maxCount)) * 300
  }

  modFloat = v => {
    const max = parseInt(v) + 1;
    if (max - v < 1) {
      return max;
    }
    return v;
  }

  // admin 的时候筛选条件
  getSearchMenuAdmin = (menuData, searchString) => {
    const data = [];
    menuData.map(element => {
      if (element.resourceName.indexOf(searchString) >= 0) {
        data.push(element)
      }
      return true
    })
    return data;
  }

  // 根据搜索条件筛选数据
  getSearchMenu = (menuData, searchString) => {
    const data = [];
    menuData.map(element => {
      // if (element.resourceName.indexOf(searchString) >= 0) {
      //   data.push(element)
      // }
      // else
      // {
      if (element.list && element.list.length > 0) {
        element.list.map(el => {
          if (el.resourceName.indexOf(searchString) >= 0) {
            data.push(element)
          }
          return true
        })
      }
      return true
      // }
    })
    return data;
  }

  // 去重复数据
  repeatChange = data => {
    const result = [];
    const obj = {};
    for (let i = 0; i < data.length; i += 1) {
      if (!obj[data[i].id]) {
        result.push(data[i]);
        obj[data[i].id] = true;
      }
    }
    return result
  }

  getMenuData = (repeatData, searchString) => repeatData.reduce((r, c) => [

    ...r,
    {
      ...c,
      list: c.list.reduce((_r, _c) => {
        if (_c.resourceName.indexOf(searchString) >= 0) {
          return [
            ..._r,
            _c,
          ]
        }
        return _r
      }, []),
    },


  ], [])

  // 搜索
  searchChange = e => {
    const data = this.state.menuItemData
    const { currentUser } = this.props
    const { value } = e.target
    // 搜索

    // 去重复数据
    let searchData = ''
    if (currentUser.userId === 'admin') {
      // 如果是admin账户只搜索二级菜单，所有调用的函数不一样
      searchData = this.getSearchMenuAdmin(data, value)
    } else {
      // 不是admin用户则搜索三级菜单
      searchData = this.getSearchMenu(data, value)
    }

    const repeatData = this.repeatChange(searchData)

    // 筛选
    const menuData = this.getMenuData(repeatData, value)

    this.setState({
      searchData: value,
      menuActive: menuData,
    })
    // dispatch({
    //   type: 'menu/save',
    //   payload: {
    //     menuActive: repeatData
    //   }
    // })
  }

  render() {
    const {
      menuData,
      openTabs,
      tabsActiveKey,
      dispatch,
      // location: {pathname, search },
      currentUser,
      // menuActive,
    } = this.props;
    const { menuActive, searchData } = this.state

    const themeMenu = (
      <Menu
        onClick={this.changeColorMode}
        selectedKeys={[]}
        mode="horizontal"
        className={styles.themeMenu}
      >
        <Menu.Item key="dark">
          {this.state.theme === 'dark' ? (
            <Icon
              type="check-circle"
              theme="filled"
              className={styles.icon}
              style={{ color: '#282838' }}
            />
          ) : (
              ''
            )}
          <div>默认</div>
        </Menu.Item>
        <Menu.Item key="blue">
          {this.state.theme === 'blue' ? (
            <Icon
              type="check-circle"
              theme="filled"
              className={styles.icon}
              style={{ color: '#1C4D9B' }}
            />
          ) : (
              ''
            )}
          <div className={styles.coloritem} style={{ backgroundColor: '#004da0' }} />
          <div>深海蓝</div>
        </Menu.Item>
        <Menu.Item key="green">
          {this.state.theme === 'green' ? (
            <Icon
              type="check-circle"
              theme="filled"
              className={styles.icon}
              style={{ color: '#50c878' }}
            />
          ) : (
              ''
            )}
          <div className={styles.coloritem} style={{ backgroundColor: 'rgba(81, 180, 116, 1)' }} />
          <div>深草绿</div>
        </Menu.Item>
        <Menu.Item key="volcanic">
          {this.state.theme === 'volcanic' ? (
            <Icon
              type="check-circle"
              theme="filled"
              className={styles.icon}
              style={{ color: '#F26033' }}
            />
          ) : (
              ''
            )}
          <div className={styles.coloritem} style={{ backgroundColor: 'rgba(81, 180, 116, 1)' }} />
          <div>火山红</div>
        </Menu.Item>
        <Menu.Item key="saucePurple">
          {this.state.theme === 'saucePurple' ? (
            <Icon
              type="check-circle"
              theme="filled"
              className={styles.icon}
              style={{ color: '#6938C9' }}
            />
          ) : (
              ''
            )}
          <div className={styles.coloritem} style={{ backgroundColor: 'rgba(81, 180, 116, 1)' }} />
          <div>酱紫色</div>
        </Menu.Item>
      </Menu>
    );
    const headRight = (
      <React.Fragment>
        <span
          // className={styles.action}
          onClick={() => {
            dispatch({
              type: 'menu/putTabs',
              payload: {
                tabsActiveKey: '/',
              },
            });
          }}
        >
          <a className={styles.action}>
            <Tooltip title="首页">
              <Icon type="home" style={{ fontSize: '16px' }} />
            </Tooltip>
          </a>
        </span>
        <span
          // className={styles.action}
          onClick={() => {
            dispatch({
              type: 'menu/putTabs',
              payload: {
                tabsActiveKey: '/Process/ProcessProxy',
              },
            });
          }}
        >
          <a className={styles.action}>
            <Tooltip title="流程代理">
              <Icon type="icon-liuchengdailishezhi" style={{ fontSize: '16px' }} />
            </Tooltip>
          </a>
        </span>
        <a className={styles.action}>
          <Tooltip title="消息">
            <Icon type="icon-liuchengdailishezhi" style={{ fontSize: '0' }} />
            <NoticeIconView onNoticeVisibleChange={this.showNotice} />
          </Tooltip>
        </a>

        <a className={styles.action}>
          <Tooltip title="帮助">
            <Icon type="question-circle" style={{ fontSize: '16px' }} />
          </Tooltip>
        </a>
        <Dropdown overlay={themeMenu} placement="bottomRight" overlayStyle={{ minWidth: '180px' }}>
          <a className={styles.action}>
            <Tooltip title="主题">
              <Icon type="skin" style={{ fontSize: '16px' }} />
            </Tooltip>
          </a>
        </Dropdown>
      </React.Fragment>
    );
    return (
      <BasicLayout
        onClickItem={this.menuClick}
        currentUser={currentUser}
        menuData={menuData}
        theme="dark"
        menuClick={this.menuOnClick}
        openTabs={openTabs}
        tabsActiveKey={tabsActiveKey}
        headerRight={headRight}
        ref={node => { this.SM = node }}
        menuClose={() => {
          this.setState({
            searchData: '',
          })
        }}
        menuChildren={
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>

              <input
                placeholder="请输入搜索内容"
                // onSearch={value => console.log(value)}
                value={searchData}
                onChange={this.searchChange}
                style={{
                  height: '30px',
                  width: '80%',
                  margin: '24px 0 0 24px',
                  paddingLeft: '30px',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: '1px solid rgb(222, 222, 222)',
                  background: '#ececec',
                }}
              />

              <Icon type="search"
                style={{
                  position: 'absolute',
                  top: '32px',
                  left: '35px',
                }} />
            </div>
            <img alt="" src={chaIcon} className={styles.chaIcon} onClick={() => {
              this.SM.menuClose()
            }}></img>
            <div className={styles.allBox} style={
              {
                height: window.innerHeight - 56 - 24,
                width: menuActive.length > 0 && this.calculationCount(menuActive, 0),
              }
            }>

              <div
                className={styles.menuBoxAll}
                style={{
                  height: this.maxHeight * 40,

                }}
              >
                {
                  menuActive.map(item => (
                    <
                      // key={item.id}
                      // className={styles.menuBox}
                      >
                      <div
                        onClick={e => {
                          e.preventDefault();
                          e.cancelBubble = true
                          e.stopPropagation()
                          if (e.target.matches && e.target.matches('img')) {
                            return;
                          }
                          if (item.resourceType === 1) {
                            this.openTabs(item.url)
                          }
                        }}
                        className={
                          `${currentUser.userId === 'admin' ? styles.text : styles.title}

                      ${item.resourceType === 1 && styles.active}`

                        }>
                        {item.resourceName}
                        {/* {
                          item.common == 0 ?
                            <img src={starIcon}
                              onClick={e => {
                                this.addUseFunc(e, item)
                              }}
                              className={
                                styles.imgStar
                              }></img>
                            :
                            <img
                              onClick={e => {
                                this.addUseFunc(e, item)
                              }}
                              src={noStarIcon}
                              className={
                                styles.imgNoStart
                              }></img>
                        } */}

                      </div>
                      {
                        item.list.length > 0 &&
                        item.list.map(_item => (
                          <div className={
                            `${styles.text}
                            ${styles.active}`
                          }
                            onClick={e => {
                              e.preventDefault();
                              e.cancelBubble = true
                              e.stopPropagation()
                              if (e.target.matches && e.target.matches('img')) {
                                return;
                              }
                              this.openTabs(_item.url);
                            }}
                          >
                            {
                              _item.resourceName
                            }
                            {/* {
                              _item.common == 0 ?
                                <img src={starIcon}
                                  className={
                                    styles.imgStar
                                  }
                                  onClick={e => {
                                    this.addUseFunc(e, _item)
                                  }}></img>
                                :
                                <img src={noStarIcon}
                                  className={
                                    styles.imgNoStart
                                  }
                                  onClick={e => {
                                    this.addUseFunc(e, _item)
                                  }}
                                ></img>
                            } */}
                          </div>
                        ))
                      }
                    </>
                  ))
                }</div >
            </div>
          </ div>
        }
        headerLogo={
          <>
            <span className={styles.logo}>生产管理支持平台</span>
            <span>生产支持</span>
          </>
        }
        siderLogo={{
          icon: require('./../assets/logo_collapsed.png'),
          img: require('./../assets/logo_collapsed_false.png'),
        }}
        componyName={this.props.currentUser.orgTree}
        componyJob={this.props.currentUser.postName}
        onTabEdit={(targetKey, action) => {
          if (action === 'remove') {
            dispatch({
              type: 'menu/delTabs',
              payload: {
                targetKey,
              },
            });
          }
        }}
        onTabChange={activeKey => {
          dispatch({
            type: 'menu/putTabs',
            payload: {
              tabsActiveKey: activeKey,
            },
          });
        }}
        loginoutClick={() => {
          dispatch({
            type: 'login/logout',
          });
        }}
        userInfoClick={() => { }}
        userCenterClick={() => { }}
        onCloseClick={key => {
          if (key === 'close1') {
            dispatch({
              type: 'menu/delTabs',
              payload: {
                targetKey: tabsActiveKey,
              },
            });
          } else if (key === 'close2') {
            dispatch({
              type: 'menu/delTabs',
            });
          } else if (key === 'close3') {
            dispatch({
              type: 'menu/delTabsElse',
              payload: {
                targetKey: tabsActiveKey,
              },
            });
          }
        }}
      >
        <div
          style={{
            margin: '10px',
            background: '#fafafa',
            borderRadius: '5px',
            boxShadow: '0 0 4px 3px #eee',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* <Drawer
              title="设备管理"
              style={{ position: 'absolute', left: '180', top: '0', zIndex: 999 }}
              placement="left"
              closable={false}
              width='100vw'
              // onClose={this.onClose}
              visible={this.state.drawerVisible}
              getContainer={false}
              mask={false}
            >
              <p>helloWorld...</p>
            </Drawer> */}
          {this.props.children}
        </div>
      </BasicLayout >
    );
  }
}
export default withRouter(
  connect(({ menu: menuModel, login, user, button, global }) => ({
    baseHeight: global.contentHeight,
    menuData: menuModel.menuData,
    // menuActive: menuModel.menuActive,
    openTabs: menuModel.openTabs,
    tabsActiveKey: menuModel.tabsActiveKey,
    breadcrumbNameMap: menuModel.breadcrumbNameMap,
    login,
    button,
    currentUser: user.currentUser,
  }))(App),
);
