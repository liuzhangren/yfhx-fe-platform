/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less'
import {
  Row,
  message,
  Divider,
  Spin,
  Button,
} from 'antd';
import moment from 'moment';
import {
  LinkTree,
  Table as LinkTable,
  LinkQueryForm,
  Scard,
  SForm,
  Confirm,
  Collapse,
  Modal,
} from 'view';

// import PostForm from '@/components/Form/PostForm';
const { TabPane } = Tabs;
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
      {
        key: 'sortNo',
        label: '排序序号',
        componentType: 'inputNumber',
        options: {
          rules: [{ required: true }],
        },
      },
      {
        key: 'orgNo',
        label: '所属组织机构编号',
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


/**
 * 新增关联用户页面
 */
class UserColumnModal extends Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
    searchVal: {
      userName: "",
      account: "",
    },
    pagination: {
      limit: 10,
      page: 1
    },
    selectedRows: [],

  };
  componentDidMount () {
    const self = this;
    this.props.onInit(this);
  }

  handleUserCancel () {
    this.setState({
      visible: false,
    });
  }

  handleUserOk () {
    const self = this;
    //校验是否勾选
    const rows = this.state.selectedRowKeys;

    if (rows.length < 1) {
      message.error('请勾选数据');
      return;
    }
    //得到选中的那条数据??

    try {
      const confirm = self.props.confirm || function () { };
      if (self.state.type == "ADD") {
        confirm(
          {
            rows,
          },
          self.state.type
        );
      }
    } catch (e) { }


  }

  hide () {
    this.setState({
      visible: false,
    });
  }

  show (type, data) {
    this.setState(
      {
        visible: true,
        type: type,
        data,
      },
      () => {
        this.refresh({ systemUser: '1' })
      }
    );
  }
  refresh (data) {
    const { dispatch } = this.props;
    const { pagination, searchVal } = this.state
    dispatch({
      type: `postMaintence/getManageData`,
      payload: {
        ...pagination,
        ...searchVal,
        orgNo: this.state.data,
        ...data
      }
    })
  }

  render () {
    const { baseHeight } = this.props;
    return (
      <div>
        <Modal
          title='新增用户信息'
          visible={this.state.visible}
          onOk={this.handleUserOk.bind(this)}
          onCancel={this.handleUserCancel.bind(this)}
          forceRender
          okText="保存"
          cancelText="取消"
          width={900}
          destroyOnClose
        >
          <Row>
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
                this.setState({
                  searchValue: value
                }, () => {
                  this.refresh({ ...value }, true)
                })
              }}
            />
          </Row>
          <Row>
            <LinkTable
              columns={[
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

              ]}
              scroll={{ y: (baseHeight - 210) }}
              bordered
              isSpin
              loading={this.props.loading.global}
              pagination={this.props.postMaintence.userModal.pagination}
              onChange={(selectedRowKeys, selectedRows) => {
                this.setState({
                  selectedRowKeys,
                  selectedRows
                })
              }}
              dataSource={this.props.postMaintence.userModal.data}
              paginationChange={(page, size) => {
                this.refresh({ page, limit: size })
              }}
              onShowSizeChange={(current, pageSize) => {
                this.refresh({ page: 1, limit: pageSize })
              }}
              batchButton={[]}

            />
          </Row>

        </Modal>
      </div>
    );
  }
}

/**===岗位维护页面==== */
class PostColumnModal extends Component {
  static defaultProps = {
    loading: false,
  };

  state = {
    type: 'ADD',
    visible: false,
    data: {},
  };

  componentDidMount () {
    this.props.onInit(this);
  }

  handleCancel () {
    this.setState({
      visible: false,
    });
  }

