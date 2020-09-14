/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  message,
  Divider,
} from 'antd';
import moment from 'moment';
import {
  LinkQueryForm,
} from 'view';
import LinkTree from "@/components/Alink/Tree"

import Table from "@/components/Alink/SingleTable"
import SingleTableWrap from "@/components/Alink/SingleTable/SingleTableWrap"
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
import LayoutTreeTable, { LayoutTree, LayoutTable } from "@/components/Alink/LayoutTreeTable"
import ProCategoryForm from '@/components/ProCategoryForm';


/**
 * 左侧树资料维护
 *
 */
class ProCategory extends Component {
  state = {
    selected: false,
    selectedRowKeys: [],
    selectedRow: [],
    searchValue: {},
    nodeData: '',
    pid: ''
  };

  componentDidMount () {
    if (this.tb) {
      this.tb.refresh({ pid: 'root' })
    }

  }

  onChange = (rowCheckableKeys, selectedRows) => {
    this.setState({ selectedRowKeys: rowCheckableKeys, selectedRow: selectedRows })
  }

  async treeSelect (selectedKeys, info) {
    if (selectedKeys[0] === 'root') {
      this.setState({
        selected: true,
        selectedKeys,
        pid: info.node.props.dataRef.id,

        nodeData: info.node.props.dataRef
      }, () => {
        this.tb.refresh({ pid: selectedKeys }, "", true)
      })


    } else if (info.selected && info.node.props.dataRef) {

      this.setState({
        pid: info.node.props.dataRef.id,
        selected: false,
        selectedKeys,
        nodeData: info.node.props.dataRef,
      }, () => {
        this.tb.refresh({ pid: selectedKeys }, "", true)
      })
    } else {
      this.setState({
        selected: false,
        selectedKeys: '',
        pid: ''
      })
    }
  }
  render () {

    const self = this;
    const { menuType } = this.state;
    const { baseHeight } = this.props;
    const disabled = this.state.orgNo === '-1';
    return (
      <LayoutTreeTable>
        <LayoutTree>
          <LinkTree
            select={this.treeSelect.bind(this)}
            check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys, '001') }}
            showLine
            ref={(tree) => { this.tree = tree }}
            link="/process/flow-category/getTrees"
            childrenProps="children"
            nameProps="text"
            keyProps="id"
          />
        </LayoutTree>
        <LayoutTable>
          <SingleTableWrap>
            <LinkQueryForm
              formItems={[
                {
                  key: 'name',
                  label: '分类名称',
                  componentType: 'input',
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
              link="/process/flow-category/v1/wfxProCategorys"
              rowDelLink="/process/flow-category/v1/wfxProCategory"
              rowEditLink="/process/flow-category/v1/wfxProCategory"
              rowAddLink="/process/flow-category/v1/wfxProCategory"
              rowsDelLink="/process/flow-category/v1/wfxProCategorys"
              onChange={this.onChange}
              headerButton={[<AddRow
                modal={this.menuModal}
                record={this.state.nodeData}
                beforeShow={() => {
                  if (!this.state.selected) {
                    message.error("请选中流程分类根节点");
                    return false;
                  }
                }
                }
              >新增</AddRow>,
              ]}
              batchButton={[

                <RowsDelete table={this.tb} onCallback={() => {
                  this.tree.refresh()
                }}>批量删除</RowsDelete>,
              ]}
              columns={[
                {
                  dataIndex: 'name',
                  title: '分类名称',
                  sorter: true,
                  width: 200,
                },
                // {
                //     dataIndex: 'status',
                //     title: '状态',
                //     sorter: true,
                //     width: 80,
                //     render: type => {
                //         return type == 1 ? '草稿' : '已发布';
                //     },
                // },

                // {
                //     dataIndex: 'version',
                //     title: '版本',
                //     sorter: true,
                //     width: 80,
                // },
                // {
                //     dataIndex: 'sortNo',
                //     title: '排序',
                //     sorter: true,
                //     width: 80
                // },
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
                          type={'UPDATE'}
                          modal={this.menuModal}
                        >
                          编辑
                                                </EditRow>
                        <Divider type="vertical" />
                        <RowDelete table={this.tb} record={record} onCallback={() => {
                          this.tree.refresh()
                        }}>删除</RowDelete>


                      </div>
                    );
                  }
                }
              ]}

            />
            <TableModal
              ref={menuModal => {
                self.menuModal = menuModal;
              }}
              width={900}
              title="流程分类"
              table={this.tb}
              onOk={(type, record) => {
                let data = "";
                this.form.validateFields((err, values) => {
                  if (!err) {
                    data = values;
                  }
                });
                if (type === "UPDATE") {
                  data = { ...record, ...data }
                } else {
                  data = {
                    pid: record.id,
                    ...data,
                    flowType: 'activiti'
                  }
                }
                return data;
              }}
              onCallBack={() => {
                this.tree.refresh()
              }}
              onShow={(record, type) => {
                if (type === 'UPDATE') {
                  if (record) {
                    this.form.setFieldsValue({
                      ...record
                    });
                  }
                }
              }}
            >
              <ProCategoryForm
                onFormLoad={(form) => {
                  this.form = form
                }}
                type={this.state.type}
              />
            </TableModal>

          </SingleTableWrap>
        </LayoutTable>
      </LayoutTreeTable>
    );
  }
}

export default connect(({ procategory, loading, global }) => ({
  baseHeight: global.contentHeight,
  loading,
  procategory
}))(props => <ProCategory {...props} />);


