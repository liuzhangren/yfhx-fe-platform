/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
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
  Button,
  Tooltip
} from 'antd';
import moment from 'moment';
import {
  LinkTree,
  // Table as LinkTable,
  LinkQueryForm,
  Scard,
  Confirm,
  Modal,
} from 'view';
import LinkTable from "@/components/Alink/SingleTable"
import PorgForm from '@/components/PorgForm';
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
    porgNo: ''
  };

  componentDidMount() {
    this.props.onInit(this);
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  handleOk() {
    const { porgNo } = this.state
    this.form.validateFields((err, values) => {
      if (!err) {
        const confirm = this.props.confirm || function () { };
        try {
          if (this.state.type == "ADD") {
            confirm(
              {
                ...values,
                porgNo
              },
              this.state.type
            );
          } else {
            confirm(
              {
                ...this.state.data,
                ...values,
              },
              this.state.type
            );
          }
        } catch (e) { }
      }
    });
  }

  hide() {
    this.setState({
      visible: false,
    });
  }

  show(type, data) {
    console.log(data)
    this.setState(
      {
        visible: true,
        type: type,
        data,
      },
      () => {
        if (type == 'UPDATE') {
          if (this.form) {
            this.form.setFieldsValue({
              ...data,
            });
          }
        } else {
          if (type == 'ADD') {
            if (this.form) {
              // 
              this.form.resetFields();
              this.form.setFieldsValue({
                porgName: data.orgName,
              });
              this.setState({
                porgNo: data.orgNo
              })
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
  render() {
    const title = this.state.type == 'ADD' ?
      '新增组织机构' :
      '编辑组织机构'
    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          forceRender
          okText="保存"
          cancelText="取消"
          width={500}
        >
          <Spin spinning={this.props.loading}>
            <PorgForm
              onFormLoad={(form) => {
                this.form = form
              }}
              type={this.state.type}
            />
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
    orgNo: 'root',
    disabled: true,
    selected: false,
    visible: false,
    selectedKeys: '',
    searchValue: {},
    pagination: {
      page: 1, limit: 10
    },
    sorter: {

    },
  };

  componentDidMount() {
    const { dispatch } = this.props
    if (this.tb) {
      const { path } = this.state
      this.tb.refresh({ path: '中核陕铀', porgNo: 'root', limit: 9999, page: 1, })
    }
    // dispatch({
    //   type: 'org/getOrgTreeData'
    // })
    dispatch({
      type: 'org/getOrgTreeData'
    })
      .then(() => {
        this.setState({
          path: this.props.org.orgTreeData[0].path
        })
      })

  }

  setRef(table) {
    this.table = table;
  }


  showDeleteConfirm({ type, record }) {
    Confirm({

      onOk() {
        // console.log('OK');
        if (type == 'many') {
          dispatch({
            type: 'org/delManyOrgData',
            payload: record
          }).then((res) => {
            if (res) {
              this.setState({ disabled: true, selectedRowKeys: [] }, () => {
                this.tb.clearData()
              })
              this.refreshTable({})
              dispatch({
                type: 'org/getOrgTreeData'
              })
            }
          })
        } else {
          dispatch({
            type: 'org/delOneOrgData',
            payload: record.id
          }).then((res) => {
            if (res) {
              if (this.state.selectedRowKeys) {
                let arr = this.state.selectedRowKeys
                arr.map((item, index) => {
                  if (arr[index] == record.id) {
                    arr.splice(index, 1);
                  }
                  return arr
                })
                if (arr.length > 0) {
                  this.setState({ disabled: false, selectedRowKeys: arr })
                } else {
                  this.setState({ disabled: true, selectedRowKeys: [] }, () => {
                    this.tb.clearData()
                  })
                }
              }
              this.refreshTable({})
              dispatch({
                type: 'org/getOrgTreeData'
              })
            }
          })
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    }, type);
  }

  treeSelect(selectedKeys, info) {
    // console.log('选中树节点', selectedKeys, info.node.props.dataRef);
    const { dispatch } = this.props;
    const { orgNo, type: roleId, resourceName: name, porgNo: porgNo, path } = info.node.props.dataRef
    if (selectedKeys[0] === 'root') {
      this.setState({
        porgNo: 'root',
        path,
        orgNo,
        selectedKeys: selectedKeys[0],
        selected: true,
        nodeData: info.node.props.dataRef,
      }, () => {
        this.tb.refresh({ path: info.node.props.dataRef.path, porgNo: 'root' })
      })
    } else if (info.selected && info.node.props.dataRef) {
      this.setState({
        porgNo: selectedKeys[0],
        orgNo: orgNo,
        path,
        selected: true,
        selectedKeys: selectedKeys[0],
        nodeData: info.node.props.dataRef,

      }, () => {
        this.tb.refresh({
          path,
          porgNo: orgNo,
        })
      })
    } else {
      this.setState({
        selected: false,
        selectedKeys: '',
        path,
        orgNo: ''
      }, () => {
        this.tb.refresh({
          path,
          porgNo: orgNo,
        })
      })
    }
  }

  modalConfirm(data, type) {
    console.log(12312312312)
    const { dispatch } = this.props;
    if (type === 'ADD') {
      dispatch({
        type: 'org/addOrgData',
        payload: {
          porg: data
        }
      }).then((res) => {
        if (res) {
          this.tb.refresh({})
          this.menuModal.hide();
          dispatch({
            type: 'org/getOrgTreeData'
          })
        }
      })
    }
    if (type === 'UPDATE') {
      dispatch({
        type: 'org/updateOrgData',
        payload: data
      }).then((res) => {
        if (res) {
          const { path } = this.state
          this.tb.refresh({})
          this.menuModal.hide();
          dispatch({
            type: 'org/getOrgTreeData'
          })
        }
      })
    }

  }

  onChange(selectedRowKeys, selectedRows) {
    if (selectedRowKeys.length > 0) {
      this.setState({
        disabled: false,
        selectedRowKeys: selectedRowKeys,
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
    let { pagination, searchValue, selectedKeys, sorter, orgNo, path } = this.state;
    let payload = {}
    let reloadPagination = {}
    if (reload) {
      reloadPagination = {
        limit: pagination.limit,
        page: 1
      }
    } else {
      reloadPagination = pagination
    }
    if (selectedKeys) {
      payload = {
        orgNo: selectedKeys
      }
    }
    dispatch({
      type: 'org/getOrgData',
      payload: {
        ...reloadPagination,
        ...searchValue,
        ...sorter,
        ...data,
        path,
      }
    })
    // dispatch({
    //   type: 'org/getOrgTreeData'
    // })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      sorter: {
        sortName: sorter.field,
        orderType: sorter.order,
      }
    }, () => {
      this.refreshTable({}, true)
      dispatch({
        type: 'org/getOrgTreeData'
      })
    })
  }

  render() {
    const { menuType } = this.state;
    const { baseHeight } = this.props;
    const disabled = this.state.orgNo === '-1';
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: 'calc(16%)' }}>
          <Row>
            <Row>
              <Scard rate={1} style={{ padding: '11px 18px', borderRight: '1px solid rgba(240,240,240)', overflowY: 'auto', height: 'calc(100vh - 110px)' }} >
                <Row>
                  <LinkTree
                    treeData={this.props.org.orgTreeData}
                    select={this.treeSelect.bind(this)}
                    check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys) }}
                    showLine
                  // showIcon
                  // checkable
                  />
                </Row>
              </Scard>
            </Row>
          </Row>
        </div>
        <div style={{ width: 'calc(84%)' }}>
          <Scard style={{ padding: '0' }}>
            <Row align='middle' >
              <LinkQueryForm
                formItems={[
                  {
                    key: 'orgName',
                    label: '组织名称',
                    componentType: 'input',
                  },
                ]}
                verifySuccess={value => {
                  const { path } = this.state
                  this.setState({
                    searchValue: {
                      path,
                      ...value,
                    }
                  }, () => {
                    this.tb.refresh({ ...value, path })
                  })
                }}
              />
            </Row>
            <Row>
              <Scard style={{ padding: '0 6px' }}>
                <Row>
                  <LinkTable
                    ref={(tb) => { this.tb = tb }}
                    link="/get/v1/porgs"
                    rowDelLink="/delete/v1/porg/"
                    rowAddLink="/post/v1/porg"
                    rowsDelLink="/delete/v1/porgs"
                    onChange={this.onChange.bind(this)}
                    sortLink='/v1/org-sort'
                    showPagination={false}
                    fontSort
                    headerButton={
                      [<AddRow
                        modal={this.menuModal}
                        record={this.state.nodeData}
                        beforeShow={() => {
                          if (!this.state.selected) {
                            message.error("请选中父级节点");
                            return false;
                          }
                        }
                        }
                      >新增</AddRow>,
                      ]
                    }
                    batchButton={[
                      <RowsDelete table={this.tb}
                        onCallback={() => {
                          this.setState({ selectedRowKeys: [], selectedRow: [], record: null })
                          this.tb.clearData()
                        }}>
                        批量删除
                      </RowsDelete>,
                    ]}
                    columns={[
                      {
                        dataIndex: 'orgNo',
                        title: '组织编号',
                      },
                      {
                        dataIndex: 'orgName',
                        title: '组织名称',
                      },
                      // {
                      //   dataIndex: 'porgNo',
                      //   title: '上级组织编号',
                      //   sorter: true,
                      // },
                      // {
                      //   dataIndex: 'porgName',
                      //   title: '上级组织名称',
                      //   sorter: true,
                      // },
                      {
                        dataIndex: 'path',
                        title: '所属组织机构',
                        width: 300
                      },
                      // {
                      //   dataIndex: 'sortNo',
                      //   title: '排序',
                      //   sorter: true,
                      // },
                      {
                        dataIndex: 'operation',
                        title: '操作',
                        fixed: 'right',
                        width: 70,
                        render: (text, record, index) => {
                          return (
                            <div>
                              <Tooltip title="编辑">
                                <a
                                  onClick={() => {
                                    console.log(this)
                                    this.menuModal.show('UPDATE', record);
                                  }}
                                >
                                  <Icon type="edit" />
                                </a>
                              </Tooltip>
                              <Divider type="vertical" />
                              <RowDelete table={this.tb} record={record} onCallback={() => { console.log("我是删除成功回调") }}>删除</RowDelete>
                            </div>
                          );
                        }
                      }
                    ]}
                  />
                  <MenuColumnModal
                    onInit={menuModal => {
                      this.menuModal = menuModal;
                    }}
                    loading={this.props.loading.global}
                    confirm={this.modalConfirm.bind(this)}
                  />
                  {/* <LinkTable
                    link='/get/v1/porgs'
                    ref={(tb) => { this.tb = tb }}
                    columns={[
                      {
                        dataIndex: 'orgNo',
                        title: '组织编号',
                        sorter: true,
                      },
                      {
                        dataIndex: 'orgName',
                        title: '组织名称',
                        sorter: true,
                      },
                      // {
                      //   dataIndex: 'porgNo',
                      //   title: '上级组织编号',
                      //   sorter: true,
                      // },
                      // {
                      //   dataIndex: 'porgName',
                      //   title: '上级组织名称',
                      //   sorter: true,
                      // },
                      {
                        dataIndex: 'path',
                        title: '所属组织机构',
                        width: 300
                      },
                      {
                        dataIndex: 'sortNo',
                        title: '排序',
                        sorter: true,
                      },

                      {
                        dataIndex: 'operation',
                        title: '操作',

                        fixed: 'right',
                        width: 80,
                        render: (text, record, index) => {
                          return (
                            <div>
                              <EditRow
                                click={
                                  () => {
                                    this.menuModal.show('UPDATE', record);
                                  }
                                }
                              >
                              </EditRow>
                              <Divider type="vertical" />
                              <RowDelete
                                click={() => {
                                  this.showDeleteConfirm({ type: 'one', record })
                                }}
                              >
                              </RowDelete>
                            </div>

                            // <div>
                            //   <a
                            //     onClick={() => {
                            //       this.menuModal.show('UPDATE', record);
                            //     }}
                            //   >
                            //     编辑
                            //   </a>
                            //   <Divider type="vertical" />
                            //   <a onClick={this.showDeleteConfirm.bind(this, { type: 'one', record })}>
                            //     删除
                            //             </a>
                            // </div>
                          );
                        },
                      },
                    ]}
                    bordered
                    isSpin
                    scroll={{ y: (baseHeight - 190) }}
                    rowSelected={(record) => { console.log(record) }}
                    loading={this.props.loading.global}
                    ref={(tb) => { this.tb = tb }}
                    pagination={this.props.org.pagination}
                    onChange={this.onChange.bind(this)}
                    dataSource={this.props.org.orgData}
                    paginationChange={this.paginationChange.bind(this)}
                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                    sortChange={this.handleTableChange}
                    batchButton={[
                      <Button
                        type='primary'
                        icon="plus"
                        onClick={() => {
                          if (!this.state.selected) {
                            message.error("请选中组织机构节点");
                            return;
                          }
                          // if(this.state.selected==='root'){
                          //   message.error("请选中子节点");
                          //   return;
                          // }
                          this.menuModal.show('ADD', this.state.nodeData);
                        }
                        }
                      >新增</Button>,
                      <Button icon='delete' disabled={this.state.disabled} onClick={this.showDeleteConfirm.bind(this, { type: 'many', record: this.state.selectedRowKeys })}>批量删除</Button>
                    ]}
                  />
                  <MenuColumnModal
                    onInit={menuModal => {
                      this.menuModal = menuModal;
                    }}
                    loading={this.props.loading.global}
                    confirm={this.modalConfirm.bind(this)}
                  /> */}
                </Row>
              </Scard>
            </Row>
          </Scard>
        </div>
      </div>
    );
  }
}

export default connect(({ org, loading, global }) => ({
  baseHeight: global.contentHeight,
  loading,
  org
}))(props => <MenuPage {...props} />);


