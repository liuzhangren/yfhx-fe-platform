/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less'
import {
  message,
  Divider,
} from 'antd';
import moment from 'moment';
import {
  LinkQueryForm,
  SForm
} from 'view';
import MainSubTable from "@/components/Alink/MainSubTable"
import MainTable from "@/components/Alink/MainSubTable/MainTable"


import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
import LayoutTreeTable, { LayoutTree, LayoutTable } from "@/components/Alink/LayoutTreeTable"
import UserColumnModal from '@/components/Business/PersonModal';

import LinkTree from "@/components/Alink/Tree"

class PostForm extends Component {
  static defaultProps = {
    formItems: [
      {
        key: 'postName',
        label: '岗位名称',
        componentType: 'input',
        options: {
          rules: [
            { required: true },
            { min: 1, max: 25, message: "此项不能超过25个字符" }
          ],
        },
      },
      // {
      //   key: 'sortNo',
      //   label: '排序序号',
      //   componentType: 'inputNumber',
      //   options: {
      //     rules: [{ required: true }],
      //   },
      // },
      {
        key: 'path',
        label: '所属组织机构',
        componentType: 'input',
        props: { disabled: true },
        options: {
          rules: [{ required: true }],
        },
      }, {
        key: 'remark',
        label: '备注',
        componentType: 'input',
        options: {
          rules: [],
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
 * 岗位维护
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
        postName: ""
      },
    },
    user: {
      selectedRowKeys: [],
      selectedRows: [],
    },
  };

  componentDidMount() {
    const self = this;
    // 加载树
    const { dispatch } = this.props;
    // 加载岗位表格
    //this.refresh({ parentId: '-1' }, "pos", true)
    this.posTable.refresh({ orgNo: 'root', limit: 9999, page: 1 })

  }

  userModalConfirm(data, type) {
    if (type == 'ADD') {
      const obj = this.state.record;
      const param = data.map((item) => {
        return { postId: obj.id, account: item.account }
      })
      const params = { data: param };
      const { dispatch } = this.props;
      dispatch({
        type: 'postMaintence/addPostUserReal',
        payload: params
      })
        .then((res) => {
          console.log(res, "resresresres")
          if (res && res.code === 0) {
            message.success('添加成功')
            this.userTable.refresh({ postId: this.state.record.id }, "", true)
            this.userModal.hide();
          }
        })
    }
  }

  rowSelected = (record) => {
    this.setState({ record });
    //查询角色下用户、项目
    this.userTable.refresh({ postId: record.id })
  }


  render() {
    const self = this;
    const { menuType } = this.state;
    const { baseHeight, dispatch } = this.props;
    const disabled = this.state.currentId === '-1';
    return (

      <LayoutTreeTable>
        <LayoutTree>
          <LinkTree
            link="/get/v1/org-tree"
            childrenProps="list"
            nameProps="orgName"
            keyProps="orgNo"
            select={(selectedKeys, { selected, selectedNodes, node, event }) => {
              const { id, type: roleId, orgName: name, orgNo: orgNo, pid: parentId, path } = node.props.dataRef
              if (selectedKeys[0] === 'root') {
                this.setState({
                  porgNo: 'root',
                  path,
                  selectedKeys: '',
                  selected: true,
                }, () => {
                  this.posTable.refresh({ orgNo })
                })
              } else {
                this.setState({
                  parentId: parentId,
                  currentId: id,
                  selected,
                  orgNo: orgNo,
                  nodeData: node.props.dataRef,
                  record: null,
                  path
                });
                this.posTable.refresh({
                  orgNo
                })
              }
              this.userTable.clearAllData()
            }}
            check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys) }}
            showLine
          />
        </LayoutTree>
        <LayoutTable>
          <MainSubTable>
            <MainTable height="50%"
              title="岗位信息"
              queryForm={
                <LinkQueryForm
                  formItems={[
                    {
                      key: 'postName',
                      label: '岗位名称',
                      componentType: 'input'
                    }
                  ]}
                  verifySuccess={value => {
                    this.setState({
                      pos: {
                        ...this.state.pos,
                        searchVal: value
                      },
                      record: undefined
                    }, () => {
                      this.posTable.refresh({
                        // orgNo: self.state.orgNo,
                        ...value
                      })
                      // this.userModal.refresh({ postId: -1 })
                    })
                  }}
                />}
              table={
                {
                  ref: ref => this.posTable = ref,
                  link: "/get/v1/pposts",
                  rowDelLink: "/delete/v1/ppost",
                  rowAddLink: "/post/v1/ppost",
                  rowEditLink: "/put/v1/ppost",
                  rowsDelLink: "/delete/v1/pposts",
                  sortLink: '/v1/post-sort',
                  fontSort: true,
                  pageSize: '10',
                  showPagination: false,
                  columns: [
                    {
                      dataIndex: 'postName',
                      title: '岗位名称',
                      width: 200,
                    },
                    // {
                    //   dataIndex: 'orgNo',
                    //   title: '所属组织机构编号',
                    //   width: 200
                    // },
                    // {
                    //   dataIndex: 'updateDate',
                    //   title: '更新时间',
                    //   width: 250,
                    //   sorter: true,
                    //   render: (text, record, index) => {
                    //     if (text == '' || text == null) {
                    //       return <div>{text}</div>;
                    //     }
                    //     return <div>{moment(text).format('YYYY-MM-DD  HH:mm:ss')}</div>;
                    //   }
                    // },
                    {
                      dataIndex: 'path',
                      title: '所属组织机构',
                      width: 300,
                    },
                    {
                      dataIndex: 'remark',
                      title: '备注',
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
                              this.userTable.refresh({ postId: -1 }, "", true)
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
                    beforeShow={() => {
                      if (!this.state.selected) {
                        message.error("请选中父级节点");
                        return false;
                      }
                    }
                    }
                  >新增</AddRow>],
                  batchButton: [
                    <RowsDelete table={this.posTable} onCallback={() => {
                      this.userTable.refresh({ postId: -1 }, "", true)
                    }}>批量删除</RowsDelete>,

                  ],

                  /* 列表行点击事件 */
                  rowSelected: (record) => {
                    return this.rowSelected(record)
                  }
                }} />

            <MainTable height="50%"

              title="人员信息"

              table={{
                ref: ref => this.userTable = ref,
                link: "/get/v1/ppostUserReals",
                rowDelLink: "/delete/v1/ppostUserReal",
                rowAddLink: "/post/v1/ppostUserReal",
                rowEditLink: "/put/v1/ppost",
                rowsDelLink: "/v1/post-user-reals",
                onChange: (selectedRowKeys, selectedRows) => {
                  //this.onChange("user", selectedRowKeys, selectedRows)
                },
                headerButton: [
                  <AddRow
                    modal={this.userModal}
                    beforeShow={() => {
                      if (self.state.record == null) {
                        message.error('请选择岗位');
                        return false;
                      }
                    }
                    }
                  >新增用户</AddRow>
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
                    width: 70,
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

          <UserColumnModal
            userModalVisible={this.state.userModalVisible}
            onInit={userModal => {
              self.userModal = userModal;
            }}
            multiple={true}
            confirm={this.userModalConfirm.bind(this)}
          />

          <TableModal
            ref={menuModal => {
              self.menuModal = menuModal;
            }}
            title="岗位信息"
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
                        ...values,
                        orgNo: this.state.orgNo
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
                    path: this.state.path,
                    resourceCatagory: 2
                  });
                }
              }
            }}

          >

            <PostForm onFormLoad={form => (this.form = form)} type={this.state.type} />
          </TableModal>

          {/* <TableModal
            ref={userModal => {
              self.userModal = userModal;
            }}
            width={900}
            title="人员信息"
            table={this.userTable}
            onOk={(type, record) => {
              const self = this;
              //校验是否勾选
              const rows = this.state.selectedRowKeys;

              if (rows.length < 1) {
                message.error('请勾选数据');
                return false;
              }
              //得到选中的那条数据??

              try {
                if (type == "ADD") {
                  const obj = this.state.record;
                  const param = rows.map((item) => {
                    return { postId: obj.id, account: item }
                  })
                  const params = { data: param };
                  return params
                }
              } catch (e) { }
            }}
            onShow={() => {
              const orgNo = this.state.record.orgNo
              this.modalUser.refresh({ orgNo, systemUser: '1' })
            }}

          >
            <MainTable
              height={500}
              queryForm={<LinkQueryForm
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
                  this.modalUser.refresh({ ...value }, "", true)
                }}
              />} table={
                {
                  link: "/get/v1/pusers",
                  ref: (modalUser) => { this.modalUser = modalUser },
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                      selectedRowKeys,
                      selectedRows
                    })
                  },
                  columns: [
                    {
                      dataIndex: 'account',
                      title: '账号',
                      width: 100,
                    },
                    {
                      dataIndex: 'userName',
                      title: '用户名称',
                      width: 150,
                    },

                    {
                      dataIndex: 'nation',
                      title: '民族',

                      width: 100,
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
                      dataIndex: 'phone',
                      title: '手机号',
                      width: 300,
                    },
                  ]
                }
              }>
            </MainTable>
          </TableModal> */}


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
