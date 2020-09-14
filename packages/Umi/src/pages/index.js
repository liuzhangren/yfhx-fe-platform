import React, { Component } from 'react';
import { connect } from 'dva';

import {
  Row,
  Col,
  Icon,
  Form,
  message,
  Spin,
  Tabs,
  Menu,
  Input,
  Radio,
  Badge,
  Tooltip,
  Tag,
  Progress,
} from 'antd';
import { Confirm, Icon as Iconf, Scard, Modal } from 'view';

import MenuForm from '@/components/Home/MenuForm';
import Table from '@/components/Alink/SingleTable';
import SingleTableWrap from '@/components/Alink/SingleTable/SingleTableWrap';
import { ViewRow } from '@/components/Alink/Table/Table';
// import FlowModal from '@/components/FlowModal';
// import ShiftChangeModal from '@/components/DutyManagement/shiftChangeModal';
import { template } from 'lodash';
import cardImg_4 from '../assets/device.png';
import cardImg_3 from '../assets/fault_99.png';
import cardImg_2 from '../assets/report.png';
import cardImg from '../assets/report-dev.png';
import styles from './index.less';
import starIcon from '../assets/star-active.svg'
import noStarIcon from '../assets/star.svg'

const { TabPane } = Tabs;
const { SubMenu } = Menu;
@Form.create()
class MenuColumnModal extends Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
    filterItem: {},
    valueCategoryId: '',
    shiftChangeModalType: '',
    isManage: false,
  };

  componentDidMount() {
    this.props.onInit(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entryMenuResource) {
      this.navInit()
    }
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  selectResource(values) {
    // 菜单选择
    const self = this;
    const { entryMenuResource } = this.props;
    let selectId = '';

    if (values) selectId = JSON.parse(JSON.stringify(values)).pop();
    let filterItem = [];
    const filter = resource => {
      resource.map(({ id, list, url, resourceName: moduleName, icon }) => {
        if (id === selectId) {
          filterItem = { url, moduleName, icon: icon || 'bars' };
          return;
        }
        if (list && Array.isArray(list) && list.length > 0) filter(list);
      });
      return filterItem;
    };
    this.setState({
      filterItem: filter(entryMenuResource),
    });
  }

  handleOk() {
    const self = this;
    // self.menuForm.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     const confirm = self.props.confirm || function () { };
    //     if (self.state.type === 'ADD') {
    //       const { filterItem } = this.state;
    //       confirm({ ...filterItem }, self.state.type);
    //     }
    //   }
    // });
    this.hide()
  }

  hide() {
    this.setState({
      visible: false,
    });
  }

  show(type) {
    this.setState(
      {
        visible: true,
        type,
        filterItem: {},
      },
      () => {
        // this.menuForm.props.form.resetFields();
      },
    );
  }

  getData = (list, obj, i) => {
    // var temp = [
    // ]
    // list.forEach((item, index) => {
    //   // var arr = [{ ...item }]
    //   // console.log('arr', arr)
    //   item.list.forEach((_item, _index) => {
    //     var arr = []
    //     temp.push(arr)
    //     console.log(temp)
    //     _item.list.forEach((__item, __index) => {
    //       arr.push(__item)
    //     })
    //     console.log('temp->>>', temp)
    //   })
    // })
    // list.forEach((c, index) => {
    //   if (c.list.length > 0) {
    //     obj[index] = []
    //     obj[index].push(...c.list)
    //     i++
    //     this.getData(c.list, obj, i)
    //     if (i > 1) {
    //       obj[index].push(...c.list)
    //     }
    //   }
    // })
    // return obj
  }

  navInit = () => {
    const { entryMenuResource } = this.props
    this.setState({
      entryMenuResource,
    })
  }

  navOnmouseover = item => {
    // console.log(123, item)
  }

  addUseFunc = (e, obj) => {
    const { icon, resourceName, url } = obj
    const confirm = this.props.confirm || function () { };
    const delConfirm = this.props.delConfirm || function () { };
    if (obj.common == 1) {
      confirm({ icon: icon || 'file', moduleName: resourceName, url }, this.state.type);
    } else {
      delConfirm(e, obj.commonId, obj.resourceName, 'del')
    }
  }


  /**
   * @description: 递归渲染 navDom
   * @param {Array}
   * @return:
   */
  mapNavDomInit = data => (
    data.map(itemChildren => (
      <div >
        <div className={styles.text} style={{ color: 'red' }} onClick={e => { this.addUseFunc(e, itemChildren) }} onMouseOver={this.navOnmouseover}>
          {itemChildren.title}
          <img className={styles.starIcon} src={itemChildren.common == 0 ? starIcon : noStarIcon} style={{ width: '20px', marginLeft: '5px' }} />
        </div>
        {
          // itemChildren.children.length > 0 &&
          // this.mapNavDomInit(itemChildren.children)
        }
      </div>
    ))
  )

  calculationCount = (data, count) => {
    let c = count
    c += data.list.length
    data.list.forEach((item, index) => {
      c += item.list.length
      this.calculationCount(item, c)
    })
    // console.log('c->>>', c)
    return c
  }

  modFloat = v => {
    const _max = parseInt(v) + 1;
    if (_max - v < 1) {
      return _max;
    }
    return v;
  }

  render() {
    const { entryMenuResource } = this.state

    return (
      <div id="root">
        <Modal
          title="常用功能入口信息"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          forceRender
          okText="确定"
          cancelText="取消"
          confirmLoading={this.props.loading}
          isFull
          destroyOnClose
          footer={null}
        >
          <div className={styles.allBox}>
            {
              entryMenuResource &&
              entryMenuResource.map(item => (
                <div className={styles.modalBox} style={{
                  width: this.modFloat((this.calculationCount(item, 0) / 16)) === 0 ? 250 : this.modFloat((this.calculationCount(item, 0) / 16)) * 250,
                }}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.textBox}>
                    {
                      item.children.map(_item => (
                        <div className={styles.nextBox}>
                          {
                            _item.resourceType === 1 &&
                            <div className={styles.nextText}
                              // onClick={(e) => { this.addUseFunc(e, _item) }}
                              onMouseOver={this.navOnmouseover}>
                              {_item.title}
                              {
                                _item.common == 0 ?
                                  <img className={styles.starIcon} onClick={e => { this.addUseFunc(e, _item) }} src={starIcon} style={{ width: '20px', marginLeft: '5px' }} />
                                  :
                                  <img className={styles._img} onClick={e => { this.addUseFunc(e, _item) }} src={noStarIcon} style={{ width: '20px', marginLeft: '5px' }} />
                              }
                            </div>
                          }
                          {
                            _item.children.map(__item => (
                              <div className="box" className={styles.text} onMouseOver={this.navOnmouseover.bind(this, __item)}>
                                {__item.title}
                                {
                                  __item.resourceType === 1 &&
                                  (
                                    __item.common === 0 ?
                                      <img className={styles.starIcon} onClick={e => { this.addUseFunc(e, __item) }} src={starIcon} style={{ width: '20px', marginLeft: '5px' }} />
                                      :
                                      <img className={styles._img} onClick={e => { this.addUseFunc(e, __item) }} src={noStarIcon} style={{ width: '20px', marginLeft: '5px' }} />
                                  )

                                }
                              </div>
                            ))
                          }
                        </div>
                      ))
                    }
                    {/* {
                        item.children.length > 0 &&
                        this.mapNavDomInit(item.children)
                      } */}
                  </div>
                </div>
              ))
            }
          </div>
          {/* <Spin spinning={this.props.loading}>
            <MenuForm
              onRef={form => (this.menuForm = form)}
              type={this.state.type}
              entryMenuResource={this.props.entryMenuResource}
              selectResource={this.selectResource.bind(this)}
              icon={this.state.filterItem.icon}
            />
          </Spin> */}
        </Modal>
      </div>
    );
  }
}

