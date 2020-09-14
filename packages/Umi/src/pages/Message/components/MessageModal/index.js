import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, Modal, Button, Tooltip, Icon, Divider, Tag } from 'antd';
import SingleTableWrap from '@/components/Alink/SingleTable/SingleTableWrap';
import SingleTable from '@/components/Alink/SingleTable'
import { LinkQueryForm, Confirm } from 'view';
import { RowsDelete } from '@/components/Alink/Table/Table';
import BraftModal from './BraftModal';
import styles from './index.less';

const { TabPane } = Tabs;

class MessageModal extends PureComponent {
  state = {
    visible: false,
    show: false,
    selectedRows: null,
    current: {
      disable: false,
      info: null,
    },
    activeKey: 'accept',
  };

  componentDidUpdate () {
    if (this.state.selectedRows !== null) return
    const { activeKey } = this.state
    switch (activeKey) {
      case 'accept':
        if (this.accept) {
          this.accept.refresh({})
        }
        break
      case 'sent':
        if (this.sent) {
          this.sent.refresh({})
        }
        break
      default:
        if (this.braft) {
          this.braft.refresh({})
        }
    }
  }

  onChange = (rowCheckableKeys, selectedRows) => {
    this.setState(() => ({
      selectedRows,
    }))
  }

  handlePublisBraft = () => {
    const { dispatch } = this.props
    const { selectedRows } = this.state

    const id = selectedRows.map(item => item.id).join()

    dispatch({
      type: 'message/sendMessage',
      payload: {
        submitData: { id },
      },
    })
    this.braft.refresh({})
  }

  handleChangeTab = activeKey => {
    this.setState(() => ({
      activeKey,
      selectedRows: null,
    }))
  }

  handleDelsAccept = () => {
    const self = this
    const { selectedRows } = this.state
    const { dispatch } = this.props

    const strDel = selectedRows.map(item => (`ids=${item.delId}`)).join('&')
    Confirm({
      onOk () {
        dispatch({
          type: 'message/delsAcceptMessage',
          payload: {
            strDel,
          },
          callback: () => {
            self.accept.refresh({})
          },
        })
      },
      onCancel () { },
    }, 'many');
  }

  show () {
    this.setState(() => ({
      visible: true,
    }))
    this.props.dispatch({
      type: 'message/getReadState',
    })
  }

