/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  message,
  Divider,
  Button
} from 'antd';
import moment from 'moment';
import {
  LinkQueryForm,
  SForm
} from 'view';
import MainSubTable from "@/components/Alink/MainSubTable"
import MainTable from "@/components/Alink/MainSubTable/MainTable"
import UserColumnModal from '@/components/Business/PersonModal';

import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
import LayoutTreeTable, { LayoutTree, LayoutTable } from "@/components/Alink/LayoutTreeTable"

import LinkTree from "@/components/Alink/Tree"

class PostForm extends Component {
  static defaultProps = {
    formItems: [
      {
        key: 'roleName',
        label: '流程角色名称',
        componentType: 'input',
        options: {
          rules: [{ required: true }, { min: 1, max: 30, message: "最大长度50个字符" }],
        },
      },
      {
        key: 'roleDesc',
        label: '流程角色描述',
        componentType: 'textArea',
        options: {
          rules: [{ required: true }, { max: 200, message: "最大长度200个字符" }],
        },
        props: {
          autoSize: { minRows: 3, maxRows: 5 },

        },
      },
    ]
  };

  render() {
    const { onFormLoad, formItems } = this.props;

    return (
      <SForm
        ref={form => {
          onFormLoad(form);
        }}
        formItems={formItems}
      />
    );
  }
}

/**
 * 流程角色维护
 * 
 */
class PostMaintence extends Component {
  state = {
    parentId: '-1',
    currentId: '-1',
    record: null,
    nodeData: {},
    selectedRowKeys: [],
    pos: {
      selectedRowKeys: [],
      selectedRows: [],

      searchVal: {

      },
    },
    user: {
      selectedRowKeys: [],
      selectedRows: [],
    },
  };

  componentDidMount() {
    this.posTable.refresh({ roleType: 1 })
    this.forceUpdate();
  }
  userModalConfirm(data, type) {
    //调后台保存方法
    if (type == 'ADD') {
      const obj = this.state.record;
      const param = data.map((item) => {
        return { roleId: obj.id, account: item.account }
      })
      const params = { data: param };
      const { dispatch } = this.props;
      dispatch({
        type: 'role/addRoleUserReal',
        payload: {
          ...params,
          roleId: obj.id
        }
      }).then((res) => {
        if (res.code === 0) {
          message.success('添加成功')
          this.userTable.refresh()
        }
      })
    }
    this.userModal.hide();
  }

  render() {
    const self = this;
    const { menuType } = this.state;
    const { baseHeight, dispatch } = this.props;
    const disabled = this.state.currentId === '-1';
    return (

      <LayoutTreeTable>


        <LayoutTable>
          <MainSubTable>
            <MainTable height="60%"
              title="流程角色列表"
              queryForm={
                <LinkQueryForm
                  formItems={[
                    {
                      key: 'roleName',
                      label: '流程角色名称',
                      componentType: 'input'
                    },
                  ]}
                  verifySuccess={value => {
                    this.setState({
                      pos: {
                        ...this.state.pos,
                        searchVal: value
                      },
                      record: undefined
                    }, () => {
                      this.posTable.refresh({ ...value })
                    })
                  }}
                />}
              table={
                {
                  ref: ref => this.posTable = ref,
                  link: "/get/v1/proles",
                  rowDelLink: "/delete/v1/prole",
                  rowAddLink: "/post/v1/prole",
                  rowEditLink: "/put/v1/prole",
                  rowsDelLink: "/delete/v1/proles",
                  columns: [
                    {
                      dataIndex: 'roleName',
                      title: '流程角色名称',
                      width: 150,
                      sorter: true,
                    },
                    {
                      dataIndex: 'roleDesc',
                      title: '流程角色描述',
                      sorter: true,
                    },


                    {
                      dataIndex: 'operation',
                      title: '操作',
                      fixed: 'right',
                      width: 70,
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
                            <RowDelete table={this.posTable} record={record} onCallback={() => {
                              this.userTable.refresh({}, "", true)
                            }}>删除</RowDelete>
                          </div>
                        );
                      },
                    },
                  ],

                  onChange: (selectedRowKeys, selectedRows) => {
                    //this.onChange("pos", selectedRowKeys, selectedRows)
                  },

                  headerButton: [<AddRow
                    modal={this.menuModal}
                    record={this.state.nodeData}
                  // beforeShow={() => {
                  //   if (!this.state.selected) {
                  //     message.error("请选中父级节点");
                  //     return false;
                  //   }
                  // }
                  // }
                  >新增</AddRow>],
                  batchButton: [
                    <RowsDelete table={this.posTable} onCallback={() => {
                      this.userTable.refresh({}, "", true)
                    }}>批量删除</RowsDelete>,

                  ],

                  /* 列表行点击事件 */
                  rowSelected: (record) => {
                    self.setState({ record });
                    //查询角色下用户、项目
                    this.userTable.refresh({ roleId: record.id })
                  }
                }} />

