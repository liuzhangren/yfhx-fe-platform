/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  message,
  Divider,
  Button,
  Tooltip
} from 'antd';
import {
  SettingOutlined
} from '@ant-design/icons';
import moment from 'moment';

import { LinkQueryForm, Scard, Confirm } from 'view';

import PuserForm from '@/components/Puser/PuserForm';

import LinkTree from "@/components/Alink/Tree"

import Table from "@/components/Alink/SingleTable"
import SingleTableWrap from "@/components/Alink/SingleTable/SingleTableWrap"
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
import LayoutTreeTable, { LayoutTree, LayoutTable } from "@/components/Alink/LayoutTreeTable"



/**
 * 左侧树资料维护
 *
 */
class MenuPage extends Component {
  state = {
    porgNo: undefined,
    orgNo: '',
    selected: false,
  };

  componentDidMount() {
    if (this.tb) {
      this.tb.refresh({ orgNo: 'root', userType: 'OPERATOR' })
      //this.forceUpdate()
      this.setState({})
    }
    this.forceUpdate()
  }

  showSetConfirm({ type, record }) {
    const { dispatch } = this.props;
    const self = this
    Confirm({
      title: type === 'many' ? '您确定要将勾选的人员设置为系统用户吗?' : '您确定要该人员设置为系统用户吗？',
      content: '设置后将无法恢复',
      onOk() {
        // console.log('OK');
        if (type == 'many') {
          dispatch({
            type: 'puser/setManyPuser',
            payload: { selectedRowKeys: record }
          }).then((res) => {
            if (res) {
              self.tb.clearData()
              self.tb.refresh()
            }
          })
        } else {
          dispatch({
            type: 'puser/setPuser',
            payload: {
              id: record.id,
              orgNo: self.state.orgNo
            }
          }).then((res) => {
            if (res) {
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

  async treeSelect(selectedKeys, info) {
    // console.log('选中树节点', selectedKeys, info.node.props.dataRef, info);
    const { dispatch } = this.props;
    const { orgNo, type: roleId, resourceName: name, porgNo: porgNo, path } = info.node.props.dataRef
    if (selectedKeys[0] === 'root') {
      this.setState({
        porgNo: 'root',
        orgNo: 'root',
        selectedKeys: '',
        selected: false
      }, () => {
        this.tb.refresh({ orgNo: 'root' }, true)
      })
    } else if (info.selected && info.node.props.dataRef) {
      this.setState({
        porgNo: selectedKeys[0],
        orgNo: orgNo,
        selected: true,
        selectedKeys: selectedKeys[0]

      }, () => {
        this.tb.refresh({ orgNo: selectedKeys, }, "", true)
      })
    } else {
      this.setState({
        selected: false,
        selectedKeys: '',
        porgNo: '',
        orgNo: ''
      }, () => {
        this.tb.refresh({ orgNo: selectedKeys, }, "", true)
      })
    }
  }


  onChange = (rowCheckableKeys, selectedRows) => {
    this.setState({ selectedRowKeys: rowCheckableKeys, selectedRow: selectedRows })
  }
  render() {
    const self = this;
    const { menuType } = this.state;
    const disabled = this.state.orgNo === '-1';
    return (
      <LayoutTreeTable>
        <LayoutTree>
          <LinkTree
            select={this.treeSelect.bind(this)}
            check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys, '001') }}
            showLine
            link="/get/v1/org-tree"
            childrenProps="list"
            nameProps="orgName"
            keyProps="orgNo"
          />
        </LayoutTree>
        <LayoutTable>
          <SingleTableWrap>
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

              ]}
              verifySuccess={value => {
                self.setState({
                  searchValue: {
                    ...value,
                  }
                }, () => {
                  this.tb.refresh({ ...value }, "", true)
                })
              }}
            />
            <Table
              ref={(tb) => { this.tb = tb }}
              link="/get/v1/pusers"
              rowDelLink="/delete/v1/puser"
              rowAddLink="/post/v1/puser"
              rowEditLink="/put/v1/puser"
              rowsDelLink="/delete/v1/pusers"
              sortLink="/v1/user-sort"
              fontSort
              onChange={this.onChange}
              headerButton={[<AddRow
                modal={this.menuModal}
                beforeShow={() => {
                  if (!this.state.selected || this.state.orgNo === "root") {
                    message.error("请选中左侧组织机构二级节点");
                    return false;
                  }
                }
                }
              >新增</AddRow>]}
              batchButton={[
                <Button
                  icon='check-square'
                  className="noMain"
                  onClick={this.showSetConfirm.bind(this, { type: 'many', record: this.state.selectedRowKeys })}>
                  批量设置
                    </Button>,
                <RowsDelete table={this.tb} >批量删除</RowsDelete>,
              ]}

              columns={[
                {
                  dataIndex: 'account',
                  title: '账号',
                },
                {
                  dataIndex: 'userName',
                  title: '姓名',
                },
                {
                  dataIndex: 'sex',
                  title: '性别',
                  width: 100,
                  render: type => {
                    return type == '0' ? '女' : '男';
                  },
                },
                {
                  dataIndex: 'birthday',
                  title: '出生日期',
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
                  width: 100
                }, {
                  dataIndex: 'phone',
                  title: '手机号',
                  width: 130
                },
                {
                  dataIndex: 'systemUser',
                  title: '是否系统用户',
                  width: 130,
                  render: text => {
                    return text === 0 ? '否' : '是';
                  },
                },
                {
                  dataIndex: 'path',
                  title: '所属组织机构',
                  width: 300
                },
                {
                  dataIndex: 'operation',
                  title: '操作',
                  fixed: 'right',
                  width: 100,
                  render: (text, record, index) => {
                    return (
                      <div>
                        <EditRow
                          record={record}

                          modal={this.menuModal}
                        >
                          编辑
                              </EditRow>
                        <Divider type="vertical" />
                        <RowDelete table={this.tb} record={record} onCallback={() => { console.log("我是删除成功回调") }}>删除</RowDelete>
                        <Divider type="vertical" />
                        <Tooltip title="设置用户">
                          <SettingOutlined onClick={this.showSetConfirm.bind(this, { type: 'one', record })}></SettingOutlined>
                        </Tooltip>
                      </div>
                    );
                  },
                },
              ]}

            />

            <TableModal
              ref={menuModal => {
                self.menuModal = menuModal;
              }}
              width={1000}
              bodyStyle={{ padding: "20px 30px 0 0" }}
              title="人员信息"
              table={this.tb}
              onOk={(type, record) => {
                let data = "";
                this.form.validateFields((err, values) => {
                  if (!err) {
                    data = values;
                    try {
                      if (type === "UPDATE") {

                        data = { ...record, ...data, orgNo: this.state.orgNo }
                      } else {


                        data = {
                          systemUser: 0,
                          resourceCatagory: 2, ...data, orgNo: this.state.orgNo
                        }
                      }
                    } catch (e) { }
                  }
                });

                return data;
              }}
              onShow={(record) => {
                if (record) {
                  let birthday = record.birthday;

                  birthday = !birthday || (birthday === null) ? null : moment(birthday)
                  this.form.setFieldsValue({
                    ...record,
                    birthday
                  });
                }
              }}
            >
              <PuserForm onFormLoad={form => (this.form = form)} type={this.state.type} />

            </TableModal>
          </SingleTableWrap>
        </LayoutTable>
      </LayoutTreeTable>
    );
  }
}

export default connect(({ puser, loading, global }) => ({
}))(props => <MenuPage {...props} />);


