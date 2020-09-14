import React, { Component } from 'react';
import { connect } from 'dva';

import {
  message,
  Divider,
  Button,
  Tooltip,
  Icon,
} from 'antd';
import moment from 'moment';
import { LinkQueryForm, Confirm } from 'view';
import PuserForm from '@/components/Puser/PuserForm';


import LinkTree from '@/components/Alink/Tree'

import Table from '@/components/Alink/SingleTable'

import { AddRow, TableModal, EditRow } from '@/components/Alink/Table/Table'
import LayoutTreeTable, { LayoutTree, LayoutTable } from '@/components/Alink/LayoutTreeTable'
import style from './index.less';

@connect(({ puser, loading }) => ({
  loading,
  puser,
}))
/**
 * 左侧树资料维护
 *
 */
class MenuPage extends Component {
  state = {
    orgNo: '',
    selected: false,
    columns: [],
  };

  componentDidMount() {
    if (this.tb) {
      this.tb.refresh({ orgNo: 'root', userType: 'OPERATOR', systemUser: 1 })
    }
    this.getUserInfo()
    this.forceUpdate()
  }

  getUserInfo = () => {
    const { userId } = JSON.parse(localStorage.getItem('userInfo'))
    if (userId === 'security' || userId === 'safety') {
      this.setState({
        columns: [
          {
            dataIndex: 'account',
            title: '账号',
            width: 100,
          },
          {
            dataIndex: 'userName',
            title: '姓名',
            width: 100,
          },
          {
            dataIndex: 'sex',
            title: '性别',
            render: type => (type == '0' ? '女' : '男'),
          },
          {
            dataIndex: 'birthday',
            title: '出生日期',
            width: 100,
            render: text => {
              if (text === '' || text === null) {
                return <div>{text}</div>;
              }
              return <div>{moment(text).format('YYYY-MM-DD')}</div>;
            },
          },
          {
            dataIndex: 'nation',
            title: '民族',
          },
          {
            dataIndex: 'phone',
            title: '手机号',
            width: 130,
          },
          {
            dataIndex: 'path',
            title: '所属组织机构',
            width: 300,
          },
        ],
      })
    } else {
      this.setState({
        columns: [
          {
            dataIndex: 'account',
            title: '账号',

            width: 100,
          },
          {
            dataIndex: 'userName',
            title: '姓名',

            width: 100,
          },
          {
            dataIndex: 'sex',
            title: '性别',

            render: type => (type == '0' ? '女' : '男'),
          },
          {
            dataIndex: 'birthday',
            title: '出生日期',

            width: 100,
            render: text => {
              if (text === '' || text === null) {
                return <div>{text}</div>;
              }
              return <div>{moment(text).format('YYYY-MM-DD')}</div>;
            },
          },
          {
            dataIndex: 'nation',
            title: '民族',

          },
          {
            dataIndex: 'phone',
            title: '手机号',

            width: 130,
          },
          {
            dataIndex: 'path',
            title: '所属组织机构',
            width: 300,
          },
          {
            dataIndex: 'operation',
            title: '操作',
            fixed: 'right',
            width: 200,
            render: (text, record) => {
              const arr = [
                <EditRow
                  record={record}
                  authrizetype="edit"
                  modal={this.menuModal}
                >
                  编辑
                </EditRow>,
                <Divider type="vertical" />,
                <a style={{ color: '#ff008c' }}
                  className={style.rowDelete}
                  authrizetype="cancel"
                  onClick={this.showDeleteConfirm.bind(this, { type: 'one', record })}
                >
                  <Tooltip title="取消用户">
                    <Icon type="delete"></Icon>
                  </Tooltip>
                </a>,
                <Divider type="vertical" />,
                <a authrizetype="reset" onClick={this.showSetConfirm.bind(this, { type: 'one', record })}>
                  {/* 重置密码 */}
                  <Tooltip title="重置密码">
                    <Icon type="reload"></Icon>
                  </Tooltip>
                </a>,
              ]
              return arr
            },
          },
        ],
      })
    }
  }


