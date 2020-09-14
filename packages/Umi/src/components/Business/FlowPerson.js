/*eslint-disable*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import classNames from 'classnames';

import debounce from 'lodash/debounce';
import {
  Icon, Select, Spin, Checkbox, Button, Breadcrumb, message
} from 'antd';
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
import { LinkQueryForm, Scard, Modal, } from 'view';
import styles from "./FlowPerson.less"

import LayoutTreeTable, { LayoutTree, LayoutTable } from '../Alink/LayoutTreeTable';
import request from '@/utils/request';
let orgTree = [];
let roleTree = [];
let classType = "" //显示类型

@connect(({ puser, loading, global }) => {
  return {
    baseHeight: global.contentHeight,
    loading
  }
})
class PersonModal extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }


  state = {
    type: 'ADD',
    visible: false,
    data: [],
    value: [],//所有用户
    fetching: false,
    breadcrumb: [],

    checkedList: [],
    indeterminate: false,
    checkAll: false,
    loading: false,
    plainOptions: [],
    userData: [],
  };

  // type = user || personnel || all
  show(type, data, userList) {
    data = data || []
    this.setState(
      {
        visible: true
      }, () => {
        // 处理初始化时有默认数据
        this.setState({
          type: type ? type : 'ADD',
          userData: data,
          value: data
        })
        setTimeout(() => {
          if (this.state.type === 'ADD') {
            if (this.personSelect) {

              const personSelect = ReactDOM.findDOMNode(this.personSelect);
              const input = personSelect.getElementsByClassName("ant-select-search__field")[0]
              console.log(input)
              input.setAttribute("placeholder", "搜索姓名、电话号码...")
              input.style.width = "auto"
            }
          }
          if (this.state.type === 'character') {
            classType = 'role'
            this.viewRole(
              {
                id: "character", roleName: "中核陕西铀浓缩有限公司", list: this.filterSelf(userList)
              }
            )
          }
          if (this.state.type === 'user') {
            classType = 'role'
            this.viewRole(
              {
                id: "user", roleName: "中核陕西铀浓缩有限公司", userList: this.filterSelf(userList)
              }
            )
          }

        })

      }
    );
  }

  hide() {
    this.setState({
      visible: false,
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      loading: false,
      plainOptions: [], breadcrumb: []
    });
    orgTree = [];
    roleTree = [];
    const { onCancel = () => { } } = this.props;
    onCancel && onCancel()
  }
  handleOk() {
    const { userData } = this.state;
    let { userId } = JSON.parse(localStorage.getItem('userInfo'))
    const isSelf = userData.some((item) => {
      return item.account === userId
    })
    if (isSelf) {
      message.error('不允许指定自己为下一节点处理人')
      return
    }
    const { confirm = () => { } } = this.props;
    this.hide()
    confirm && confirm(userData)
  }
  componentDidMount() {
    this.props.onInit && this.props.onInit(this);

  }


  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    // 请求数据
    request("/get/v1/linkage", { method: "GET", params: { content: value } }).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      if (res && res.code === 0) {
        let { userId } = JSON.parse(localStorage.getItem('userInfo'))
        if (res.data) {
          var data = res.data.reduce((r, c) => {
            if (userId !== c.account) {
              return [
                ...r,
                c
              ]
            } else {
              return r
            }
          }, [])
        } else {
          var data = []
        }

        // const data = res.data.map(user => ({
        //   key: user.account,
        //   text: `${user.userName}`,
        //   value: user.account,
        //   lable: user.userName,
        //   ...user
        // }));
        this.setState({ data, fetching: false });
      }
    })
  };

  handleChange = (value) => {
    const { value: oldValue, data } = this.state;
    let newValue = [], diff = []

    for (let i = 0; i < value.length; i++) {
      let has = false;
      for (let j = 0; j < oldValue.length; j++) {
        if (value[i].key === oldValue[j].key) {
          has = oldValue[j];
          break;
        }
      }
      if (has) {
        newValue.push(has);
      } else {
        const o = data.filter(item => item.account === value[i].key)[0]
        newValue.push({ ...o, ...value[i], type: "user" })
      }
    }
    this.setState({
      value: newValue,
      data: [],
      fetching: false
    }, () => {
      const { breadcrumb } = this.state;
      if (breadcrumb && breadcrumb.length) {
        this.changePlainOptions(breadcrumb[breadcrumb.length - 1]);
      }

      const getDiff = (long, short) => {
        return long.filter((item) => {
          return !short.some(itm => itm.key === item.key)
        })
      }

      let diff = []; let arr = []
      // 处理删除搜索框选中人员
      if (oldValue.length > newValue.length) {
        // 删除tag
        diff = getDiff(oldValue, newValue)
        this.getUserData(diff, false)
      } else if (oldValue.length < newValue.length) {
        // 新增tag  新增时只会是新增人员
        // 获得新增的数据信息
        diff = getDiff(newValue, oldValue)
        this.getUserData(diff, true)

      }
    });
  };
  changeSearchData(options, bool) {
    // 添加数据时，value可能已经有值
    const { breadcrumb, value } = this.state;
    let newValue = [];
    // 获取不存在的数据
    if (value.length) {
      // 获取value已存在的数据
      const hasview = options.filter(item => {
        return value.some(itm => itm.key === item.value)
      })
      const noview = options.filter(item => {
        return !hasview.some(itm => itm.value === item.value)
      })
      if (bool) {
        newValue = value.concat(noview.map(item => { return { key: item.value, ...item } }))
      } else {
        newValue = value.filter(item => {
          const keys = hasview.map(itm => itm.value);
          return keys.indexOf(item.key) < 0
        })
      }
    } else {
      if (bool) {
        newValue = options.map(item => { return { key: item.value, ...item } })
      }
    }
    this.setState({ value: newValue })
  }


  getUserData = (options, bool) => {
    let userData = [];
    const getOptionUser = (options) => {
      for (let i = 0; i < options.length; i++) {
        let item = options[i];
        let curUser = item.userList || [];
        if (item.type === "user") {
          curUser = [item]
        }

        // 一个人可能存在不同岗位，过滤相同人
        const newUser = curUser.filter(item => {
          return !userData.some(itm => itm.account === item.account)
        })
        userData = userData.concat(newUser)
        const next = item.list;
        if (next && next.length) {
          getOptionUser(next)
        }

      }

    }

    getOptionUser(options)
    // 用户信息格式化
    userData = userData.map(item => {
      return { key: item.account, label: item.userName, ...item }
    })

    const { userData: value, value: allChoose } = this.state;

    let newValue = []
    if (value.length) {
      const hasview = userData.filter(item => {
        return value.some(itm => itm.account === item.account)
      })
      const noview = userData.filter(item => {
        return !hasview.some(itm => itm.account === item.account)
      })
      if (bool) {
        newValue = value.concat(noview)
      } else {
        // 取消选中
        const keys = hasview.map(itm => itm.account);
        // 过滤已选中的数据
        newValue = value.filter(item => {
          return keys.indexOf(item.account) < 0
        })
        // 获取已被选中的人员，不能删除
        // options.map(itm=>{
        //   if(itm.type==="user"){
        //     // 可能不存在
        //     // const hasChooseUser = allChoose.filter(item => keys.indexOf(item.account) >= 0)
        //     // newValue = newValue.concat(hasChooseUser)
        //   }else{

        //   }
        // })
        if (options.some(item => item.type === "org")) {

          const hasChooseUser = allChoose.filter(item => {
            const no = options.filter(itm => {
              return itm.type === "user"
            })
            const userKeys = no.map(item => {
              return item.account
            })
            return keys.indexOf(item.account) >= 0 && userKeys.indexOf(item.account) < 0
          })
          newValue = newValue.concat(hasChooseUser)
        }

      }
    } else {
      if (bool) {
        newValue = userData
      }
    }
    this.setState({ userData: newValue })
  }

  // 根据数据渲染页面 
  changePlainOptions(data) {
    console.log('data->>', data)
    let plainOptions = []
    let org = [], user = []
    const viewLabel = classType === "role" ? "roleName" : "orgName"
    if (data.list && data.list.length) {
      org = data.list.map((item) => {
        return {
          label: `${item[viewLabel]}(${item.userNo}人)`,
          value: item.id,
          data: item,
          type: "org",
          ...item
        }
      })
      org = org.filter(item => item.userNo > 0)
    }
    if (data.userList && data.userList.length) {
      user = data.userList.map((item) => {
        if (item !== null) {
          return {
            label: <>{item.userName}<span className={styles.accountLine}>{item.account}</span></>,
            value: item.account,
            data: "",
            type: "user",
            ...item
          }
        }

      })
    }
    plainOptions = org.concat(user)
    // 判断全选状态
    let checkAll = false, indeterminate = false;
    let has = false;
    let all = true;
    const { value } = this.state;
    const allCheckedList = value.map(item => item.key)
    let checkedList = []
    for (let i = 0; i < plainOptions.length; i++) {
      let o = plainOptions[i]
      for (let j = 0; j < allCheckedList.length; j++) {
        const t = allCheckedList[j]
        if (t === o.value) {
          has = true
          checkedList.push(t)
        } else {
          all = false
        }
      }
    }
    if (checkedList.length && checkedList.length !== plainOptions.length) {
      indeterminate = true
    } if (checkedList.length && checkedList.length === plainOptions.length) {
      checkAll = true
    }
    this.setState({ plainOptions: plainOptions, indeterminate, checkAll, checkedList })
  }
  viewOrg = async (pidData) => {
    const { breadcrumb, checkedList } = this.state;
    // 被选中后禁止点击下一级
    if (checkedList.some(item => item === pidData.id)) {
      return;
    }
    if (pidData.id === "root") {
      classType = ""
      this.setState({ breadcrumb: [pidData], viewType: "org" })

      if (!orgTree || !orgTree.length) {
        this.setState({ loading: true })
        const res = await request("/get/v1/org_user_tree", { method: "GET" })
        if (res && res.code === 0) {
          console.log('res...', res.data)
          res.data = [res.data]
          orgTree = res.data
          this.setState({ loading: false })
          pidData = orgTree[0]
        }

      } else {
        pidData = orgTree[0]
      }

      breadcrumb.splice(breadcrumb.length - 1, 1, pidData);
    } else {
      breadcrumb.push(pidData)
    }
    this.changePlainOptions(pidData)
    this.setState({ breadcrumb: breadcrumb })


  }

  filterSelf = (data) => {
    let { userId } = JSON.parse(localStorage.getItem('userInfo'))
    // var userId = 'G3300'
    return data.reduce((r, c) => {
      if (c.id !== userId) {
        return [
          ...r,
          {
            ...c,
            userNo: c.userNo - 1,
            userList: c.userList && c.userList.length > 0 &&
              this.filterSelf(c.userList)
          }

        ]
      } else {
        return r
      }
    }, [])
  }

  viewRole = async (pidData) => {
    console.log('111', pidData)
    const { breadcrumb, checkedList } = this.state;
    // if (checkedList.some(item => item === pidData.id)) {
    //   return;
    // }
    if (pidData.id === "root") {
      classType = "role"
      this.setState({ breadcrumb: [pidData], viewType: "role" })
      if (!roleTree || !roleTree.length) {
        this.setState({ loading: true })
        const res = await request("/get/v1/prole-user-tree", { method: "GET" })
        if (res && res.code === 0) {
          roleTree = [{ ...pidData, id: "root", list: this.filterSelf(res.data) }]
          this.setState({ loading: false })
          pidData = roleTree[0]
        }

      } else {
        pidData = roleTree[0]
      }

      breadcrumb.splice(breadcrumb.length - 1, 1, pidData);
    } else {
      breadcrumb.push(pidData)
    }
    this.changePlainOptions(pidData)
    this.setState({ breadcrumb: breadcrumb })
  }
  goBack = () => {
    const { breadcrumb } = this.state;
    if (!breadcrumb.length) {
      return;
    }
    breadcrumb.pop();
    this.setState({ breadcrumb: JSON.parse(JSON.stringify(breadcrumb)) })
    if (breadcrumb.length) {
      this.changePlainOptions(breadcrumb[breadcrumb.length - 1])
    }
  }
  goBreadcrumb = (item, index) => {
    const { breadcrumb } = this.state;
    if (!breadcrumb.length) {
      return;
    }
    const news = breadcrumb.slice(0, index + 1);
    this.setState({ breadcrumb: news })
    this.changePlainOptions(news[news.length - 1])
  }

  onCheckAllChange = e => {
    const { plainOptions } = this.state;
    const { value } = this.state;
    const allCheckedList = value.map(item => item.key)
    const values = plainOptions.map((item) => item.value)
    values.map(item => {
      const idx = allCheckedList.indexOf(item);
      if (idx < 0) {
        if (e.target.checked) {

          allCheckedList.push(item)
        }
      } else {
        if (e.target.checked) {
        } else {
          allCheckedList.splice(idx, 1)
        }
      }

    })
    this.changeSearchData(plainOptions, e.target.checked)
    this.getUserData(plainOptions, e.target.checked)
    this.setState({
      checkedList: e.target.checked ? values : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  onChange = checkedList => {
    const { plainOptions, checkedList: oldCheckedList } = this.state;
    const { value } = this.state;
    const allCheckedList = value.map(item => item.key)

    const values = plainOptions.map((item) => item.value)
    const options = []
    let noOption = [];
    for (let i = 0; i < values.length; i++) {
      const idx = allCheckedList.indexOf(values[i]);
      let has = false
      for (let j = 0; j < checkedList.length; j++) {
        if (checkedList[j] === values[i]) {
          // 被选中

          has = true;
          if (idx < 0) {
            // 不存在
            allCheckedList.push(values[i])
          } else {
            // 存在
          }
        } else {
          // 没被选中
          if (idx >= 0) {
            allCheckedList.splice(idx, 1)
          }

        }
      }
      if (has) {

        options.push(plainOptions[i])
      } else {

        noOption.push(plainOptions[i])
      }
    }
    // 当前点击
    const getDiff = (long, short) => {
      return long.filter((item) => {
        return !short.some(itm => itm === item)
      })
    }
    let diff = []; let arr = []
    if (oldCheckedList.length > checkedList.length) {
      // 取消 
      diff = getDiff(oldCheckedList, checkedList)
      arr = plainOptions.filter(itm => itm.value === diff[0])
      this.changeSearchData(arr, false)
      this.getUserData(arr, false)

    } else if (oldCheckedList.length < checkedList.length) {
      // 勾选
      diff = getDiff(checkedList, oldCheckedList)
      arr = plainOptions.filter(itm => itm.value === diff[0])
      this.changeSearchData(arr, true)
      this.getUserData(arr, true)
    }


    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };
  renderChild(data) {
    const { loading, plainOptions, checkedList } = this.state;
    return (
      <Scard style={{ height: "auto", flex: "auto" }}>
        <Spin spinning={loading}>

          <div className={styles.wrap}>
            <div className={styles.all}>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                全部
          </Checkbox>
            </div>
            <CheckboxGroup
              //options={plainOptions}
              value={this.state.checkedList}
              onChange={this.onChange}
            >
              {plainOptions.map((item) => {
                const nextStyle = classNames(styles.next, { [styles.hasChoosed]: checkedList.some(itm => itm === item.value) })
                const checkboxItemStyle = classNames(styles.checkboxItem, { [styles.hasChoosed]: checkedList.some(itm => itm === item.value) })

                return (
                  <div className={checkboxItemStyle} key={item.value}>
                    <Checkbox className={styles.box} value={item.value}>{item.label}</Checkbox>
                    {item.type === "org" ? <div className={nextStyle} onClick={this.viewOrg.bind(this, item.data)}><Icon type="apartment" className={styles.nexticon} />下级</div> : null}

                  </div>
                )

              })}
            </CheckboxGroup>
          </div>
        </Spin>

      </Scard>
    )
  }
  render() {
    const self = this;
    //const children = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

    const { fetching, data, value, breadcrumb, userData, viewType, type } = this.state;
    const viewData = breadcrumb[breadcrumb.length - 1];
    return (
      <Modal
        title="选择人员"
        visible={this.state.visible}
        //forceRender
        bodyStyle={{ padding: 0, height: "calc((100vh - 205px)*3/4)" }}
        onOk={this.handleOk.bind(this)}
        onCancel={this.hide.bind(this)}
        footer={<><Button onClick={this.hide.bind(this)}>取消</Button><Button type="primary" disabled={!userData.length} onClick={this.handleOk.bind(this)}>保存{`(${userData.length}人)`}</Button></>}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <LayoutTreeTable>
          <LayoutTree style={{ width: '50%', padding: "10px" }}>
            <Select
              ref={personSelect => { this.personSelect = personSelect }}
              className={styles.flowModalSelect}
              mode="multiple"
              labelInValue
              value={value}
              placeholder="搜索姓名、电话号码..."
              notFoundContent={fetching ? <Spin size="small" ><div></div></Spin> : null}
              filterOption={false}
              onSearch={type === 'ADD' && this.fetchUser}
              onChange={this.handleChange}
              style={{ width: '100%' }}
              size="large"
            >
              {data && data.map(d => (
                <Option key={d.account}>
                  <div className="userItem">
                    <div className="userName">{d.userName}<span className={styles.accountLine} style={{ fontSize: "14px" }}>{d.account}</span></div>
                    <div className="postName">部门：{d.postName}</div>
                    <div className="orgName">岗位：{d.orgName}</div>
                    <div className="orgName">电话：{d.phone}</div>
                  </div>
                </Option>
              ))}
              {/* {<div style={{ textAlign: 'center', fontSize: "18px", color: "#999", padding: "15px 0" }}>无搜索记录</div>} */}
            </Select>
          </LayoutTree>
          {
            type === 'ADD' &&
            <LayoutTable style={{ width: '50%', padding: "10px" }} className={styles.rightWrap}>

              {breadcrumb.length ?
                <div className={styles.backArea}>
                  <span onClick={this.goBack} className={styles.iconWrap}>
                    <Icon type="left" className={styles.back} />返回
                    </span>
                  <span style={{
                    marginLeft: "15px",
                    marginTop: "-10px",
                    fontWeight: "bold",
                    color: 'rgba(0, 0, 0, 0.85)',
                    // textAlign: "center",
                  }}>{viewType === "org" ? "中核陕西铀浓缩有限公司" : "按角色选择"}</span>

                  {/* <span className={styles.backName}>
                      {breadcrumb[breadcrumb.length - 1].orgName ? breadcrumb[breadcrumb.length - 1].orgName : breadcrumb[breadcrumb.length - 1].roleName}
                    </span> */}
                </div> : <div className={styles.logo}>
                  <img className={styles.logoImg} src={require("@/assets/logo_collapsed_blue.png")}></img>
                  中核陕西铀浓缩有限公司
                  </div>}
              <div className={styles.breadcrumbWrap} style={{
                // margin: "0 0 15px 85px"
              }}>
                <Breadcrumb>
                  {breadcrumb.map((item, index) => {
                    if (index !== 0) {
                      return (<Breadcrumb.Item>
                        {
                          // 如果是最后一个面包屑则没有a
                          breadcrumb.length - 1 === index ?
                            < span>{viewType === "org" ? item.orgName : item.roleName}</span>
                            : < a onClick={this.goBreadcrumb.bind(this, item, index)}>{viewType === "org" ? item.orgName : item.roleName}</a>
                        }
                      </Breadcrumb.Item>)
                    } else {
                      return <Breadcrumb.Item>
                        {
                          breadcrumb.length - 1 === index ?
                            '中核陕西铀浓缩有限公司'
                            :
                            <a onClick={this.goBreadcrumb.bind(this, item, index)}>中核陕西铀浓缩有限公司</a>
                        }
                      </Breadcrumb.Item>
                    }
                  })}
                </Breadcrumb>

              </div>

              {breadcrumb.length ? this.renderChild(viewData) : <div>
                <div className={styles.listItem} onClick={this.viewOrg.bind(this, { id: "root", roleName: "中核陕西铀浓缩有限公司" })}>
                  <span className={styles.icon}></span>按组织架构选择
                  </div>
                <div className={styles.listItem} onClick={this.viewRole.bind(this, { id: "root", roleName: "中核陕西铀浓缩有限公司" })}><span className={styles.icon}></span>按角色选择</div>
                {/* <div className={styles.listItem}><span className={styles.icon}></span>按当前部门选择</div> */}
              </div>}
            </LayoutTable>
          }
          {
            type === 'character' &&
            <LayoutTable style={{ width: '50%', padding: "10px" }} className={styles.rightWrap}>

              {breadcrumb.length > 1 ?
                < div className={styles.backArea}>
                  <span onClick={this.goBack} className={styles.iconWrap}>
                    <Icon type="left" className={styles.back} />返回
                    </span>
                  <span style={{
                    marginLeft: "15px",
                    marginTop: "-10px",
                    fontWeight: "bold",
                    color: 'rgba(0, 0, 0, 0.85)',
                  }}>按角色选择</span>

                  {/* <span className={styles.backName}>
                      {breadcrumb[breadcrumb.length - 1].orgName ? breadcrumb[breadcrumb.length - 1].orgName : breadcrumb[breadcrumb.length - 1].roleName}
                    </span> */}
                </div> :
                <div
                  className={styles.backArea}
                  style={{
                    fontWeight: 'bold',
                    marginLeft: "33px",
                    // textAlign: 'center',
                  }}
                >
                  中核陕西铀浓缩有限公司
                </div>
              }
              <div className={styles.breadcrumbWrap} style={{
                // margin: "0 0 15px 85px"
              }}>
                <Breadcrumb>
                  {breadcrumb.map((item, index) => {
                    if (index !== 0) {
                      return (<Breadcrumb.Item>
                        {
                          // 如果是最后一个面包屑则没有a
                          breadcrumb.length - 1 === index ?
                            < span>{viewType === "org" ? item.orgName : item.roleName}</span>
                            : < a onClick={this.goBreadcrumb.bind(this, item, index)}>{viewType === "org" ? item.orgName : item.roleName}</a>
                        }
                      </Breadcrumb.Item>)
                    } else {
                      return <Breadcrumb.Item >
                        {
                          breadcrumb.length - 1 === index ?
                            '可选择角色'
                            :
                            <a onClick={this.goBreadcrumb.bind(this, item, index)}>可选择角色</a>
                        }

                      </Breadcrumb.Item>
                    }
                  })}
                </Breadcrumb>

              </div>
              {
                this.renderChild(viewData)
              }
            </LayoutTable>
          }
          {
            type === 'user' &&
            <LayoutTable style={{ width: '50%', padding: "10px" }} className={styles.rightWrap}>
              <div
                className={styles.backArea}
                style={{
                  fontWeight: 'bold',
                  marginLeft: "33px",
                  color: 'rgba(0, 0, 0, 0.85)',
                }}
              >
                中核陕西铀浓缩有限公司
              </div>
              <div className={styles.breadcrumbWrap} style={{
                // margin: "0 0 15px 85px"
              }}>
                <Breadcrumb>
                  {breadcrumb.map((item, index) => {
                    if (index !== 0) {
                      return (<Breadcrumb.Item>
                        {
                          // 如果是最后一个面包屑则没有a
                          breadcrumb.length - 1 === index ?
                            < span>{viewType === "org" ? item.orgName : item.roleName}</span>
                            : < a onClick={this.goBreadcrumb.bind(this, item, index)}>{viewType === "org" ? item.orgName : item.roleName}</a>
                        }

                      </Breadcrumb.Item>)
                    } else {
                      return <Breadcrumb.Item >
                        {
                          breadcrumb.length - 1 === index ?
                            '可选择用户'
                            :
                            <a onClick={this.goBreadcrumb.bind(this, item, index)}>可选择用户</a>
                        }
                      </Breadcrumb.Item>
                    }
                  })}
                </Breadcrumb>

              </div>
              {
                this.renderChild(viewData)
              }
            </LayoutTable>
          }

        </LayoutTreeTable>




      </Modal >)
  }
}

export default PersonModal;