            <MainTable height="40%"

              title="流程用户列表"

              table={{
                ref: ref => this.userTable = ref,
                link: "/get/v1/pusers",
                rowAddLink: "/post/v1/proleUserReal",
                rowsDelLink: "/delete/v1/proleUserReals/ids",
                onChange: (selectedRowKeys, selectedRows) => {
                  //this.onChange("user", selectedRowKeys, selectedRows)
                },
                headerButton: [
                  <Button
                    type='primary'
                    icon="plus"
                    onClick={() => {
                      if (self.state.record == null) {
                        message.error('请选择角色');
                        return;
                      }
                      self.userModal.show('ADD', self.state.record.id);
                    }
                    }
                  >新增用户</Button>,
                ],
                batchButton: [
                  <RowsDelete table={this.userTable} onCallback={() => { console.log("我是批量删除回调") }}>批量删除</RowsDelete>

                ],
                columns: [
                  {
                    dataIndex: 'account',
                    title: '用户账号',
                    sorter: true,
                    width: 100,
                  },
                  {
                    dataIndex: 'userName',
                    title: '用户姓名',
                    sorter: true,
                    width: 100
                  },
                  {
                    dataIndex: 'sex',
                    title: '性别',
                    width: 100,
                    render: type => {
                      return type == '0' ? '女' : '男';
                    },
                    sorter: true,
                  },
                  {
                    dataIndex: 'nation',
                    title: '民族',
                    width: 100,
                    sorter: true,
                  },

                  {
                    dataIndex: 'phone',
                    title: '手机号',
                    sorter: true,
                  }
                ],
              }}

            />

          </MainSubTable>

          <TableModal
            ref={menuModal => {
              self.menuModal = menuModal;
            }}
            title="流程角色信息"
            table={this.posTable}
            onOk={(type, record) => {
              const self = this;
              let data = ""
              this.form.validateFields((err, values) => {
                if (!err) {
                  const confirm = self.props.confirm || function () { };
                  try {
                    if (type == "ADD") {
                      data = {
                        resourceCatagory: 2,
                        roleType: 1,
                        ...values,
                      }
                    } else {
                      data = {
                        ...record,
                        ...values,
                      }
                    }
                  } catch (e) { }
                } else {
                  data = false
                }
              });
              return data;
            }}
            onShow={(record, type) => {
              this.form.resetFields();

              if (type == 'UPDATE') {
                if (this.form) {
                  this.form.setFieldsValue({
                    ...record,
                  });
                }
              } else {
                if (this.form) {
                  //回显
                  this.form.setFieldsValue({
                    orgNo: record.orgNo,
                    resourceCatagory: 2
                  });
                }
              }
            }}

          >

            <PostForm onFormLoad={form => (this.form = form)} type={this.state.type} />
          </TableModal>
          <UserColumnModal
            onInit={userModal => {
              self.userModal = userModal;
            }}
            multiple={true}
            confirm={this.userModalConfirm.bind(this)}
          />

        </LayoutTable>
      </LayoutTreeTable>


    );
  }
}
export default connect(({ global, loading, postMaintence }) => ({
  baseHeight: global.contentHeight,
  loading,
  postMaintence
}))(props => <PostMaintence {...props} />);
