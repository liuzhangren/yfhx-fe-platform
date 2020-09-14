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
import {
  LinkTree,
  Table as LinkTable,
  LinkQueryForm,
  Scard,
  CardActions,
  Modal,
} from 'view';
import PuserForm from '@/components/Puser/PuserForm';

import {
  getPorg,
  updatePorg,
  addPorg,
  delPorg,
  delPorgBatch
} from '@/services/restful';
@Form.create()
class MenuColumnModal extends Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
    selected: false,
    selectedKeys: '',
    checkedKeys: []
  };

  componentDidMount () {
    this.props.onInit(this);
  }

  handleCancel () {
    this.setState({
      visible: false,
    });
  }

  handleOk () {
    const self = this;
    this.form.validateFields((err, values) => {
      if (!err) {
        const confirm = self.props.confirm || function () { };
        try {
          if (self.state.type == "ADD") {
            confirm(
              {
                systemUser: 1,
                resourceCatagory: 2,
                ...values,
              },
              self.state.type
            );
          } else {
            confirm(
              {
                ...self.state.data,
                ...values,
              },
              self.state.type
            );
          }
        } catch (e) { }
      }
    });
    this.setState({
      visible: false,
    });
  }

  hide () {
    this.setState({
      visible: false,
    });
  }

  show (type, data) {
    this.setState(
      {
        visible: true,
        type: type,
        data,
      },
      () => {
        this.form.resetFields();
        if (type == 'UPDATE') {
          if (this.form) {
            this.form.setFieldsValue({
              ...data,
              birthday: moment(data.birthday)
            });
          }
        } else {
          if (type == 'ADD') {
            if (this.form) {
              // 
              this.form.resetFields();
              this.form.setFieldsValue({
                porgNo: data.orgNo,
              });
            }
          } else if (this.form && !data) {
            this.form.resetFields();
          } else {
            this.form.setFieldsValue({
              ...data,
            });
          }
        }
      }
    );
  }
  render () {
    const title = this.state.type == 'ADD' ?
      '新增人员信息' :
      '修改人员信息'
    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText="确认"
          cancelText="取消"
          forceRender
          width={1000}
        >
          <Spin spinning={this.props.loading}>
            <PuserForm onFormLoad={form => (this.form = form)} type={this.state.type} />
          </Spin>
        </Modal>
      </div>
    );
  }
}
/**
 * 左侧树资料维护
 *
 */
class MenuPage extends Component {
  state = {
    porgNo: undefined,
    orgNo: '-1',
    disabled: true,
    selected: false,
    visible: false,
    searchVal: {},
    pagination: {
      limit: 10,
      page: 1
    },
    sorter: {
      sortName: '',
      orderType: 'ascend',
    }
  };

  componentDidMount () {
    const { dispatch } = this.props
    this.refreshPuserTable("", true)
    // dispatch({
    //   type: 'puser/getPuserData',
    //   payload: {
    //     limit: 10
    //   }
    // })
    dispatch({
      type: 'puser/getOrgTreeData',
      payload: {}
    })
    dispatch({
      type: 'puser/getDeviceTreeData',
      payload: {
        busType: 'EQUIP',
        userType: 'admin'
      }
    })
    dispatch({
      type: 'puser/save',
      payload: {
        checkedKeys: []
      }
    })
  }

  setRef (table) {
    this.table = table;
  }

  refreshPuserTable (data, reload) {
    data = data || {}
    const { dispatch } = this.props;
    this.setState({
      ...this.state,
      ...data
    }, () => {
      let { pagination, searchVal, sorter, selectedKeys } = this.state;
      let reloadPagination
      if (reload) {
        reloadPagination = {
          limit: pagination.limit,
          page: 1
        }
      } else {
        reloadPagination = pagination
      }
      dispatch({
        type: 'puser/getSsPuserData',
        payload: {
          ...reloadPagination,
          ...searchVal,
          ...sorter,
          // orgNo:selectedKeys,
          path: data.path,
          userType: 'OPERATOR'
        }
      })
    })
  }

  handleTableSortChange (pagination, filters, sorter) {
    this.refreshPuserTable({
      pagination: {
        ...this.state.pagination,
        page: 1,
      },
      sorter: {
        sortName: sorter.field,
        orderType: sorter.order,
      }
    })
  }