  //验证数据是否填写和确认
  handleOk () {
    const self = this;
    this.form.validateFields((err, values) => {
      if (!err) {
        const confirm = self.props.confirm || function () { };
        try {

          if (self.state.type == "ADD") {
            confirm(
              {
                resourceCatagory: 2,
                ...values,
              },
              self.state.type
            );
          } else {
            confirm(
              {
                ...self.state.data,
                ...values,
              },
              self.state.type
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

  show (type, data) {
    this.setState(
      {
        visible: true,
        type: type,
        data,
      },
      () => {
        //刷新table内容
        this.form.resetFields();

        if (type == 'UPDATE') {
          if (this.form) {
            this.form.setFieldsValue({
              ...data,
            });
          }
        } else {
          if (this.form) {
            //回显
            this.form.setFieldsValue({
              orgNo: data.orgNo,
              resourceCatagory: 2
            });
          }
        }
      }
    );
  }

  render () {
    return (
      <div>
        <Modal
          title={this.state.type == 'ADD' ? '新增岗位信息' : '编辑岗位信息'}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          forceRender
          okText="确认"
          cancelText="取消"
          width={700}
        >
          <Spin spinning={this.props.loading}>
            <PostForm onFormLoad={form => (this.form = form)} type={this.state.type} />
          </Spin>
        </Modal>
      </div>
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
    pos: {
      disabled: true,
      visable: false,
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        limit: 10,
        page: 1
      },
      searchVal: {
        postName: ""
      },
      sorter: {
        sortName: '',
        orderType: 'ascend',
      },
    },
    user: {
      disabled: true,
      visable: false,
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        limit: 10,
        page: 1
      },
      sorter: {
        sortName: '',
        orderType: 'ascend',
      },
    },
  };

  componentDidMount () {
    const self = this;
    // 加载树
    const { dispatch } = this.props;
    dispatch({
      type: "postMaintence/getOrgtree"
    })
    dispatch({
      type: "postMaintence/clearData"
    })
    // 加载岗位表格
    this.refresh({ parentId: '-1' }, "pos", true)

  }
  componentWillUnmount () {
    // this.props.dispatch({
    // 	type: "adminMng/clearProject"
    // })
  }
  refresh (data, type, reload) {
    const { dispatch } = this.props
    let { pagination, searchVal, sorter } = this.state[type]
    const savePostId = {}
    const savePostPayload = {}
    if (this.state.record && type == 'user') {
      savePostId.postId = this.state.record.id
    }
    if (type === 'pos') {
      if (this.state[type].searchVal) {
        savePostPayload.postName = this.state[type].searchVal.postName
      }
      if (this.state.parentId || this.state.orgNo) {
        savePostPayload.parentId = this.state.parentId
        savePostPayload.orgNo = this.state.orgNo
      }
    }
    if (reload) {
      pagination = { page: 1, limit: 10 }
    }

    const method = type == 'user' ? 'getUserData' : 'getPosData'
    dispatch({
      type: `postMaintence/${method}`,
      payload: {
        ...pagination,
        ...savePostId,
        ...savePostPayload,
        ...data,
        ...searchVal,
        ...sorter
      }
    })
  }

  showDeleteConfirm ({ type, record }, e) {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    const self = this
    Confirm({
      onOk () {
        if (type == 'many') {
          const selectedRowkeys = self.state.pos.selectedRowKeys;
          dispatch({
            type: "postMaintence/delPostBatch",
            payload: selectedRowkeys.join(",")
          }).then(() => {
            const { limit = 10 } = self.state.pos
            self.setState({
              pos: {
                ...self.state.pos,
                disabled: true
              }
            }, () => {
              self.refresh({
                orgNo: self.state.orgNo || null,
                parentId: self.state.currentId,
                page: 1,
                limit
              }, "pos")
            })
            // todo 当选中项被删除时，更新用户和角色
          })
        } else {
          self.deletePost(record);
        }
      },
      onCancel () {
        console.log('Cancel');
      },
    }, type);
  }

  showDeleteConfirmUserRole ({ type }) {
    const { dispatch } = this.props;
    const self = this
    Confirm({
      onOk () {
        const rows = self.state[type].selectedRowKeys;
        const param = rows.map((item) => {
          return { postId: self.state.record.id, account: item }
        })
        const params = { data: param };
        dispatch({
          type: `postMaintence/delPostUserReal`,
          payload: params
        }).then(() => {
          const { limit = 10 } = self.state[type]
          message.success("删除成功");
          self.setState({
            user: {
              ...self.state[type],
              disabled: true
            }
          }, () => {
            self.refresh({
              postId: self.state.record.id, page: 1, limit
            }, type)
          })
        })
      },
      onCancel () {
        console.log('Cancel');
      },
    }, type);
  }

  onClickDelUser (type, selectedRowkeys) {
    const { dispatch } = this.props;
    dispatch({
      type: `adminMng/${type == 'project' ? 'delAdminProReal' : 'delAdminUserBatch'}`,
      payload: selectedRowkeys.join(",")
    }).then(() => {
      message.success("删除成功");
      if (type == "project") {
        this.refresh({ account: this.state.record.account }, type)
      } else {
        this.refresh({
          userType: 'PROJECT_ADMIN',
        }, type)
      }

    })
  }

  onClickDelPro () {
    const { dispatch } = this.props;
    const rows = this.state.project.selectedRows;
    const param = rows.map((item) => {
      return { account: this.state.record.account, appScheme: item.appScheme }
    })
    const params = { data: param };
    dispatch({
      type: `adminMng/delAdminProReal`,
      payload: {
        data: param
      }
    }).then(() => {
      message.success("删除成功");
      this.refresh({ account: this.state.record.account }, "project")
    })

  }

  onChange = (type, selectedRowKeys, selectedRows) => {
    const typestate = this.state[type]
    if (selectedRowKeys.length > 0) {
      // const keys = selectedRows.reduce((r, c) => {
      // 	return [
      // 		...r,
      // 		c.id
      // 	]
      // }, [])
      this.setState({
        [type]: {
          ...typestate,
          disabled: false,
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows
        }
      })
    } else {
      this.setState({
        [type]: {
          ...typestate,
          disabled: true,
          visable: false,
          selectedRowKeys: [],
          selectedRows: [],
        }
      })
    }
    console.log(this.state.pos)
  }
  paginationChange (type, page, size) {
    const { dispatch } = this.props;
    const managePagination = {
      page: page,
      limit: size
    }
    this.setState({
      [type]: {
        ...this.state[type],
        ...managePagination,
      }
    })

    this.refresh(managePagination, type)
  }

  handleTableSortChange (type, sorter) {
    this.setState({
      [type]: {
        ...this.state[type],
        sorter: {
          sortName: sorter.field,
          orderType: sorter.order,
        }
      }
    }, () => {
      this.refresh({}, type, true)
      this[`${type}Table`].clearData()
    })
  }

  sizeChange (type, current, pageSize) {
    const { dispatch } = this.props;
    const managePagination = {
      page: 1,
      limit: pageSize
    }
    this.setState({
      [type]: managePagination
    })
    this.refresh(managePagination, type)
  }

  //删除
  deletePost (record) {
    const { dispatch } = this.props;
    dispatch({
      type: "postMaintence/delPost",
      payload: record.id
    }).then(() => {
      const { limit = 10 } = this.state.pos
      this.refresh({
        parentId: this.state.currentId,
        orgNo: this.state.orgNo || null,
        page: 1,
        limit
      }, "pos")
    })
  }

  render () {
    const self = this;
    const { menuType } = this.state;
    const { baseHeight, dispatch } = this.props;
    const disabled = this.state.currentId === '-1';
    return (
      <div style={{ display: 'flex' }} className={styles.PostMaintence}>
        <div style={{ width: 'calc(16%)' }}>
          <Row>
            <Scard style={{ padding: '11px 18px', borderRight: '1px solid rgba(240,240,240)', overflowY: 'auto', height: 'calc(100vh - 110px)' }}>
              <Row>
                <LinkTree
                  treeData={this.props.postMaintence.treeData}
                  select={(selectedKeys, { selected, selectedNodes, node, event }) => {
                    const { id, type: roleId, orgName: name, orgNo: orgNo, pid: parentId } = node.props.dataRef
                    if (!selected) {
                      this.setState({
                        selected: null,
                        parentId: '-1',
                        currentId: '-1',
                        orgNo: null,
                      });
                      this.refresh({ parentId: '-1' }, "pos", true)
                    } else {
                      this.setState({
                        parentId: parentId,
                        currentId: id,
                        selected,
                        orgNo: orgNo,
                        nodeData: node.props.dataRef,
                        record: null
                      });
                      this.refresh({ parentId: id, orgNo: orgNo }, "pos", true)
                      this.refresh({ postId: '-1' }, "user", true)
                      this.posTable.setState({ rowSelectedKey: '' })
                    }
                  }}
                  check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys) }}
                  showLine
                />
              </Row>
            </Scard>
          </Row>
        </div>
        <div style={{ width: 'calc(84%)' }}>
          <Collapse
            style={{ padding: '0px' }}
            defaultActiveKey={['1', '2']}
            collapseItems={[
              {
                key: '1',
                header: '岗位信息',
                props: {
                  showArrow: false
                },
                content: (
                  <div>
                    <Row >
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
                            this.refresh({ orgNo: self.state.orgNo, ...value }, "pos", true)
                            this.refresh({ postId: '-1' }, "user", true)
                            this.posTable.clearData()
                          })
                          // self.table.refresh({
                          // 	orgNo: self.state.orgNo,
                          // 	...value,
                          // });
                        }}
                      />
                    </Row>
                    <Row>
                      <Scard style={{ padding: '0 6px' }}>
                        <LinkTable
                          isShowExport={false}
                          ref={ref => this.posTable = ref}
                          columns={[
                            {
                              dataIndex: 'postName',
                              title: '岗位名称',
                              width: 200,
                              sorter: true,
                            },
                            {
                              dataIndex: 'sortNo',
                              title: '排序序号',
                              width: 200,
                              sorter: true,
                            },
                            // {
                            //   dataIndex: 'orgNo',
                            //   title: '所属组织机构编号',
                            //   width: 200
                            // },
                            {
                              dataIndex: 'updateDate',
                              title: '更新时间',
                              width: 250,
                              sorter: true,
                              render: (text, record, index) => {
                                if (text == '' || text == null) {
                                  return <div>{text}</div>;
                                }
                                return <div>{moment(text).format('YYYY-MM-DD  HH:mm:ss')}</div>;
                              }
                            }, {
                              dataIndex: 'remark',
                              title: '备注',
                            },
                            {
                              dataIndex: 'operation',
                              title: '操作',
                              fixed: 'right',
                              width: 90,
                              render: (text, record, index) => {
                                return (
                                  <div>
                                    <a
                                      onClick={(e) => {
                                        if (e) e.stopPropagation();
                                        self.menuModal.show('UPDATE', record);
                                      }}
                                    >编辑
																				</a>
                                    <Divider type="vertical" />
                                    <a onClick={this.showDeleteConfirm.bind(this, { type: 'one', record })}>
                                      删除
																			</a>
                                  </div>
                                );
                              },
                            },
                          ]}
                          bordered
                          isSpin
                          loading={this.props.posTableLoading}
                          pagination={this.props.postMaintence.pos.pagination}
                          onChange={(selectedRowKeys, selectedRows) => {
                            this.onChange("pos", selectedRowKeys, selectedRows)
                          }}
                          dataSource={this.props.postMaintence.pos.data}
                          paginationChange={(page, size) => {
                            this.paginationChange("pos", page, size)
                          }}
                          sortChange={(pagination, filters, sorter) => {
                            this.handleTableSortChange("pos", sorter)
                          }}
                          onShowSizeChange={(current, pageSize) => {
                            this.sizeChange("pos", current, pageSize)
                          }}
                          scroll={{ y: (baseHeight / 2 - 190) }}
                          batchButton={[
                            <Button
                              type="primary"
                              icon="plus"
                              onClick={() => {
                                if (!this.state.selected) {
                                  message.error("请选中父级菜单");
                                  return;
                                }
                                self.menuModal.show('ADD', this.state.nodeData);
                              }}
                            >新增</Button>,
                            <Button icon='delete'
                              disabled={this.state.pos.disabled}
                              onClick={this.showDeleteConfirm.bind(this, { type: 'many' })}
                            >
                              批量删除
															</Button>
                          ]}

                          /* 列表行点击事件 */
                          rowSelected={(record) => {
                            self.setState({ record });
                            //查询角色下用户、项目
                            this.refresh({ postId: record.id }, "user", true)
                          }}
                        />
                      </Scard>
                    </Row>
                  </div>
                )
              },
              {
                key: '2',
                header: '用户信息',
                props: {
                  showArrow: false
                },
                content: (
                  <Row>
                    <Scard style={{ padding: '0 6px' }}>
                      <LinkTable
                        ref={ref => this.userTable = ref}
                        columns=
                        {[
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
                        ]}
                        scroll={{ y: (baseHeight / 2 - 200) }}
                        bordered
                        isSpin
                        loading={this.props.userTableLoading}
                        pagination={this.props.postMaintence.user.pagination}
                        onChange={(selectedRowKeys, selectedRows) => {
                          this.onChange("user", selectedRowKeys, selectedRows)
                        }}
                        dataSource={this.props.postMaintence.user.data}
                        paginationChange={(page, size) => {
                          this.paginationChange("user", page, size)
                        }}
                        onShowSizeChange={(current, pageSize) => {
                          this.sizeChange("user", current, pageSize)
                        }}
                        sortChange={(pagination, filters, sorter) => {
                          this.handleTableSortChange("user", sorter)
                        }}
                        batchButton={[<Button
                          type="primary"
                          icon="plus"
                          onClick={() => {
                            if (self.state.record == null) {
                              message.error('请选择岗位');
                              return;
                            }
                            self.userModal.show('ADD', self.state.record.orgNo);
                          }}
                        >新增用户</Button>,
                        <Button icon='delete'
                          disabled={this.state.user.disabled}
                          onClick={this.showDeleteConfirmUserRole.bind(this, { type: 'user' })}
                        >
                          批量删除
													</Button>
                        ]}
                      />
                    </Scard>
                  </Row>
                )
              },
            ]}
          />
          <PostColumnModal
            onInit={menuModal => {
              self.menuModal = menuModal;
            }}
            confirm={(data, type) => {
              if (type == 'UPDATE') {
                dispatch({
                  type: "postMaintence/updatePost",
                  payload: data
                }).then(() => {
                  const { limit = 10 } = this.state.pos
                  this.refresh({
                    parentId: self.state.currentId,
                    orgNo: self.state.orgNo,
                    page: 1,
                    limit
                  }, "pos")
                  message.success('操作成功');
                  self.menuModal.hide();
                })
              }
              if (type == 'ADD') {
                dispatch({
                  type: "postMaintence/addPost",
                  payload: { ...data }
                }).then(() => {
                  const { limit = 10 } = this.state.pos
                  this.refresh({
                    parentId: self.state.currentId,
                    orgNo: self.state.orgNo,
                    page: 1,
                    limit
                  }, "pos")
                  message.success('操作成功');
                  self.menuModal.hide();
                })

              }
            }}
          />

          <UserColumnModal
            onInit={userModal => {
              self.userModal = userModal;
            }}
            confirm={(data, type) => {
              //调后台保存方法
              if (type == 'ADD') {
                const obj = this.state.record;
                const param = data.rows.map((item) => {
                  return { postId: obj.id, account: item }
                })
                const params = { data: param };
                dispatch({
                  type: "postMaintence/addPostUserReal",
                  payload: params
                }).then(() => {
                  this.refresh({ postId: this.state.record.id }, "user", true)
                  message.success('操作成功');
                  self.userModal.hide();
                })
              }
            }}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}
export default connect(({ global, loading, postMaintence }) => ({
  baseHeight: global.contentHeight,
  loading,
  postMaintence,
  posTableLoading: loading.effects['postMaintence/getPosData'],
  userTableLoading: loading.effects['postMaintence/getUserData'],
}))(props => <PostMaintence {...props} />);
