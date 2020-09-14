import React, { Component } from 'react';
import {
  SForm, Table as LinkTable, Collapse, Scard, PageLoading, Confirm, Modal
} from 'view';

import { connect } from 'dva';
import {
  message,
  Divider,
  Spin,
  Button,
} from 'antd';
import GzyqJobModal from '../sbyx/GzyqJobModal';
// const { confirm } = Modal;
// 工作要求modal
@connect(({ loading, global, gzyqForm, gzyqJob, dict }) => ({
  baseHeight: global.contentHeight,
  loading,
  gzyqForm,
  gzyqJob,
  dict,
}))


// 工作要求modal
class ContentPopModal extends Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
    baseId: '',
    selected: false,
    disabledJob: true,
    paginationJob: {
      page: 1, limit: 10,
    },
    dictType: 'MBFL',
    selectedRowKeys: [],
    selectedRow: {},
    selectedRowKeysJob: [],
    selectedRowJob: {},
    record: undefined,
  };

  componentDidMount () {
    this.props.onInit(this);
  }

  refreshJob (data, reload) {
    const { dispatch } = this.props
    const pagination = this.state.paginationJob
    const { record } = this.state;
    if (record) {
      if (reload) {
        pagination.page = 1;
      }
      dispatch({
        type: 'gzyqJob/getJobData',
        payload: {
          ...pagination,
          baseId: this.state.baseId,
          templateId: record.id,
          ...data,
        },
      })
    } else {
      dispatch({
        type: 'gzyqJob/clearJobData',
      })
    }
  }

  showDeleteConfirmJob ({ type, record }) {
    const { record: chooseRecord } = this.state
    const { dispatch } = this.props;
    const { selectedRowKeysJob } = this.state;
    const self = this;
    Confirm({
      onOk () {
        if (type == 'many') {
          const s = selectedRowKeysJob.reduce((total, value) => `${total}ids=${value}&`, '')
          dispatch({
            type: 'gzyqJob/deleteJobData',
            payload: s,
          }).then(res => {
            if (res.code == 0) {
              self.refreshJob({})
              message.success('操作成功')
            }
          })
          self.setState({
            disabledJob: true, selectedRowKeysJob: [],
          });
        } else {
          dispatch({
            type: 'gzyqJob/delOneJobData',
            payload: record.id,
          }).then(res => {
            if (res.code == 0) {
              self.refreshJob({})
              message.success('操作成功')
            }
          })
        }
      },
      onCancel () {
      },
    }, type);
  }

  onChangeJob (selectedRowKeys, selectedRows) {
    if (selectedRowKeys.length > 0) {
      // const keys = selectedRows.reduce((r, c) => {
      //   return [
      //     ...r,
      //     c.no - 1
      //   ]
      // }, [])
      this.setState({ disabledJob: false, selectedRowKeysJob: selectedRowKeys, selectedRowJob: selectedRows })
    } else {
      this.setState({ disabledJob: true, selectedRowKeysJob: [] })
    }
  }

  paginationChangeJob (page, size) {
    this.refreshJob({ limit: size, page })
    this.setState({ paginationJob: { limit: size, page } })
  }

  onShowSizeChangeJob (current, pageSize) {
    this.refreshJob({ limit: pageSize, current })
    this.setState({
      paginationJob: {
        page: current,
        limit: pageSize,
      },
    })
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
          if (self.state.type == 'ADD') {
            confirm(
              {
                ...values,

              },
              self.state.type,
            );
          } else {
            confirm(
              {
                ...self.state.data,

                ...values,
              },
              self.state.type,

            );
          }
        } catch (e) { }
      }
    });
  }

  hide () {
    this.setState({
      visible: false,
    });
  }

  show (type, data, baseId) {
    this.setState(
      {
        visible: true,
        type,
        data,
        record: data,
        baseId,
      },
      () => {
        setTimeout(() => {
          if (this.form) {
            if (type == 'UPDATE') {
              this.form.setFieldsValue({
                ...data,
              });
              this.refreshJob({}, true)
            } else if (type == 'ADD') {
              if (this.form) {
                this.form.resetFields();
                this.form.setFieldsValue({
                  templateId: data.id,
                });
              }
            } else if (this.form && !data) {
              this.form.resetFields();
            } else {
              this.form.setFieldsValue({
                ...data,
              });
              this.refreshJob({}, true)
            }
          }
        }, 100)
      },
    );
  }

  render () {
    const { onFormLoad, baseHeight } = this.props;
    const self = this
    const disabled = this.state.type === 'VIEW';
    const title = this.state.type == 'ADD' ?
      '新增工作要求' : this.state.type == 'UPDATE' ?
        '修改工作要求' : '查看工作要求'

    const formItems = [

      // {
      //   key: 'templateType',
      //   label: '模板类型',
      //   componentType: 'optionSelect',
      //   options: {
      //     rules: [{ required: true }],
      //   },
      //   props: {
      //     options: status,
      //   }111
      // },
      {
        key: 'templateName',
        label: '模板名称',
        componentType: 'input',
        options: {
          rules: [{ required: true }],
        },
        props: {
          disabled,
        },
      },
      {
        key: 'requirementsOrRegulations',
        label: '要求或法规',
        componentType: 'input',
        options: {
          rules: [],
        },
        props: {
          disabled,
        },
      },
      {
        key: 'remark',
        label: '备注',
        componentType: 'textArea',
        props: {
          autoSize: { minRows: 3 },
          disabled,
        },
        options: {
          rules: [],
        },
      },
    ]
    const linkTableColumnsJob = [
      {
        dataIndex: 'jobContent',
        title: '工作内容',

      },
      {
        dataIndex: 'sort',
        title: '排序',
        width: 120,
      },
      {
        dataIndex: 'remark',
        title: '备注',
      },
    ]
    if (this.state.type !== 'VIEW') {
      linkTableColumnsJob.push(
        {
          dataIndex: 'operation',
          title: '操作',

          fixed: 'right',
          width: 100,
          render: (text, record, index) => (
            <div>
              <a
                onClick={() => {
                  this.popModal.show('UPDATE', record);
                }}>
                编辑
                                      </a>


              <Divider type="vertical" />
              <a onClick={this.showDeleteConfirmJob.bind(this, { type: 'one', record })}>
                删除
                                          </a>


            </div>
          ),
        })
    }
    const batchButtonJob = disabled ? [] : [
      <Button
        type="primary"
        icon="plus"
        onClick={() => {
          const { record } = this.state;
          self.popModal.show('ADD', record);
        }
        }
      >新增</Button>,

      <Button icon="delete" disabled={this.state.disabledJob} onClick={this.showDeleteConfirmJob.bind(this, { type: 'many', record: this.state.selectedRowKeysJob })}>批量删除</Button>,
    ]
    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.hide.bind(this)}
          okText="保存"
          cancelText="取消"
          width="80vw"
        >
          {/* <Spin spinning={this.props.loading}> */}
          <Collapse
            defaultActiveKey={['1', '2']}
            collapseItems={[
              {
                header: '工作要求',
                key: '1',
                content: (
                  <Scard style={{ padding: 0 }}>
                    <SForm
                      ref={form => {
                        this.form = form;
                      }}
                      rowNum={3}
                      layoutType={4}
                      formItems={formItems}
                    />
                  </Scard>
                ),
                props: {
                  showArrow: false,
                },
              },
              {
                header: '工作内容',
                key: '2',
                content: (
                  <Scard style={{ padding: 0 }}>
                    {/* {status.length ? */}
                    <LinkTable columns={linkTableColumnsJob}
                      bordered
                      isSpin
                      scroll={{ y: (baseHeight - 190) }}
                      loading={this.props.loading.global} // isOperation
                      checkable={disabled}
                      dataSource={this.props.gzyqJob.list}
                      onChange={this.onChangeJob.bind(this)}
                      paginationChange={this.paginationChangeJob.bind(this)}
                      onShowSizeChange={this.onShowSizeChangeJob.bind(this)}
                      pagination={this.props.gzyqJob.pagination}
                      batchButton={batchButtonJob}
                    />
                    {/* : <PageLoading />} */}
                  </Scard>
                ),
                props: {
                  showArrow: false,
                },
              },
            ]}
          >

          </Collapse>
          <GzyqJobModal
            onInit={popModal => {
              self.popModal = popModal;
            }}
            confirm={(data, type) => {
              const { dispatch } = this.props;
              if (type === 'ADD') {
                dispatch({
                  type: 'gzyqJob/addJobData',
                  payload: { ...data, templateId: this.state.record.id },
                }).then(res => {
                  if (res.code == 0) {
                    message.success('操作成功')
                    this.refreshJob({}, true)
                  }
                })
              }

              if (type === 'UPDATE') {
                // data.currentKeys = data.selectedKeys
                dispatch({
                  type: 'gzyqJob/editJobData',
                  payload: data,
                }).then(res => {
                  if (res.code == 0) {
                    message.success('操作成功')
                    this.refreshJob({}, true)
                  }
                })
              }

              this.popModal.hide();
            }}
          />

        </Modal>
      </div>
    );
  }
}
export default ContentPopModal