  deleteMenu (record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'puser/delOnePuserData',
      payload: {
        id: record.id,
        orgNo: this.state.orgNo
      }
    })
  }

  treeSelect (selectedKeys, info) {
    console.log('选中树节点', selectedKeys);
    this.linkTable.clearData()
    this.linkTable.setState({ rowSelectedKey: '' })

    const { dispatch } = this.props;
    const { orgNo, type: roleId, resourceName: name, porgNo: porgNo, path } = info.node.props.dataRef
    if (selectedKeys[0] === 'root') {
      this.refreshPuserTable({
        porgNo: 'root',
        selectedKeys: selectedKeys[0],
        selected: !this.state.selected,
        nodeData: info.node.props,
        pagination: { page: 1, limit: 10 },
        disabled: true,
        checkedKeys: [],
        path,
        orgNo
      })

      // this.setState({
      //   porgNo: 'root',
      //   orgNo: 'root',
      //   selectedKeys: selectedKeys[0],
      //   selected: !this.state.selected,
      //   nodeData: info.node.props
      // });
      // dispatch({
      //   type: 'puser/getPuserData',
      //   payload: {
      //     orgNo: selectedKeys[0]
      //   }
      // })
    } else if (info.selected && info.node.props.dataRef) {
      this.refreshPuserTable({
        porgNo: selectedKeys[0],
        path,
        orgNo,
        selected: true,
        selectedKeys: selectedKeys[0],
        nodeData: info.node.props.dataRef,
        pagination: { page: 1, limit: 10 },
        disabled: true,
        checkedKeys: []
      })

      // this.setState({
      //   porgNo: selectedKeys[0],
      //   orgNo: orgNo,
      //   selected: true,
      //   selectedKeys: selectedKeys[0],
      //   nodeData: info.node.props.dataRef,
      // });
      // dispatch({
      //   type: 'puser/getPuserData',
      //   payload: {
      //     orgNo: selectedKeys[0]
      //   }
      // })
    } else {
      this.refreshPuserTable({
        selected: false,
        selectedKeys: '',
        pagination: { page: 1, limit: 10 },
        disabled: true,
        checkedKeys: []
      })
      // this.setState({
      //   selected: false,
      //   selectedKeys: '',
      // });
      // dispatch({
      //   type: 'puser/getPuserData',
      //   payload: {}
      // })
    }
  }

  modalConfirm (data, type) {
    const { dispatch } = this.props;
    if (type === 'ADD') {
      console.log(this.state)

      dispatch({
        type: 'puser/addPuserData',
        payload: {
          orgNo: this.state.orgNo,
          ...data
        }
      })
    }
    if (type === 'UPDATE') {

      dispatch({
        type: 'puser/updatePuserData',
        payload: {
          ...data,
          orgNo: this.state.orgNo
        }
      })
    }
    self.menuModal.hide();
  }

  onChange (selectedRowKeys, selectedRows) {
    console.log('hello world', selectedRowKeys, selectedRows)
    if (selectedRowKeys.length > 0) {
      // const keys = selectedRows.reduce((r, c) => {
      //   return [
      //     ...r,
      //     c.account
      //   ]
      // }, [])

      this.setState({
        disabled: false,
        selectedRowKeys,
        selectedRow: selectedRows[0]
      })
    } else {
      this.setState({
        disabled: true,
        selectedRowKeys: []
      })
    }
  }
  async delManyOrgData () {
    const { selectedRowKeys, selectedRow } = this.state;
    const { dispatch } = this.props;
    if (selectedRowKeys.length > 0) {
      await dispatch({
        type: 'puser/delManyPuserData',
        payload: {
          selectedRowKeys,
          orgNo: this.state.orgNo
        }
      })
      await this.setState({
        selectedRowKeys: [],
        selectedRow: {},
        disabled: true,
        visible: false
      })
    } else {
      this.setState({
        disabled: true,
        visible: false
      })
    }
  }
  onShowSizeChange (current, pageSize) {
    // console.log(current, pageSize)
    const { dispatch } = this.props;
    this.refreshPuserTable({ pagination: { page: 1, limit: pageSize } })
    // this.setState({
    //   pagination: {
    //     current,
    //     pageSize
    //   }
    // })
    // dispatch({
    //   type: 'puser/getPuserData',
    //   payload: {
    //     limit: pageSize
    //   }
    // })
  }
  paginationChange (page, size) {
    // console.log(page, size)
    this.refreshPuserTable({ pagination: { page, limit: size } })
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'puser/getPuserData',
    //   payload: {
    //     page,
    //     limit: size
    //   }
    // })
  }
  saveSS () {
    // console.log(this.state.selectedRowKeys,this.state.sendKeys,this.state.checkedKeys, )

    let payload = []
    if (!this.state.sendKeys || !this.state.sendKeys.length) {
      payload = this.state.selectedRowKeys.reduce((r, c) => {
        return [
          ...r,
          {
            account: c,
            dictCode: ''
          }
        ]
      }, [])
    } else {
      payload = this.state.selectedRowKeys.reduce((r, c) => {
        return [
          ...r,
          ...this.state.sendKeys.reduce((_r, _c) => {
            return [
              ..._r,
              {
                account: c,
                dictCode: _c
              }
            ]
          }, [])
        ]
      }, [])
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'puser/saveDictUserReal',
      payload,
      callBack: () => {
        this.refreshPuserTable({
          selectedRowKeys: [],
          selectedRow: {},
          disabled: true
        })
        this.linkTable.clearData()
      }
    })
  }

  render () {
    const self = this;
    const { menuType } = this.state;
    const { baseHeight } = this.props;
    const disabled = this.state.orgNo === '-1';
    return (
      <Row>
        <Col span={4}>
          <Scard bordered style={{ height: "calc(100vh - 90px)" }} bodyStyle={{ padding: '4px 0 0' }} >
            <Row>
              <LinkTree
                treeData={this.props.puser.orgTreeData}
                select={this.treeSelect.bind(this)}
                check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys) }}
                showLine
              // showIcon
              // 
              />
            </Row>
          </Scard>
        </Col>
        <Col span={16} >
          <Scard bordered style={{ padding: '0', borderLeft: 0, borderRight: 0 }}>
            <Row align='middle' >
              <LinkQueryForm
                formItems={[
                  {
                    key: 'userName',
                    label: '用户姓名',
                    componentType: 'input'
                  }
                ]}
                verifySuccess={value => {
                  this.refreshPuserTable({
                    searchVal: value,
                    pagination: {
                      page: 1,
                      limit: 10
                    }
                  })
                  // this.props.dispatch({
                  //   type: 'puser/getPuserData',
                  //   payload: {
                  //     ...value,
                  //     orgNo: this.state.orgNo
                  //   }
                  // })
                  // self.table.refresh({
                  //   ...value,
                  //   orgNo: self.state.orgNo,
                  //   systemUser:'1'
                  // });
                }}
              />
            </Row>
            <Row style={{ padding: '0 6px' }}>
              <LinkTable
                ref={ref => this.linkTable = ref}
                columns={
                  [{
                    dataIndex: 'account',
                    title: '账号',
                    sorter: true,
                    width: 100,
                  }, {
                    dataIndex: 'userName',
                    title: '用户姓名',
                    width: 100,
                    sorter: true,
                  },
                  {
                    dataIndex: 'path',
                    title: '所属组织机构',
                    sorter: true,
                    width: 300,
                  }
                  ]}
                bordered
                isSpin
                rowSelected={async (record) => {
                  await this.props.dispatch({
                    type: 'puser/getUserDictTree',
                    payload: record.account
                  })
                  await this.setState({
                    checkedKeys: this.props.puser.checkedKeys
                  })
                }}
                loading={this.props.loading.global}
                // isOperationshou
                pagination={this.props.puser.pagination}
                onChange={this.onChange.bind(this)}
                dataSource={this.props.puser.ssPuserData}
                sortChange={this.handleTableSortChange.bind(this)}
                paginationChange={this.paginationChange.bind(this)}
                onShowSizeChange={this.onShowSizeChange.bind(this)}
                scroll={{ x: 1500, y: baseHeight - 190 }}
                batchButton={[
                  <Button disabled={this.state.disabled} onClick={this.saveSS.bind(this)} type='primary'>保存授权</Button>
                ]}
              />
              <MenuColumnModal
                onInit={menuModal => {
                  self.menuModal = menuModal;
                }}
                confirm={this.modalConfirm.bind(this)}
              />
            </Row>
          </Scard>
        </Col>
        <Col span={4}>
          <Scard bordered style={{ height: "calc(100vh - 90px)" }} bodyStyle={{ padding: '4px 0 0' }} >
            <Row>
              <LinkTree
                treeData={this.props.puser.deviceTreeData}
                select={this.treeSelect.bind(this)}
                check={(checkedKeys, allKeys) => {
                  this.setState({
                    checkedKeys,
                    sendKeys: allKeys
                  })
                }}
                checkedKeys={this.state.checkedKeys}
                showLine
                checkable
                style={{ transform: 'translateY(-5px)' }}
              />
            </Row>
          </Scard>
        </Col>
      </Row>
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