  showDeleteConfirm = ({ type, record }) => {
    const { dispatch } = this.props;
    const self = this
    Confirm({
      title: type === 'many' ? '您确定要将勾选的用户删除吗?' : '您确定要删除该用户？',
      content: '取消后将无法恢复',
      onOk() {
        // console.log('OK');
        if (type === 'many') {
          const list = record.map(item => {
            item = { ...item, systemUser: 0 }
            return item
          })
          console.log(list)
          dispatch({
            type: 'puser/updateManyPuserData',
            payload: list,
          }).then(res => {
            if (res) {
              self.tb.clearData()
              self.tb.refresh()
            }
          })
        } else {
          dispatch({
            type: 'puser/updatePuserData',
            payload: { ...record, systemUser: 0 },
          }).then(res => {
            if (res) {
              self.tb.clearData()
              self.tb.refresh()
            }
          })
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  showSetConfirm = ({ type, record }) => {
    const { dispatch } = this.props;
    const self = this
    Confirm({
      title: '您确定要重置密码吗?',
      content: '重置后将无法恢复',
      onOk() {
        // console.log('OK');
        if (type !== 'many') {
          dispatch({
            type: 'puser/resetPwd',
            payload: {
              id: record.id,
              // orgNo: self.state.orgNo
            },
          }).then(res => {
            if (res) {
              self.tb.refresh()
            }
          })
        }
      },
    });
  }

  treeSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    const { orgNo, type: roleId, resourceName: name, porgNo, path } = info.node.props.dataRef
    if (selectedKeys[0] === 'root') {
      this.setState({
        porgNo: 'root',
        orgNo,
        path,
        selectedKeys: '',
        selected: true,
        nodeData: info.node.props,
      }, () => {
        this.tb.refresh({ orgNo: 'root' }, '', true)
      })
    } else if (info.selected && info.node.props.dataRef) {
      this.setState({
        porgNo: selectedKeys[0],
        orgNo,
        selected: true,
        selectedKeys: selectedKeys[0],
        nodeData: info.node.props.dataRef,
        path,
      }, () => {
        this.tb.refresh({
          orgNo: selectedKeys,
          systemUser: 1,
        }, '', true)
      })
    } else {
      this.setState({
        selected: false,
        selectedKeys: '',
        porgNo: '',
        orgNo: '',
      }, () => {
        this.tb.refresh({ orgNo: selectedKeys, systemUser: 1 }, '', true)
      })
    }
  }

  onChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows)
    if (selectedRowKeys.length > 0) {
      this.setState({
        selectedRowKeys,
        selectedRow: selectedRows,
      })
    } else {
      this.setState({
        selectedRowKeys: [],
        selectedRow: [],
      })
    }
  }


  render() {
    const self = this;
    return (

      <LayoutTreeTable>
        <LayoutTree>
          <LinkTree
            select={this.treeSelect}
            showLine
            link="/get/v1/org-tree"
            childrenProps="list"
            nameProps="orgName"
            keyProps="orgNo"
          />
        </LayoutTree>
        <LayoutTable>
          <LinkQueryForm
            formItems={[
              {
                key: 'account',
                label: '用户账号',
                componentType: 'input',
              },
              {
                key: 'userName',
                label: '用户姓名',
                componentType: 'input',
              },

            ]}
            verifySuccess={value => {
              self.setState({
                searchValue: {
                  ...value,
                },
              }, () => {
                this.tb.refresh({ ...value }, '', true)
              })
            }}
          />

          <Table
            ref={tb => { this.tb = tb }}
            link="/get/v1/pusers"
            rowDelLink="/delete/v1/puser"
            rowAddLink="/post/v1/puser"
            rowEditLink="/put/v1/puser"
            rowsDelLink="/delete/v1/pusers"
            sortLink="/v1/user-sort"
            fontSort
            onChange={this.onChange}
            isAuthrize
            headerButton={[<AddRow
              modal={this.menuModal}
              authrizetype="add"
              beforeShow={() => {
                if (!this.state.selected || this.state.orgNo === 'root') {
                  message.error('请选中左侧组织机构二级节点');
                  return false;
                }
              }
              }
            >新增</AddRow>]}
            batchButton={[
              <Button authrizetype="cancels"
                icon="delete"
                onClick={this.showDeleteConfirm.bind(this, { type: 'many', record: this.state.selectedRow })}>
                批量取消
                  </Button>,
              // <RowsDelete table={this.tb} onCallback={() => { console.log("我是批量删除回调") }}>批量删除</RowsDelete>,
            ]}

            columns={this.state.columns}
          />

          <TableModal
            ref={menuModal => {
              self.menuModal = menuModal;
            }}
            width={1000}
            bodyStyle={{ padding: '20px 30px 0 0' }}
            title="人员信息"
            table={this.tb}
            onOk={(type, record) => {
              let data = '';
              this.form.validateFields((err, values) => {
                if (!err) {
                  data = values;
                  try {
                    if (type === 'UPDATE') {
                      data = { ...record, ...data, orgNo: this.state.orgNo }
                    } else {
                      data = {
                        systemUser: 1,
                        resourceCatagory: 2,
                        ...data,
                        orgNo: this.state.orgNo,
                      }
                    }
                  } catch (e) {
                    console.log(e)
                  }
                }
              });

              return data;
            }}
            onShow={record => {
              if (record) {
                let { birthday } = record;

                birthday = !birthday || (birthday === null) ? null : moment(birthday)
                this.form.setFieldsValue({
                  ...record,
                  birthday,
                });
              }
            }}
          >
            <PuserForm onFormLoad={form => { this.form = form }} type={this.state.type} />

          </TableModal>
        </LayoutTable>
      </LayoutTreeTable>


    );
  }
}

export default MenuPage
