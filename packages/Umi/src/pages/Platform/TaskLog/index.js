import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table as LinkTable, LinkQueryForm, Scard,
  Modal
} from 'view';
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
  Table,
} from 'antd';
import moment from 'moment';
import TaskLogForm from '@/components/TaskLogForm';

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
  };

  componentDidMount () {
    this
      .props
      .onInit(this);
  }

  handleCancel () {
    this.setState({ visible: false });
  }

  handleOk () {
    const self = this;
    this
      .form
      .validateFields((err, values) => {
        if (!err) {
          const confirm = self.props.confirm || function () { };
          try {
            if (self.state.type == 'ADD') {
              confirm({
                ...values,
              }, self.state.type);
            } else {
              confirm({
                ...self.state.data,
                ...values,
              }, self.state.type);
            }
          } catch (e) { }
        }
      });
    this.setState({ visible: false });
  }

  hide () {
    this.setState({ visible: false });
  }

  show (type, data) {
    this.setState({
      visible: true,
      type,
      data,
    }, () => {
      if (type == 'UPDATE') {
        if (this.form) {
          this
            .form
            .setFieldsValue({
              ...data,
            });
        }
      } else if (type == 'ADD') {
        if (this.form) {
          //
          this
            .form
            .resetFields();
        }
      } else if (this.form && !data) {
        this
          .form
          .resetFields();
      } else {
        this
          .form
          .setFieldsValue({
            ...data,
          });
      }
    });
  }

  render () {
    return (
      <div>
        <Modal
          title="查看任务日志"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          forceRender
          footer={
            [

              <Button
                onClick={() => {
                  this.hide()
                }}
              >取消</Button>,


            ]
          }
          width="80vw">
          <Spin spinning={this.props.loading}>
            <TaskLogForm
              onFormLoad={form => {
                this.form = form
              }}
              type={this.state.type} />
          </Spin>
        </Modal>
      </div >
    );
  }
}

class TaskLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: {},
      pagination: {
        page: 1, limit: 10,
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


  paginationChange (page, limit) {
    this.setState({
      pagination: {
        page,
        limit,
      },
    })
    this.refreshTable({ page, limit })
  }

  onShowSizeChange (page, limit) {
    this.setState({
      pagination: {
        page,
        limit,
      },
    })
    this.refreshTable({ page, limit })
  }


  modalConfirm (data, type) {
    this.menuModal.hide();
  }

  refreshTable (data, reload) {
    data = data || {}
    const { dispatch } = this.props;
    const { pagination, sorter, searchValue } = this.state;
    let reloadPagination
    if (reload) {
      reloadPagination = {
        limit: pagination.limit,
        page: 1,
      }
    } else {
      reloadPagination = pagination
    }
    dispatch({
      type: 'TaskLog/getTaskLogData',
      payload: {
        ...reloadPagination,
        ...searchValue,
        ...data,
        ...sorter,
      },
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      sorter: {
        sortName: sorter.field,
        orderType: sorter.order,
      },
    }, () => {
      this.refreshTable({}, true)
    })
  }

  render () {
    const self = this;
    const { baseHeight } = this.props;

    return (
      <Scard style={{ background: '#fafafa', padding: '0 6px' }} bodyStyle={{ padding: '4px 0 0' }}>
        <Row align="middle" >
          <LinkQueryForm
            formItems={[{
              key: 'name',
              label: '任务描述',
              componentType: 'input',
            },
            ]}
            verifySuccess={value => {
              self.setState({
                searchValue: {
                  ...value,
                },
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
                  sorter: true,
                  title: '任务描述',

                }, {
                  dataIndex: 'projectName',
                  title: '任务所属项目',
                  sorter: true,
                }, {
                  dataIndex: 'startTime',
                  sorter: true,
                  title: '任务执行时间',
                  width: 250,
                  render: (text, record, index) => {
                    if (text == '' || text == null) {
                      return <div>{text}</div>;
                    }
                    return <div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>;
                  },
                }, {
                  dataIndex: 'bizState',
                  title: '业务处理结果',
                  sorter: true,
                  width: 120,
                }, {
                  dataIndex: 'bizData',
                  sorter: true,
                  title: '任务处理信息',
                }, {
                  dataIndex: 'operation',
                  title: '操作',

                  fixed: 'right',
                  width: 50,
                  render: (text, record, index) => (
                    <div>
                      <a
                        onClick={() => {
                          self
                            .menuModal
                            .show('UPDATE', record);
                        }}>
                        查看
                                    </a>
                    </div>
                  ),
                },
              ]}
                bordered
                isSpin
                checkable
                rowSelected={record => {
                  console.log(record)
                }}
                loading={this.props.loading.global} // isOperation
                pagination={this.props.TaskLog.pagination}
                scroll={{ y: (baseHeight - 160) }}
                sortChange={this.handleTableChange}
                dataSource={this.props.TaskLog.TaskLogData}
                paginationChange={this.paginationChange.bind(this)}
                onShowSizeChange={this.onShowSizeChange.bind(this)}
                batchButton={[]} />

              <MenuColumnModal
                onInit={menuModal => {
                  self.menuModal = menuModal;
                }}
              />

            </Row>
          </Scard>
        </Row>
      </Scard >
    );
  }
}

export default connect(({ TaskLog, loading, global }) => ({ baseHeight: global.contentHeight, loading, TaskLog }))(props => <TaskLog {...props} />);