  render () {
    const { visible } = this.state

    const colDraft = [
      {
        title: '标题',
        dataIndex: 'title',
        sorter: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateDate',
        sorter: true,
        width: 200,
      },
      {
        dataIndex: 'operation',
        title: '操作',
        fixed: 'right',
        width: 70,
        render: (text, record) => [
          <Tooltip title="查看">
            <a
              onClick={e => {
                e.stopPropagation()
                this.setState(() => ({
                  show: true,
                  current: {
                    disable: true,
                    info: record,
                  },
                }))
              }}>
              <Icon type="search" />
            </a>
          </Tooltip>,
          <Divider type="vertical" />,
          <Tooltip title="编辑">
            <a
              onClick={e => {
                e.stopPropagation()
                this.setState(() => ({
                  show: true,
                  current: {
                    disable: false,
                    info: record,
                  },
                }))
              }}>
              <Icon type="edit" />


            </a>
          </Tooltip>,
          <Divider type="vertical" />,
          <Tooltip title="删除">
            <a
              style={{ color: '#ff008c' }}
              onClick={e => {
                e.stopPropagation()
                Confirm({
                  onOk: () => {
                    this.props.dispatch({
                      type: 'message/delBraftMessage',
                      payload: {
                        record,
                      },
                      callback: () => {
                        this.braft.refresh()
                      },
                    })
                  },
                  onCancel () { },
                }, 'many');
              }}>
              <Icon type="delete" />
            </a>
          </Tooltip>,
        ],
      },
    ];

    const colAccept = [
      {
        title: '标题',
        dataIndex: 'title',
        sorter: true,
        width: 180,
      },
      {
        title: '发送人',
        dataIndex: 'fromUserName',
        sorter: true,
        width: 85,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 90,
        sorter: true,
        render: text => {
          if (text === 'USER_MESSAGE') {
            return <Tag color="blue">用户消息</Tag>
          }
          if (text === 'FLOW_MESSAGE') {
            return <Tag color="Gainsboro">流程消息</Tag>
          }
          return <Tag color="orange">其它消息</Tag>
        },
      },
      {
        title: '接受时间',
        dataIndex: 'inTime',
        sorter: true,
        width: 180,
      },
      {
        title: '模块',
        dataIndex: 'modular',
        sorter: true,
      },
      {
        title: '已读/未读',
        dataIndex: 'readState',
        sorter: true,
        render: text => {
          if (text === 'READ_STATE_IS_NEW') {
            return <Tag color="orange">未读</Tag>
          }
          return <Tag color="blue">已读</Tag>
        },
      },
      {
        dataIndex: 'operation',
        title: '操作',
        fixed: 'right',
        width: 70,
        render: (text, record) => [
          <Tooltip title="查看">
            <a
              onClick={e => {
                e.stopPropagation()
                const { handleGetNoticeInfo } = this.props
                this.props.dispatch({
                  type: 'message/changeNoticeReadState',
                  payload: record.delId,
                  callback: () => {
                    handleGetNoticeInfo()
                  },
                })
                this.setState(() => ({
                  show: true,
                  current: {
                    disable: true,
                    info: record,
                  },
                }), () => {
                  this.accept.refresh({})
                })
              }}>
              <Icon type="search" />
            </a>
          </Tooltip>,
          <Divider type="vertical" />,
          <Tooltip title="删除">
            <a
              style={{ color: '#ff008c' }}
              onClick={e => {
                e.stopPropagation()
                Confirm({
                  onOk: () => {
                    this.props.dispatch({
                      type: 'message/delAcceptMessage',
                      payload: {
                        record,
                      },
                      callback: () => {
                        this.accept.refresh()
                      },
                    })
                  },
                  onCancel () { },
                }, 'many');
              }}>
              <Icon type="delete" />
            </a>
          </Tooltip>,
        ],
      },
    ];

    const colSent = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        sorter: true,
        width: 170,
      },
      {
        title: '已读',
        dataIndex: 'hasReadNum',
        width: 80,
      },
      {
        title: '未读',
        dataIndex: 'unRead',
        width: 80,
      },
      {
        title: '总数',
        dataIndex: 'allNum',
        width: 80,
      },
      {
        dataIndex: 'operation',
        title: '操作',
        fixed: 'right',
        width: 80,
        render: (text, record) => [
          <Tooltip title="查看">
            <a
              onClick={e => {
                e.stopPropagation()
                this.setState(() => ({
                  show: true,
                  current: {
                    disable: true,
                    info: record,
                  },
                }))
              }}>
              <Icon type="search" />
            </a>
          </Tooltip>,
          <Divider type="vertical" />,
          <Tooltip title="删除">
            <a
              style={{ color: '#ff008c' }}
              onClick={e => {
                e.stopPropagation()
                Confirm({
                  onOk: () => {
                    this.props.dispatch({
                      type: 'message/delSentMessage',
                      payload: {
                        record,
                      },
                      callback: () => {
                        this.sent.refresh()
                      },
                    })
                  },
                  onCancel () { },
                }, 'many');
              }}>
              <Icon type="delete" />
            </a>
          </Tooltip>,
        ],
      },
    ];
    return (
      <Modal
        title="消息"
        forceRender
        destroyOnClose
        centered width="70vw"
        visible={visible}
        wrapClassName={styles.messageModal}
        bodyStyle={{ padding: '0 4px 4px 4px', height: '550px' }}
        footer={
          <Button type="text" onClick={() => this.setState(() => ({ visible: false, activeKey: 'accept' }))}>取消</Button>
        }
        onCancel={() => this.setState(() => ({ visible: false, activeKey: 'accept' }))}
      >
        <Tabs defaultActiveKey="accept" onChange={this.handleChangeTab}>
          <TabPane tab="已接收" key="accept">
            <SingleTableWrap>
              <LinkQueryForm
                formItems={[
                  {
                    key: 'title',
                    label: '标题',
                    componentType: 'input',
                  },
                ]}
                verifySuccess={
                  value => {
                    this.accept.refresh({ title: value.title })
                  }
                }
              />
              <SingleTable
                ref={
                  tb => {
                    this.accept = tb
                  }}
                link="/v1/pmessage/inBox"
                bordered
                isSpin
                scroll={{ y: '310px' }}
                onChange={this.onChange}
                columns={colAccept}
                batchButton={[
                  <Button icon="delete" onClick={this.handleDelsAccept}>批量删除</Button>,
                ]}
              />
            </SingleTableWrap>
          </TabPane>
          <TabPane tab="已发送" key="sent">
            <SingleTableWrap>

              <LinkQueryForm
                formItems={[
                  {
                    key: 'title',
                    label: '标题',
                    componentType: 'input',
                  },
                ]}
                verifySuccess={
                  value => {
                    this.sent.refresh({ title: value.title })
                  }
                }
              />
              <SingleTable
                ref={
                  tb => {
                    this.sent = tb
                  }
                }
                link="/v1/pmessage/outBox"
                rowsDelLink="/v1/pmessages"
                bordered
                isSpin
                scroll={{ y: '310px' }}
                onChange={this.onChange}
                columns={colSent}
                batchButton={[
                  <RowsDelete
                    table={this.sent}
                    onCallback={() => {
                      this.sent.refresh({})
                    }}
                  >
                    批量删除
                    </RowsDelete>,
                ]}
              />
            </SingleTableWrap>
          </TabPane>
          <TabPane tab="草稿箱" key="braft">
            <SingleTableWrap>

              <LinkQueryForm
                formItems={[
                  {
                    key: 'title',
                    label: '标题',
                    componentType: 'input',
                  },
                ]}
                verifySuccess={value => {
                  this.braft.refresh({ title: value.title })
                }
                }
              />
              <SingleTable
                ref={
                  tb => {
                    this.braft = tb
                  }
                }
                link="/v1/pmessage/newBox"
                rowsDelLink="/v1/messageOut/del"
                bordered
                isSpin
                scroll={{ y: '310px' }}
                onChange={this.onChange}
                columns={colDraft}
                headerButton={[
                  <Button type="primary" icon="plus" onClick={() => this.setState(() => ({
                    show: true,
                    current: {
                      disable: false,
                      info: null,
                    },
                  }))}>新增</Button>,
                ]}
                batchButton={[
                  <Button icon="plus-circle" onClick={this.handlePublisBraft}>发布</Button>,
                  <RowsDelete
                    table={this.braft}
                    onCallback={() => {
                      this.braft.refresh({})
                    }}
                  >
                    批量删除
                    </RowsDelete>,
                ]}
              />
            </SingleTableWrap>
          </TabPane>
        </Tabs>
        <BraftModal
          show={this.state.show}
          current={this.state.current}
          braftTb={this.braft}
          dispatch={this.props.dispatch}
          handleGetNoticeInfo = {this.props.handleGetNoticeInfo}
          cancleShow={() => this.setState({ show: false })}
        />
      </Modal>
    );
  }
}
export default connect(({ message: { braftListInfo } }) => ({
  braftList: braftListInfo && braftListInfo.braftList,
}), null, null, { withRef: true })(MessageModal);
