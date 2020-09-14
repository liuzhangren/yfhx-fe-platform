/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
// import data from './data'

import {
  Popconfirm,
  Row,
  Col,
  Tag,
  Icon,
  Form,

  message,
  Divider,
  Spin,
  Button
} from 'antd';
import moment from 'moment';
import { Table as LinkTable, LinkQueryForm, Scard, LinkTree, Modal, } from 'view';

@Form.create()
class MenuPage extends Component {
  state = {
    type: 'ADD',
    // visible: false,
    data: {},
    porgNo: undefined,
    orgNo: '',
    disabled: true,
    selected: false,
    selectedRowKeys: [],
    selectedRows: [],
    searchValue: {},
    pagination: {
      page: 1, limit: 10
    },
    sorter: {},
  };

  componentDidMount() {
    this.props.onInit(this);
  }

  hide() {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: []
    });
  }

  show(type, data) {
    this.setState(
      {
        visible: true,
        type: type,
        data,
      },
      () => {

        this.setState({
          selectedRows: []
        })
        const { dispatch } = this.props
        this.refreshTable({}, true)
        dispatch({
          type: 'puser/getOrgTreeData',
          payload: {}
        })
      }
    );
  }

  handleOk() {
    const self = this;
    //校验是否勾选
    const rows = this.state.selectedRows;
    // 
    if (rows.length < 1) {
      message.error('请勾选数据');
      return;
    }
    //得到选中的那条数据??

    try {
      const confirm = self.props.confirm || function () { };
      // if (self.state.type == "ADD") {
      confirm(
        rows,
        self.state.type
      );
      this.hide()
      // }
    } catch (e) { }
  }

  remove(index) {
    let selectedRows = this.state.selectedRows
    selectedRows.splice(index, 1)
    this.setState(
      {
        selectedRows
      }
    )
  }

  setRef(table) {
    this.table = table;
  }

  treeSelect(selectedKeys, info) {
    // console.log('选中树节点', selectedKeys, info.node.props.dataRef);
    const { dispatch } = this.props;
    if (selectedKeys[0] === 'root') {
      this.setState({
        porgNo: 'root',
        orgNo: 'root',
        selectedKeys: selectedKeys[0],
        selected: !this.state.selected,
        nodeData: info.node.props
      }, () => {
        this.refreshTable({}, true)
      })
    } else if (info.selected && info.node.props.dataRef) {
      const { orgNo, type: roleId, resourceName: name, porgNo: porgNo } = info.node.props.dataRef
      this.setState({
        porgNo: selectedKeys[0],
        orgNo: orgNo,
        selected: true,
        selectedKeys: selectedKeys[0],
        nodeData: info.node.props.dataRef,

      }, () => {
        this.refreshTable({}, true)
      })
    } else {
      this.setState({
        selected: false,
        selectedKeys: '',
        porgNo: '',
        orgNo: ''
      }, () => {
        this.refreshTable({}, true)
      })
    }
  }

  onChange(selectedRowKeys, selectedRows) {
    if (selectedRowKeys.length > 0) {
      const keys = selectedRows.reduce((r, c) => {
        return [
          ...r,
          c.id
        ]
      }, [])
      this.setState({
        disabled: false,
        selectedRowKeys: keys,
        selectedRow: selectedRows[0]
      })
    } else {
      this.setState({
        disabled: true,
        selectedRowKeys: []
      })
    }
  }

  paginationChange(page, limit) {
    this.setState({
      pagination: {
        page,
        limit
      }
    })
    this.refreshTable({ page: page, limit: limit })
  }

  onShowSizeChange(page, limit) {
    this.setState({
      pagination: {
        page,
        limit
      }
    })
    this.refreshTable({ page: page, limit: limit })
  }

  refreshTable(data, reload) {
    data = data || {}
    const { dispatch } = this.props;
    let { pagination, searchValue, selectedKeys, sorter } = this.state;
    let reloadPagination
    if (reload) {
      reloadPagination = {
        limit: pagination.limit,
        page: 1
      }
    } else {
      reloadPagination = pagination
    }
    let payload = {}
    if (selectedKeys) {
      payload = {
        orgNo: selectedKeys
      }
    }
    dispatch({
      type: 'puser/getPuserData',
      payload: {
        ...payload,
        userType: 'OPERATOR',
        ...reloadPagination,
        ...searchValue,
        ...sorter,
        ...data,
      }
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      sorter: {
        sortName: sorter.field,
        orderType: sorter.order,
      }
    }, () => {
      this.refreshTable({}, true)
    })

  }
  render() {
    const self = this;
    const { menuType } = this.state;
    const { baseHeight } = this.props;
    const disabled = this.state.orgNo === '-1';
    return (
      <Modal
        title="选择用户"
        visible={this.state.visible}
        forceRender
        bodyStyle={{ padding: 0 }}
        onOk={this.handleOk.bind(this)}
        onCancel={this.hide.bind(this)}
        okText="保存"
        cancelText="取消"
        isFull
      >

        <div style={{ display: 'flex' }}>
          <div style={{ width: 'calc(16%)' }}>
            <Row>
              <Row>
                <Scard rate={1} style={{ padding: '11px 18px', borderRight: '1px solid rgba(240,240,240)', height: 'calc(100vh - 110px)' }} >
                  <Row>
                    <LinkTree
                      treeData={this.props.puser.orgTreeData}
                      select={this.treeSelect.bind(this)}
                      showLine
                    // showIcon
                    // 
                    />
                  </Row>
                </Scard>
              </Row>
            </Row>
          </div>
          <div style={{ width: 'calc(66%)' }}>
            <Scard style={{ padding: '0' }}>
              <Row align='middle' >
                <LinkQueryForm
                  formItems={[
                    {
                      key: 'account',
                      label: '用户账号',
                      componentType: 'input'
                    },
                    {
                      key: 'userName',
                      label: '用户姓名',
                      componentType: 'input'
                    },

                    // {
                    //   key: 'userType',
                    //   label: '用户类型',
                    //   componentType: 'optionSelect',
                    //   props: {
                    //     options: [{
                    //       value: "ADMIN",
                    //       label: "一级管理员"
                    //     }, {
                    //       value: "PROJECT_ADMIN",
                    //       label: "项目管理员"
                    //     }, {
                    //       value: "OPERATOR",
                    //       label: "业务操作员"
                    //     }]
                    //   }
                    // },
                  ]}
                  verifySuccess={value => {
                    self.setState({
                      searchValue: {
                        ...value,
                      }
                    }, () => {
                      this.refreshTable({ ...value }, true)
                    })
                  }}
                />
              </Row>
              <Row>
                <Scard style={{ padding: '0 6px' }}>
                  <Row>
                    <LinkTable

                      columns={[
                        {
                          dataIndex: 'account',
                          title: '账号',
                          sorter: true,
                          width: 100,
                        },
                        {
                          dataIndex: 'userName',
                          title: '姓名',
                          sorter: true,
                          width: 100
                        },


                        {
                          dataIndex: 'sex',
                          title: '性别',
                          sorter: true,
                          width: 100,
                          render: type => {
                            return type == '0' ? '女' : '男';
                          },
                        },
                        {
                          dataIndex: 'birthday',
                          title: '出生日期',
                          sorter: true,
                          width: 100,
                          render: (text, record, index) => {
                            if (text == '' || text == null) {
                              return <div>{text}</div>;
                            }
                            return <div>{moment(text).format('YYYY-MM-DD')}</div>;
                          }
                        },
                        {
                          dataIndex: 'nation',
                          title: '民族',
                          sorter: true,
                          width: 100
                        }, {
                          dataIndex: 'phone',
                          title: '手机号',
                          sorter: true,
                          width: 130
                        },
                        {
                          dataIndex: 'systemUser',
                          title: '是否系统用户',
                          sorter: true,
                          width: 130,
                          render: type => {
                            return type == '0' ? '否' : '是';
                          },
                        },
                        // {
                        //   dataIndex: 'workerType',
                        //   title: '职工类型',
                        //   sorter: true,
                        //   width: 100
                        // }, {
                        //   dataIndex: 'bcontractor',
                        //   title: '是否承包商人员',
                        //   sorter: true,
                        //   width: 130,
                        //   render: type => {
                        //     return type == '0' ? '否' : '是';
                        //   },
                        // },
                        // {
                        //   dataIndex: 'contractor',
                        //   title: '所属承包商',
                        //   sorter: true,
                        //   width: 100
                        // },
                        // {
                        //   dataIndex: 'userType',
                        //   title: '用户类型',
                        //   sorter: true,
                        //   width: 100,
                        //   render: type => {
                        //     return type == 'ADMIN' ? '一级管理员' : (type == 'PROJECT_ADMIN' ? '项目管理员' : '业务操作员');
                        //   },
                        // },
                        {
                          dataIndex: 'remark',
                          title: '备注',

                        },

                      ]}
                      bordered
                      isSpin
                      sortChange={this.handleTableChange}
                      scroll={{ y: (baseHeight - 190) }}
                      loading={this.props.loading.effects['puser/getPuserData']}
                      ref={(tb) => { this.tb = tb }}
                      checkable
                      pagination={this.props.puser.pagination}
                      // onChange={this.onChange.bind(this)}
                      rowDoubleSelected={(record) => {

                        let arr = this.state.selectedRows
                        arr.push(record)
                        let obj = {};
                        arr = arr.reduce((item, next) => {
                          if (obj[next.id]) {
                            message.warn('用户已选择')
                          } else {
                            obj[next.id] = true
                            item.push(next);
                          }
                          // obj[next.id] ? '' :
                          return item;
                        }, []);
                        this.setState({
                          selectedRows: arr
                        })
                      }}
                      dataSource={this.props.puser.puserData}
                      paginationChange={this.paginationChange.bind(this)}
                      onShowSizeChange={this.onShowSizeChange.bind(this)}

                      batchButton={[

                      ]}
                    />

                  </Row>
                </Scard>
              </Row>
            </Scard>
          </div>
          <div style={{ width: 'calc(18%)', borderLeft: '1px solid rgba(240,240,240)', }}>
            <Scard title="已选择" style={{ padding: '0' }}>
              <div style={{

              }}>
                {
                  this.state.selectedRows.map((item, index) => {

                    return (
                      <Tag closable style={{
                        margin: '6px 0 0 6px',
                        padding: '0',
                        textAlign: 'center',
                        width: '103px',
                        height: '30px',
                        lineHeight: '30px',
                        fontSize: '14px'
                      }} onClose={this.remove.bind(this, index)} key={item.id} >
                        {item.userName}
                        {/* <Icon type="close" onClick={this.remove.bind(this, index)} /> */}
                      </Tag>
                    )
                  })
                }
              </div>
            </Scard>
          </div>
        </div>
      </Modal >
    );
  }
}

export default connect(({ puser, loading, global }) => ({
  baseHeight: global.contentHeight,
  // layout: setting.layout,
  // menuData: menuModel.menuData,
  // breadcrumbNameMap: menuModel.breadcrumbNameMap,
  // ...setting,
  loading,
  puser
}))(props => <MenuPage {...props} />);


