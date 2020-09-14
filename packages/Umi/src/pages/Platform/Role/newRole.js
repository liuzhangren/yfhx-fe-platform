/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import RoleForm from '@/components/Role/RoleForm';
import UserColumnModal from '@/components/Business/PersonModal';
import MenuColumnModal from '@/components/Role/RoleModal';

import styles from './index.less'
import {
  Popconfirm,
  Row,
  message,
  Divider,
  Spin,
  Button,

} from 'antd';
import moment from 'moment';
import {
  LinkQueryForm,
  SForm
} from 'view';

import MainSubTable from "@/components/Alink/MainSubTable"
import MainTable from "@/components/Alink/MainSubTable/MainTable"
import LayoutTreeTable, { LayoutTree, LayoutTable } from "@/components/Alink/LayoutTreeTable"
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
import LinkTree from "@/components/Alink/Tree"

class PostForm extends Component {
  static defaultProps = {
    formItems: [
      {
        key: 'roleName',
        label: '角色名称',
        componentType: 'input',
        options: {
          rules: [{ required: true }, { min: 1, max: 30, message: "最大长度50个字符" }],
        },
      },
      {
        key: 'roleDesc',
        label: '角色描述',
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

  render () {
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

class MenuPage extends Component {
  state = {
    porgNo: undefined,
    orgNo: '-1',
    record: null,
    nodeData: {},
    selectedKeys: [],
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
    treeData: [],
    treeObj: {},
    allSelectedKeys: []
  };

  componentDidMount () {
    this.posTable.refresh({ roleType: 0 })
    this.forceUpdate();
  }

  userModalConfirm (data, type) {
    //调后台保存方法
    console.log(data)
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
        if (res && res.code === 0) {
          message.success('添加成功')
          this.userTable.refresh()
        }
      })
    }
    this.userModal.hide();
  }

  render () {
    const self = this;
    const { baseHeight } = this.props;
    return (
      <LayoutTreeTable>
        <LayoutTable>
          <MainSubTable>
            <MainTable height="50%"
              title="角色列表"
              queryForm={
                <LinkQueryForm
                  formItems={[
                    {
                      key: 'roleName',
                      label: '角色名称',
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
                      // this.userModal.refresh({ postId: -1 })
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
                      title: '角色名称',
                      width: 150,
                      sorter: true,
                    },
                    {
                      dataIndex: 'roleDesc',
                      title: '角色描述',
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

                              this.setState({ selectedKeys: [], allSelectedKeys: [] })

                              this.posTable.clearData()
                              this.userTable.clearAllData()
                              //this.userTable.refresh({}, "", true)
                            }}>删除</RowDelete>
                          </div>
                        );
                      },
                    },
                  ],
                  checkable: false,
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
                  >新增</AddRow>,
                  <Button className="noMain" icon="check-square" onClick={() => {
                    if (this.state.record == null) {
                      message.error('请选择角色');
                      return;
                    }
                    if (this.state.allSelectedKeys.length === 0) {
                      message.error('请选择资源节点');
                      return;
                    }
                    const keys = this.state.allSelectedKeys;
                    const param = keys.map((item) => {
                      return { roleId: this.state.record.id, resourceId: item }
                    })
                    const params = { data: param };
                    // 
                    this.props.dispatch({
                      type: 'role/addRoleResReal',
                      payload: params
                    }).then((res) => {
                      if (res && res.code === 0) {
                        message.success('保存成功');
                        let keys = [];
                        if (res.data.length > 0) {
                          res.data.map((item) => {
                            keys.push(item.resourceId);
                          })
                          // let obj = {};
                          // keys = keys.reduce((item, next) => {
                          //   obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                          //   return item;
                          // }, []);
                          // this.setState({
                          //   selectedKeys: keys
                          // })
                        } else {
                          this.setState({
                            selectedKeys: []
                          })
                        }
                      }
                    })

                  }}>保存授权</Button>,],
                  // batchButton: [
                  //   <RowsDelete table={this.posTable} onCallback={() => {
                  //     this.setState({ selectedKeys: [], allSelectedKeys: [] })
                  //     this.posTable.clearData()
                  //     this.userTable.clearAllData()
                  //     //this.userTable.refresh({}, "", true)
                  //   }}>批量删除</RowsDelete>,

                  // ],

                  /* 列表行点击事件 */
                  rowSelected: (record) => {
                    self.setState({ record });
                    const { dispatch } = this.props;
                    this.setState({
                      record
                    })
                    dispatch({
                      type: 'role/getRoleResReal',
                      payload: {
                        roleId: record.id
                      }
                    }).then((res) => {
                      if (res && res.code === 0) {
                        let keys = [], arr = [], noChild = [];
                        arr = res.data.map(item => {
                          return item.resourceId
                        })
                        if (res.data.length > 0) {
                          const { treeObj } = this.state;
                          res.data.map((item) => {
                            const data = treeObj[item.resourceId];
                            if (data) {
                              // 查找没有子节点的所有数据
                              if (!data.list || !data.list.length) {
                                noChild.push(data)
                                keys.push(data.id)
                              }
                              // 查找菜单节点,已授权的菜单节点
                              if (data.resourceType === 1) {
                                noChild.push(data)
                                keys.push(data.id + "_view")
                              }
                            }
                          })


                          this.setState({
                            selectedKeys: keys,
                            allSelectedKeys: arr
                          })
                        } else {
                          this.setState({
                            selectedKeys: []
                          })
                        }
                      }
                    })
                    //查询角色下用户、项目
                    this.userTable.refresh({ roleId: record.id })
                  }
                }} />

            <MainTable
              height="50%"
              title="用户列表"
              queryForm={
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
                    const { record } = this.state
                    console.log('this.state', this.state.record)
                    if (record) {
                      this.userTable.refresh({ ...value })
                    } else {
                      message.error('请选择角色')
                    }
                    // this.setState({
                    //   record: undefined
                    // }, () => {
                    //   this.userTable.refresh({ ...value })
                    // })
                  }}
                />}
              table={{
                ref: ref => this.userTable = ref,
                link: "/get/v1/proleUserReals",
                rowAddLink: "/post/v1/proleUserReal",
                rowDelLink: "/delete/v1/proleUserReal",
                rowsDelLink: "/delete/v1/proleUserReals",
                onChange: (selectedRowKeys, selectedRows) => {
                  //this.onChange("user", selectedRowKeys, selectedRows)
                },
                headerButton: [
                  <Button
                    type='primary'
                    icon="plus"
                    onClick={() => {
                      if (self.state.record == null) {
                        message.warn('请选择角色');
                        return;
                      }
                      self.userModal.show('ADD');
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
                  },
                  {
                    dataIndex: 'operation',
                    title: '操作',
                    fixed: 'right',
                    width: 90,
                    render: (text, record, index) => {
                      return (
                        <div>
                          <RowDelete table={this.userTable} record={record} onCallback={() => {
                          }}>删除</RowDelete>
                        </div>
                      );
                    },
                  },
                ],
              }}

            />


          </MainSubTable>
          <TableModal
            ref={menuModal => {
              self.menuModal = menuModal;
            }}
            title="角色信息"
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
                        roleType: 0,
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
        <LayoutTree right>
          <LinkTree
            link="/get/v1/resource-Ptree"
            childrenProps="list"
            nameProps="resourceName"
            keyProps="id"
            beforeSetData={(data) => {
              let treeObj = {}
              function getObj (arr) {
                arr.map(item => {
                  treeObj[item.id] = item
                  if (item.resourceType === 1) {
                    item.list = item.list || []
                    item.list.unshift({ ...item, id: item.id + "_view", resourceName: "浏览", resourceType: "-1", list: "" })
                  }
                  if (item.list && item.list.length) {
                    getObj(item.list)
                  }
                })
              }
              getObj(data)
              this.setState({ treeData: data, treeObj })
              return data
            }}
            check={(checkedKeys, info) => {
              this.setState({ selectedKeys: checkedKeys, allSelectedKeys: info })
            }}
            showLine
            checkedKeys={this.state.selectedKeys}
            //checkStrictly
            checkable
          />

        </LayoutTree>
      </LayoutTreeTable>

    );
  }
}

export default connect(({ role, loading, global }) => ({
  baseHeight: global.contentHeight,
  // layout: setting.layout,
  // menuData: menuModel.menuData,
  // breadcrumbNameMap: menuModel.breadcrumbNameMap,
  // ...setting,
  loading,
  role
}))(props => <MenuPage {...props} />);