class Workbench extends Component {
  columnsWarn = [
    {
      dataIndex: 'flowTitle',
      title: '预警状态',
      sorter: true,
      render: (text, record, index) => <Tag color="red">危险</Tag>,
    },
    {
      dataIndex: 'flowInitiator',
      title: '设备编号',
      sorter: true,
    },
    {
      dataIndex: 'startTime',
      title: '设备名',
      sorter: true,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 50,
      render: (text, record) => {
        const arr = [];
        arr.push([<ViewRow />]);
        return arr;
      },
    },
  ];

  columnsDone = [
    // 已完成
    {
      dataIndex: 'flowTitle',
      title: '流程名称',
      sorter: true,
    },
    {
      dataIndex: 'flowInitiator',
      title: '流程发起人',
      sorter: true,
      width: 180,
    },
    {
      dataIndex: 'startTime',
      title: '流程开始时间',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'endTime',
      title: '流程结束时间',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      width: 50,
      fixed: 'right',
      align: 'center',
      render: (text, record) => {
        const arr = [];
        if (record.flowKey === 'changeTest') {
          arr.push(
            <Tooltip title="查看">
              <a
                onClick={e => {
                  e.stopPropagation();
                  this.handleTask(record, 'view');
                }}
              >
                <Icon type="search" />
              </a>
            </Tooltip>,
          );
        } else {
          arr.push([<ViewRow modal={this.flowModal} record={record} />]);
        }
        return arr;
      },
    },
  ];

