/*eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table as LinkTable, LinkQueryForm, Scard, Confirm } from 'view';
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
  Card,
  Table
} from 'antd';
import moment from 'moment';
import TaskLogForm from '@/components/TaskManagerForm';

class TaskManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentId: '',
      disabled: true,
      visible: false,
      searchValue: {},
      pagination: {
        page: 1, limit: 10
      },
      sorter: {},
    }
  }
  componentDidMount () {
    this.refreshTable({}, true)
  }




  setRef (table) {
    this.table = table;
  }

  onChange (selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows)
    if (selectedRowKeys.length > 0) {
      this.setState({ disabled: false, selectedRowKeys: selectedRowKeys, selectedRow: selectedRows[0] })
    } else {
      this.setState({ disabled: true, selectedRowKeys: [] })
    }
  }

  paginationChange (page, limit) {
    this.setState({
      pagination: {
        page,
        limit
      }
    })
    this.refreshTable({ page: page, limit: limit })
  }

  onShowSizeChange (page, limit) {
    this.setState({
      pagination: {
        page,
        limit
      }
    })
    this.refreshTable({ page: page, limit: limit })
  }

  showDeleteConfirm ({ type, record }) {
    const self = this
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    Confirm({
      onOk () {
        // console.log('OK');
        if (type == 'many') {
          dispatch({
            type: 'TaskManagement/delTaskManagerBatch',
            payload: {
              ids: selectedRowKeys,
            }
          }).then((res) => {
            if (res.code === 0) {
              message.success('删除成功')
              self.setState({ disabled: true, selectedRowKeys: [] }, () => {
                self.tb.clearData()
              })
              self.refreshTable({})
            }
          })
        } else {
          dispatch({
            type: 'TaskManagement/delTaskManager',
            payload: {
              id: record.id
            }
          }).then((res) => {
            if (res.code === 0) {
              message.success('删除成功')
              if (self.state.selectedRowKeys) {
                let arr = self.state.selectedRowKeys
                arr.map((item, index) => {
                  if (arr[index] == record.id) {
                    arr.splice(index, 1);
                  }
                  return arr
                })
                if (arr.length > 0) {
                  self.setState({ disabled: false, selectedRowKeys: arr })
                } else {
                  self.setState({ disabled: true, selectedRowKeys: [] }, () => {
                    self.tb.clearData()
                  })
                }
              }
              self.refreshTable({})
            }
          })
        }
      },
      onCancel () {
        console.log('Cancel');
      },
    }, type);
  }

  showStartConfirm ({ type, record }) {
    const self = this
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    Confirm({
      title: type === 'many' ? '您确定要将勾选的任务状态设置为启动吗?' : '您确定要该任务状态设置为启动吗？',
      content: '',
      onOk () {
        // console.log('OK');
        if (type == 'many') {
          dispatch({
            type: 'TaskManagement/startTaskManager',
            payload: record
          }).then((res) => {
            if (res.code === 0) {
              message.success('启动成功')
              self.refreshTable({})
            }
          })
        } else {
          dispatch({
            type: 'TaskManagement/startTaskManager',
            payload: {
              id: record.id
            }
          }).then((res) => {
            if (res.code === 0) {
              message.success('启动成功')
              self.refreshTable({})
            }
          })
        }
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  }

  showCloseConfirm ({ type, record }) {
    const self = this
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    Confirm({
      title: type === 'many' ? '您确定要将勾选的任务状态设置为关闭吗?' : '您确定要该任务状态设置为关闭吗？',
      content: '',
      onOk () {
        // console.log('OK');
        if (type == 'many') {
          dispatch({
            type: 'TaskManagement/stopTaskManager',
            payload: record
          }).then((res) => {
            if (res.code === 0) {
              message.success('关闭成功')
              self.refreshTable({})
            }
          })
        } else {
          dispatch({
            type: 'TaskManagement/stopTaskManager',
            payload: {
              id: record.id
            }
          }).then((res) => {
            if (res.code === 0) {
              message.success('关闭成功')
              self.refreshTable({})
            }
          })
        }
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  }

  async delTaskManager (record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'TaskManagement/delTaskManager',
      payload: {
        id: record.id,
      }
    })
  }


  async delTaskManagerBatch () {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    if (selectedRowKeys.length > 0) {
      await dispatch({
        type: 'TaskManagement/delTaskManagerBatch',
        payload: {
          ids: selectedRowKeys,
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

  modalConfirm (data, type) {
    const { dispatch } = this.props;
    if (type === 'ADD') {
      dispatch({
        type: 'TaskManagement/addTaskManager',
        payload: data
      }).then((res) => {
        if (res.code === 0) {
          message.success('新增成功')
          this.refreshTable({}, true)
          this.popModal.hide();
        }
      })
    }
    if (type === 'UPDATE') {
      dispatch({
        type: 'TaskManagement/updateTaskManager',
        payload: data
      }).then((res) => {
        if (res.code === 0) {
          message.success('编辑成功')
          this.refreshTable({})
          this.popModal.hide();
        }
      })
    }

  }



  refreshTable (data, reload) {
    data = data || {}
    const { dispatch } = this.props;
    let { pagination, sorter, searchValue } = this.state;
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
      type: 'TaskManagement/getTaskLogData',
      payload: {
        ...reloadPagination,
        ...searchValue,
        ...data,
        ...sorter,
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

  render () {
    const self = this;
    const { baseHeight } = this.props;
    return (

      <Scard style={{ background: '#fafafa', padding: '0 6px' }} bodyStyle={{ padding: "4px 0 0" }}>
        <Row align='middle' >
          <LinkQueryForm
            formItems={[{
              key: 'name',
              label: '任务描述',
              componentType: 'input'
            }
            ]}
            verifySuccess={value => {
              self.setState({
                searchValue: {
                  ...value,
                }
              }, () => {
                this.refreshTable({ ...value }, true)
              })
            }} />
        </Row>
        <Row>
          <Scard style={{ padding: '0' }}>
            <Row>
              <LinkTable columns={[
                {
                  dataIndex: 'name',
                  title: '任务描述',

                  sorter: true,
                },
                {
                  dataIndex: 'cron',
                  title: '定时规则',
                  sorter: true,
                  width: 100,
                },
                {
                  dataIndex: 'timeFlag',
                  title: '次数标识',
                  sorter: true,
                  width: 100,
                  render: (text, record, index) => {
                    if (text == '10') {
                      return '不限制'
                    }
                    if (text == '20') {
                      return '不限制'
                    }
                  }
                },
                {
                  dataIndex: 'totalTimes',
                  title: '总次数',
                  width: 100,
                  sorter: true,
                },
                {
                  dataIndex: 'completedTimes',
                  title: '已执行次数',
                  width: 100,
                  sorter: true,
                },
                {
                  dataIndex: 'state',
                  title: '任务状态',
                  width: 120,
                  sorter: true,
                  render: (text, record, index) => {
                    if (text == '10') {
                      return '新建'
                    }
                    if (text == '20') {
                      return '已启动'
                    }
                    if (text == '30') {
                      return '已暂停'
                    }
                    if (text == '40') {
                      return '已完成'
                    }
                    if (text == '50') {
                      return '已关闭'
                    }

                  }
                },
                {
                  dataIndex: 'operation',
                  title: '操作',

                  fixed: 'right',
                  width: 150,
                  render: (text, record, index) => {
                    return (
                      <div>
                        {(record.state === '10' || record.state === '50') &&
                          <a onClick={() => { self.popModal.show('UPDATE', record); }}>
                            编辑
                        </a>}
                        {(record.state === '10' || record.state === '50') &&
                          <Divider type="vertical" />}
                        {(record.state === '10' || record.state === '50')
                          && <a onClick={this.showDeleteConfirm.bind(this, { type: 'one', record })}>
                            删除
                        </a>}
                        {(record.state === '10' || record.state === '50')
                          && <Divider type="vertical" />}
                        {(record.state === '10' || record.state === '50' && record.state !== '20')
                          && <a onClick={this.showStartConfirm.bind(this, { type: 'one', record })}>
                            启动
                        </a>}
                        {record.state === '10'
                          && <Divider type="vertical" />}

                        {record.state !== '50'
                          && <a onClick={this.showCloseConfirm.bind(this, { type: 'one', record })}>
                            关闭
                        </a>}
                      </div>
                    );
                  }
                }
              ]}
                bordered
                isSpin
                rowSelected={(record) => {
                  console.log(record)
                }}
                loading={this.props.loading.global}
                ref={(tb) => { this.tb = tb }}
                scroll={{ y: (baseHeight - 190) }}
                pagination={this.props.TaskManagement.pagination}
                sortChange={this.handleTableChange}
                // onChange={this.onChange.bind(this)}
                checkable
                dataSource={this.props.TaskManagement.taskData}
                paginationChange={this.paginationChange.bind(this)}
                onShowSizeChange={this.onShowSizeChange.bind(this)}
                batchButton={[
                  <Button
                    type='primary'
                    icon="plus"
                    onClick={() => {
                      self.popModal.show('ADD');
                    }
                    }

                  >新增</Button>,
                  // <Button
                  //   icon="check"
                  //   className="noMain"
                  //   disabled={this.state.disabled}
                  //   // onClick={() => {
                  //   //   const { dispatch } = this.props;
                  //   //   dispatch({
                  //   //     type: 'TaskManagement/startTaskManager',
                  //   //     payload: {}
                  //   //   })
                  //   // }
                  //   // }
                  //   onClick={this.showStartConfirm.bind(this, { type: 'many', record: this.state.selectedRowKeys })}
                  // >启动</Button>,
                  // <Button
                  //   icon="close"
                  //   className="noMain"
                  //   disabled={this.state.disabled}
                  //   // onClick={() => {
                  //   //   const { dispatch } = this.props;
                  //   //   dispatch({
                  //   //     type: 'TaskManagement/stopTaskManager',
                  //   //     payload: {}
                  //   //   })
                  //   // }
                  //   // }
                  //   onClick={this.showCloseConfirm.bind(this, { type: 'many', record: this.state.selectedRowKeys })}
                  // >关闭</Button>,
                  // <Button icon='delete' disabled={this.state.disabled} onClick={this.showDeleteConfirm.bind(this, { type: 'many', record: this.state.selectedRowKeys })}>批量删除</Button>
                ]} />

              <TaskLogForm
                onInit={popModal => {
                  self.popModal = popModal;
                }}
                confirm={this.modalConfirm.bind(this)}
              />
            </Row>
          </Scard>
        </Row>
      </Scard >
    );
  }
}

export default connect(({ TaskManagement, loading, global }) => ({ baseHeight: global.contentHeight, loading, TaskManagement }))(props => <TaskManagement {...props} />);