  columnsInHand = [
    // 已审批
    {
      dataIndex: 'id',
      title: '任务编号',
      sorter: true,
    },
    {
      dataIndex: 'taskName',
      title: '任务名称',
      width: 300,
      sorter: true,
    },
    {
      dataIndex: 'categoryName',
      title: '所属模块',
      width: 120,
      sorter: true,
    },
    {
      dataIndex: 'flowTitle',
      title: '流程标题',
      width: 300,
      sorter: true,
    },
    {
      dataIndex: 'handler',
      title: '当前处理人',
      sorter: true,
      width: 180,
    },
    {
      dataIndex: 'startTime',
      title: '任务到达时间',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      width: 50,
      fixed: 'right',
      align: 'center',
      render: (text, record) => {
        const arr = [];
        if (record.flowKey === 'changeTest') {
          arr.push(
            <Tooltip title="查看">
              <a
                onClick={e => {
                  e.stopPropagation();
                  this.handleTask(record, 'view');
                }}
              >
                <Icon type="search" />
              </a>
            </Tooltip>,
          );
        } else {
          arr.push(<ViewRow modal={this.flowModal} record={record} />);
        }
        return arr;
      },
    },
  ];

  columnsPlan = [
    // 待办
    {
      dataIndex: 'id',
      title: '任务编号',
      sorter: true,

    },
    {
      dataIndex: 'taskName',
      title: '任务名称',
      width: 300,
      sorter: true,
    },
    {
      dataIndex: 'categoryName',
      title: '所属模块',
      sorter: true,
    },
    {
      dataIndex: 'flowTitle',
      title: '流程标题',
      width: 300,
      sorter: true,
    },
    {
      dataIndex: 'startTime',
      title: '任务到达时间',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 50,
      render: (text, record) => {
        const arr = [];
        arr.push([
          <Tooltip title="处理">
            <a
              onClick={e => {
                e.stopPropagation();
                this.handleTask(record, 'handle');
                // this.handleTask(record, 'view');
              }}
            >
              <Icon type="right-circle" />
            </a>
          </Tooltip>,
        ]);
        return arr;
      },
    },
  ];

  columnsMyself = [
    // 我发起的
    // {
    //   dataIndex: 'id',
    //   title: '流程编号',
    //   sorter: true,
    //   width: 80,
    // },
    {
      dataIndex: 'name',
      title: '流程标题',
      width: 300,
      sorter: true,
    },
    // {
    //   dataIndex: 'handler',
    //   title: '当前处理人',
    //   sorter: true,
    // },
    {
      dataIndex: 'startTime',
      title: '流程开始时间',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'endTime',
      title: '流程结束时间',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'taskName',
      title: '当前任务名称',
      sorter: true,
      width: 300,
    },
    {
      dataIndex: 'handler',
      title: '当前处理人',
      sorter: true,
      width: 160,
    },
    {
      dataIndex: 'test',
      title: '流程状态',
      sorter: true,
      width: 100,
      render: (text, record) => <span>{record.endTime ? '已完结' : '处理中'}</span>,
    },
    {
      dataIndex: 'operate',
      title: '操作',
      width: 50,
      fixed: 'right',
      align: 'center',
      render: (text, record) => {
        const arr = [];
        if (record.flowKey === 'changeTest') {
          arr.push(
            <Tooltip title="查看">
              <a
                onClick={e => {
                  e.stopPropagation();
                  this.handleTask(record, 'view');
                }}
              >
                <Icon type="search" />
              </a>
            </Tooltip>,
          );
        } else {
          arr.push(<ViewRow record={record} modal={this.flowModal} />);
        }
        return arr;
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      hoverId: '',
      searchMenuTitle: '', // 流程分类搜索
      categoryId: '', // 流程分类id
      taskType: 'plan', // 任务类型选中参数
      isManage: false,
      taskListType: [
        // 任务类型
        { label: '待审批任务', key: 'plan' },
        { label: '办理中任务', key: 'inHand' },
        { label: '我发起的流程', key: 'mySelf' },
        { label: '已完成的任务', key: 'done' },
      ],
      planNum: 0,
      inHandNum: 0,
      mySelfNum: 0,
      doneNum: 0,
      planLoading: false,
      inHandLoading: false,
      mySelfLoading: false,
      doneLoading: false,
    };
  }

  async componentDidMount() {
    const self = this;
    const { taskListType } = self.state;
    const { dispatch } = self.props;
    self.getUserInfo()
    self.getEntryList();
    self.getEntryMenuResource();
    // self.getFlowTree();

    dispatch({
      type: 'home/getHeaderInfo',
      payload: {},
    })

    if (self.tb) {
      self.tb.refresh({ page: 1, limit: 30 });
    }

    if (self.tb2) {
      self.tb2.refresh({ page: 1, limit: 30 });
    }
    // taskListType.forEach(itm => {
    //   self.getTaskCount(itm.key, '');
    // });
  }

  getUserInfo = () => {
    const { userId } = JSON.parse(localStorage.getItem('userInfo'))
    this.setState({
      isManage:
        (userId === 'admin') ||
        (userId === 'system') ||
        (userId === 'security')
        || (userId === 'safety'),
    })
  }

  // 流程分类树选中(我的任务)
  onFlowMenuSelect({ key }) {
    const self = this;
    const { categoryId, taskType } = self.state;
    self.setState(
      {
        // 取消选中判断
        categoryId: key !== categoryId ? key : '',
      },
      () => {
        self.tb.refresh({ page: 1, limit: 30, categoryId: key !== categoryId ? key : '' });
        self.getTaskCount(taskType, key !== categoryId ? key : '');
      },
    );
  }

  // 获取流程分类树(我的任务)
  getFlowTree() {
    const self = this;
    const { dispatch } = self.props;
    dispatch({
      type: 'home/getFlowTree',
      payload: {},
    });
  }

  // 获取任务列表统计(我的任务)
  getTaskCount(taskType, categoryId) {
    const self = this;
    const { dispatch } = self.props;
    self.setState({
      [`${taskType}Loading`]: true,
    });
    dispatch({
      type: 'home/getTaskCount',
      payload: { taskType, categoryId },
      callBack: res => {
        if (res) {
          self.setState({
            [`${taskType}Num`]: res.data,
            [`${taskType}Loading`]: false,
          });
        }
      },
    });
  }

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

  // 流程任务处理完成后的回调(我的任务)
  handleTaskCallBack = () => {
    const self = this;
    const { taskType, categoryId } = self.state;
    self.getTaskCount(taskType, categoryId);
    self.tb.refresh({ page: 1, limit: 30, categoryId });
  };

  // 获取任务列表(我的任务)
  // getTaskList(){
  // 	const self = this;
  // 	const { dispatch } = self.props;
  // 	const {taskType,categoryId} = self.state
  // 	dispatch({
  // 		type: 'home/getTaskList',
  // 		payload: {taskType,categoryId,limit:30,page:1},
  // 	})
  // }

  // 切换任务类型的查询(我的任务)
  checkRadioChange = e => {
    const { categoryId } = this.state;
    this.setState(
      {
        taskType: e.target.value,
      },
      () => {
        this.tb.refresh({ page: 1, limit: 30, categoryId });
        // this.getTaskCount(e.target.value, categoryId);
      },
    );
  };

  menuItemFetch = id => {
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
      })
  }

  // 常用功能入口跳转(入口)
  openTabs = tabsActiveKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/putTabs',
      payload: {
        tabsActiveKey,
      },
    });
  };

  // 删除常用功能入口(入口)
  handleDelEntry(e, id, name, del) {
    if (e) e.stopPropagation();
    const self = this;
    const { dispatch } = self.props;
    if (del == 'del') {
      dispatch({
        type: 'home/handleDelOneEntry',
        payload: id,
        callBack: res => {
          if (res && res.success) {
            // self.menuModal.hide();
            message.success(`删除${name}功能入口成功`);
            self.getEntryList();
            self.getEntryMenuResource()
            if (self.props.menu.menuActiveId) {
              self.menuItemFetch(self.props.menu.menuActiveId)
            }
          }
        },
      });
    } else {
      Confirm({
        title: `您确定要删除${name}功能入口吗?`,
        content: '',
        onOk() {
          dispatch({
            type: 'home/handleDelOneEntry',
            payload: id,
            callBack: res => {
              if (res && res.success) {
                // self.menuModal.hide();
                message.success(`删除${name}功能入口成功`);
                self.getEntryList();
                self.getEntryMenuResource()
                if (self.props.menu.menuActiveId) {
                  self.menuItemFetch(self.props.menu.menuActiveId)
                }
              }
            },
          });
        },
        onCancel() {
        },
      });
    }
  }

  // 添加常用功能入口(入口)
  handleAddEntry(payload, type) {
    const self = this;
    const { dispatch } = self.props;
    if (type === 'ADD') {
      dispatch({
        type: 'home/handleAddOneEntry',
        payload,
        callBack: res => {
          if (res && res.success) {
            // self.menuModal.hide();
            message.success('添加常用功能入口成功!');
            self.getEntryList();
            self.getEntryMenuResource()
            if (self.props.menu.menuActiveId) {
              self.menuItemFetch(self.props.menu.menuActiveId)
            }
          } else {
            self.menuModal.setState({
              filterItem: {},
            });
            this.menuModal.menuForm.props.form.resetFields();
          }
        },
      });
    }
  }

  // 流程任务处理(我的任务)
  handleTask(record, type) {
    const self = this;
    const { flowKey, id, definitionId } = record;
    if (flowKey === 'changeTest') {
      this.setState(
        {
          shiftChangeModalType: type === 'view' ? 'close' : '',
        },
        () => {
          self.shiftChangeModal.show(
            'carryOn',
            { ...record, dutyRecordId: record.formId, taskOption: { taskId: id, definitionId } },
            type === 'view' ? 'close' : '',
          );
        },
      );
    } else {
      self.flowModal.show(type, record);
    }
  }

  // 处理流程分类菜单(我的任务)
  getNavMenuItems(menusData) {
    if (!menusData) return [];
    return menusData
      .filter(item => item.name)
      .map((item, index) => this.getSubMenuOrItem(item, index));
  }

  // 获取流程分类menu(我的任务)
  getSubMenuOrItem(item) {
    const self = this;
    if (item.children && item.children.length) {
      return (
        <SubMenu title={item.name} key={item.id} onTitleClick={({ key, domEvent }) => { }}>
          {item.children.map(itm => this.getSubMenuOrItem(itm))}
        </SubMenu>
      );
    }
    return (
      <Menu.Item key={item.id} onClick={() => { }} title={item.name}>
        {item.name}
      </Menu.Item>
    );
  }

  // 搜索流程分类菜单(我的任务)
  getSearchMenu(menuData, searchString) {
    const data = [];
    menuData.map(element => {
      if (element.name.indexOf(searchString) >= 0) {
        data.push(element);
      } else if (element.children && element.children.length > 0) {
        element.children = this.getSearchMenu(element.children, searchString);
        if (element.children.length > 0) {
          data.push(element);
        }
      }
    });
    return data;
  }

  // 处理流程分类菜单(我的任务)
  renderMenuData(menuData) {
    const { searchMenuTitle } = this.state;
    let data = [];
    const expandKeys = [];
    if (searchMenuTitle) {
      data = this.getSearchMenu(JSON.parse(JSON.stringify(menuData)), searchMenuTitle);
      data.map(item => {
        expandKeys.push(item.id);
      });
    } else {
      data = menuData;
    }
    if (!data.length) {
      return (
        <div style={{ textAlign: 'center', color: '#999', padding: '10px 0' }}>无符合条件目录</div>
      );
    }
    return data.filter(item => item.name).map((item, index) => this.getSubMenuOrItem(item, index));
  }

  // 表格渲染(我的任务)
  renderTable() {
    const self = this;
    const { taskType } = self.state;
    const { baseHeight } = self.props;
    const option = {
      plan: { columns: this.columnsPlan, link: '/process/v2/flowTask/planTaskList' },
      done: { columns: this.columnsDone, link: '/process/v2/flowTask/doneTaskList' },
      inHand: { columns: this.columnsInHand, link: '/process/v2/flowTask/inHandTaskList' },
      mySelf: { columns: this.columnsMyself, link: '/process/v2/flowTask/findTaskByMyself' },
    };
    return (
      <SingleTableWrap style={{ padding: '0' }}>
        <Table
          link={option[taskType].link}
          bordered
          isSpin
          scroll={{ y: ((baseHeight - 20) / 12) * 5 - 144.5 }}
          ref={tb => {
            self.tb = tb;
          }}
          columns={option[taskType].columns}
          showPagination={false}
          checkable={false}
          afterGetData={(records, newParam, pagination) => {
            if (self.state.taskType === 'plan') {
              self.setState({
                planTotal: pagination.total,
              })
            }
          }}
          beforeSetData={data => {
            if (taskType !== 'done') {
              return data;
            }
            return data.reduce((r, c) => {
              c.id = c.flowInstId;
              c.key = c.flowInstId;
              return [...r, c];
            }, []);
          }}
        />
      </SingleTableWrap>
    );
  }

  render() {
    const self = this;
    const {
      baseHeight,
      home: {
        entryList,
        entryMenuResource,
        headerInfo: {
          equipTotalNum,
          equipAddNum,
          equipScrapNum,
        },
      },
    } = self.props;

    const { taskType, taskListType, categoryId } = self.state;
    return (
      <>
        {
          this.state.isManage ?
            <div style={{
              fontWeight: 'bolder',
              fontSize: '30px',
              textAlign: 'center',
              marginTop: '15%',
            }}>
              欢迎使用生产管理支持平台 | 生产支持系统
            </div>
            :
            <div className={styles.IndexWrap}>
              <div className={styles.moduleHeader} style={{ height: (baseHeight - 20) / 6 }}>
                <div className={styles.moduleHeader_wapper}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div className={styles.moduleHeader_wapper_left}>
                      <img src={cardImg} className={styles.moduleHeader_img} alt="" />
                    </div>
                    <div className={styles.moduleHeader_wapper_rigth}>
                      <div className={styles.moduleHeader_wapper_content}>
                        <span className={styles.moduleHeader_hdr}>设备完好率</span>
                        <span className={styles.moduleHeader_num}>80%</span></div>
                    </div></div>
                </div>

                <div className={styles.moduleHeader_wapper}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div className={styles.moduleHeader_wapper_left}>
                      <img src={cardImg_2} className={styles.moduleHeader_img} />
                    </div>
                    <div className={styles.moduleHeader_wapper_rigth}>
                      <div className={styles.moduleHeader_wapper_content}>
                        <span className={styles.moduleHeader_hdr}>设备总数</span>
                        <span className={styles.moduleHeader_num}>{equipTotalNum}</span></div>
                    </div>
                  </div>

                </div>

                <div className={styles.moduleHeader_wapper}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div className={styles.moduleHeader_wapper_left}>
                      <img src={cardImg_3} className={styles.moduleHeader_img} />
                    </div>
                    <div className={styles.moduleHeader_wapper_rigth}>
                      <div className={styles.moduleHeader_wapper_content}>
                        <span className={styles.moduleHeader_hdr}>今年新增设备</span>
                        <span className={styles.moduleHeader_num}>{equipAddNum}</span></div>
                    </div>

                  </div>
                </div>

                <div className={styles.moduleHeader_wapper}>
                  <div style={{ display: 'flex', height: '100%' }}>

                    <div className={styles.moduleHeader_wapper_left}>
                      <img src={cardImg_4} className={styles.moduleHeader_img} />
                    </div>
                    <div className={styles.moduleHeader_wapper_rigth}>
                      <div className={styles.moduleHeader_wapper_content}>
                        <span className={styles.moduleHeader_hdr}>今年报废设备</span>
                        <span className={styles.moduleHeader_num}>{equipScrapNum}</span></div>
                    </div>
                  </div>
                </div>

              </div>
              <div className={styles.muduleWrap} style={{ height: ((baseHeight - 20) / 12) * 5 - 10 }}>
                {/* 我的任务 */}
                <div className={styles.muduleWrap_dealt}>
                  <Tabs
                    defaultActiveKey="dealt"
                    tabBarExtraContent={
                      <span
                        onClick={() => {
                          self.openTabs('/Workbench/MyWorkbench');
                        }}
                      >
                        更多
                  <Icon type="right-circle" />
                      </span>
                    }
                  >
                    <TabPane
                      tab={
                        <span>
                          {' '}
                          <Icon type="form" />
                    我的任务
                  </span>
                      }
                      key="dealt"
                    >
                      <Row style={{ marginTop: '8px' }}>
                        {/* <Col span={3} className={styles.muduleWrap_dealt_tree}>
                    <div style={{ padding: '5px' }}>
                      <Input.Search
                        onChange={e => {
                          self.setState({ searchMenuTitle: e.target.value });
                        }}
                      />
                    </div>
                    <Spin spinning={self.props.loading.effects['home/getFlowTree']}>
                      <Scard style={{ height: ((baseHeight - 20) / 12) * 5 - 115 }}>
                        <Menu
                          onClick={self.onFlowMenuSelect.bind(this)}
                          style={{ width: '100%' }}
                          mode="inline"
                          selectedKeys={[categoryId]}
                        >
                          {self.renderMenuData(self.props.home.menuData)}
                        </Menu>
                      </Scard>
                    </Spin>
                  </Col> */}
                        <Col span={24} className={styles.muduleWrap_dealt_table}>
                          <div style={{ marginBottom: '9px' }}>
                            <Radio.Group
                              defaultValue={taskType}
                              size="middle"
                              name="radiogroup"
                              onChange={self.checkRadioChange.bind(this)}
                            >
                              {taskListType &&
                                taskListType.length &&
                                taskListType.map((itm, idx) => {
                                  if (idx === 0) {
                                    return (
                                      <Radio.Button value={itm.key}>
                                        {itm.label}
                                        {self.state[`${itm.key}Loading`] ? (
                                          <Icon
                                            type="loading"
                                            style={{
                                              fontSize: '20px',
                                              verticalAlign: 'middle',
                                              marginLeft: '5px',
                                            }}
                                          />
                                        ) : (
                                            <Badge
                                              overflowCount={30}
                                              count=
                                              {
                                                self.state.planTotal
                                                // this.state[`${itm.key}Num`]
                                              }
                                              style={{ backgroundColor: '#0066ff', margin: '-1px 0 0 5px' }}
                                            />
                                          )}
                                      </Radio.Button>
                                    );
                                  }
                                  return (
                                    <Radio.Button value={itm.key}>
                                      {itm.label}
                                      {self.state[`${itm.key}Loading`] ? (
                                        <Icon
                                          type="loading"
                                          style={{
                                            fontSize: '20px',
                                            verticalAlign: 'middle',
                                            marginLeft: '5px',
                                          }}
                                        />
                                      ) : null}
                                    </Radio.Button>
                                  );
                                })}
                            </Radio.Group>
                          </div>
                          {taskType && this.renderTable()}
                          {/* <FlowModal
                            ref={ref => (this.flowModal = ref)}
                            onCallBack={this.handleTaskCallBack}
                          /> */}

                          {/* 交接班 */}
                          {/* <ShiftChangeModal
                            onInit={ref => (this.shiftChangeModal = ref)}
                            valueCategoryId={this.state.valueCategoryId}
                            handleClearUserTable={this.handleClearUserTable}
                            onCallBack={this.handleTaskCallBack}
                            shiftChangeModalType={this.state.shiftChangeModalType}
                          /> */}
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </div>
                {/* 常用功能入口 */}
                <div className={styles.muduleWrap_entry}>
                  <Tabs defaultActiveKey="entry">
                    <TabPane
                      tab={
                        <span>
                          {' '}
                          <Icon type="export" />
                    常用功能入口
                  </span>
                      }
                      key="entry"
                    >
                      <div style={{
                        height: ((baseHeight - 20) / 12) * 5 - 50,
                        overflowY: 'auto',
                      }}>
                        <Spin spinning={self.props.loading.effects['home/getEntryList']}>
                          {/* <Row gutter={32} > */}
                          {entryList &&
                            !!entryList.length &&
                            entryList.map(itm => (
                              <Col
                                span={8}
                                onMouseOver={() => self.setState({ hoverId: itm.id })}
                                onMouseLeave={() => self.setState({ hoverId: '' })}
                                onClick={() => {
                                  self.openTabs(itm.url);
                                }}
                              >
                                <div className="muduleWrap_entry_conetnt_col">
                                  <p>
                                    <Iconf type={itm.icon} />
                                  </p>
                                  <p>{itm.moduleName}</p>
                                  {this.state.hoverId === itm.id && (
                                    <span>
                                      <Icon
                                        type="close-circle"
                                        onClick={e => {
                                          self.handleDelEntry(e, itm.id, itm.moduleName);
                                        }}
                                      />
                                    </span>
                                  )}
                                </div>
                              </Col>
                            ))}
                          <Col span={8}>
                            <div
                              className="muduleWrap_entry_conetnt_col"
                              onClick={() => self.menuModal.show('ADD')}
                            >
                              <p>
                                <Icon type="plus-square" style={{ color: '#6b97d9' }} />
                              </p>
                            </div>
                          </Col>
                          <MenuColumnModal
                            onInit={menuModal => {
                              self.menuModal = menuModal;
                            }}
                            loading={self.props.loading.global}
                            confirm={self.handleAddEntry.bind(this)}
                            delConfirm={self.handleDelEntry.bind(this)}
                            entryMenuResource={entryMenuResource}
                            entryList={entryList}
                          />
                          {/* </Row> */}
                        </Spin>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>

              </div>
              <div className={styles.muduleWrap} style={{ height: ((baseHeight - 20) / 12) * 5 - 10, marginTop: '10px' }}>
                {/* 预警信息 */}
                <div className={styles.muduleWrap_error}>
                  <Tabs
                    defaultActiveKey="error"
                  >
                    <TabPane
                      tab={
                        <span>
                          {' '}
                          <Icon type="warning" />
                    预警信息展示
                  </span>
                      }
                      key="error"
                    >
                      <div className={styles.moduleWarn} style={{ height: (baseHeight / 12) * 5 - 60 }}>
                        <div className={styles.moduleWarn_wapper}>
                          <span className={styles.moduleWarn_icon} style={{ color: '#4baf4f' }}>
                            <Iconf type="icon-biaoqian" />
                          </span>
                          <div style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>

                            <div className={styles.moduleWarn_num} style={{ color: '#4baf4f' }}>
                              12531
                      </div>
                            <div className={styles.moduleWarn_hrd}>
                              <span className={styles.moduleWarn_hrd_itm}>
                                设备正常
                        </span>
                            </div>
                            <div className={styles.moduleWarn_more}>
                              <span className={styles.moduleWarn_more_itm}>
                                更多详情
                      </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.moduleWarn_wapper}>
                          <span className={styles.moduleWarn_icon} style={{ color: '#02a8f4' }}>
                            <Iconf type="icon-biaoqian" />
                          </span>
                          <div style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                            <div className={styles.moduleWarn_num} style={{ color: '#02a8f4' }}>
                              20
                    </div>
                            <div className={styles.moduleWarn_hrd}>
                              <span className={styles.moduleWarn_hrd_itm}>
                                设备异常
                      </span>
                            </div>
                            <div className={styles.moduleWarn_more}>
                              <span className={styles.moduleWarn_more_itm}>
                                更多详情
                      </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.moduleWarn_wapper}>
                          <span className={styles.moduleWarn_icon} style={{ color: '#fd7200' }}>
                            <Iconf type="icon-biaoqian" />
                          </span>
                          <div style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                            <div className={styles.moduleWarn_num} style={{ color: '#fd7200' }}>
                              2
                    </div>
                            <div className={styles.moduleWarn_hrd}>
                              <span className={styles.moduleWarn_hrd_itm}>
                                设备报警
                      </span>
                            </div>
                            <div className={styles.moduleWarn_more}>
                              <span className={styles.moduleWarn_more_itm}>
                                更多详情
                      </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.moduleWarn_wapper}>
                          <span className={styles.moduleWarn_icon} style={{ color: '#fd0000' }}>
                            <Iconf type="icon-biaoqian" />
                          </span>
                          <div style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                            <div className={styles.moduleWarn_num} style={{ color: '#fd0000' }}>
                              0
                    </div>
                            <div className={styles.moduleWarn_hrd}>
                              <span className={styles.moduleWarn_hrd_itm}>
                                设备检修
                      </span>
                            </div>
                            <div className={styles.moduleWarn_more}>
                              <span className={styles.moduleWarn_more_itm}>
                                更多详情
                      </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPane >
                  </Tabs >
                </div >
                {/* 工作管理 */}
                <div className={styles.muduleWrap_message}>
                  <Tabs
                    defaultActiveKey="error"
                  >
                    <TabPane
                      tab={
                        <span>
                          {' '}
                          <Iconf type="icon-weixiu" />
                    工作管理
                  </span>
                      }
                      key="error"
                    >
                      <div className={styles.moduleWkmanager}>
                        <div className={styles.moduleWkmanager_content} style={{ height: (baseHeight / 12) * 5 - 80 }}>
                          <div className={styles.moduleWkmanager_wapper}>
                            <div style={{ fontSize: '14px', paddingBottom: '0px' }}>未处理委托单</div>
                            <div style={{ width: '80%', display: 'inline-block' }}>
                              <Progress percent={30} showInfo={false}></Progress>
                            </div>
                            <span className={styles.moduleWkmanager_num}>5</span>
                          </div>
                          <div className={styles.moduleWkmanager_wapper}>
                            <div style={{ fontSize: '14px', paddingBottom: '0px' }}>待开工数量</div>
                            <div style={{ width: '80%', display: 'inline-block' }}>
                              <Progress percent={30} strokeColor="#5db761" showInfo={false}></Progress>
                            </div>
                            <span className={styles.moduleWkmanager_num}>5</span>
                          </div>
                          <div className={styles.moduleWkmanager_wapper}>
                            <div style={{ fontSize: '14px', paddingBottom: '0px' }}>实施中数量</div>
                            <div style={{ width: '80%', display: 'inline-block' }}>
                              <Progress percent={60} strokeColor="orange" showInfo={false}></Progress>
                            </div>
                            <span className={styles.moduleWkmanager_num}>20</span>
                          </div>
                        </div>
                      </div>
                    </TabPane>
                  </Tabs>


                </div >

              </div >
            </div>
        }
      </>

    );
  }
}
export default connect(({ global, menu, loading, home, runDutyManagement, user }) => ({
  baseHeight: global.contentHeight,
  loading,
  home,
  runDutyManagement,
  menu,
  user,
}))(props => <Workbench {...props} />);
