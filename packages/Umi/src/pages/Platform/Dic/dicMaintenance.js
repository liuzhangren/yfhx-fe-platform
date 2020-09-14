/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  message,
  Divider,
  Button,
} from 'antd';
import moment from 'moment';
import { LinkQueryForm, Scard, Confirm } from 'view';
import EquipeBusModal from '@/components/EquipeBus/EquipeBusModalDev';

import Table from "@/components/Alink/SingleTable"
import LinkTree from "@/components/Alink/Tree"
import SingleTableWrap from "@/components/Alink/SingleTable/SingleTableWrap"
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from "@/components/Alink/Table/Table"
import LayoutTreeTable, { LayoutTree, LayoutTable } from "@/components/Alink/LayoutTreeTable"


/**
 * 左侧树资料维护
 *
 */
@connect(({ dictionary, loading, global }) => {
  return {
    dictionary,
    loading,
    baseHeight: global.contentHeight,
  }
})
class MenuPage extends React.Component {
  state = {
    nodeData: { dictName: "" },
    selectedKeys: [],
    selected: false,
    type: 'ADD'
  };

  componentDidMount() { }



  async treeSelect(selectedKeys, info) {
    if (selectedKeys.length > 0) {
      if (selectedKeys[0] === 'EQUIP') {
        this.setState({
          selected: false,
        })
      } else {
        this.setState({
          selected: true,
          selectedKeys,
          nodeData: info.node.props.dataRef
        }, () => {
          this.tb.refresh({ pcode: selectedKeys[0], limit: 9999, page: 1 }, "", true)
        })
      }
    } else {
      this.setState({
        selected: false,
        selectedKeys: [],
      })
    }
  }





  render() {
    const self = this;
    const { selected, selectedKeys, nodeData } = this.state
    return (
      <LayoutTreeTable>
        <LayoutTree>
          <LinkTree
            ref={ref => this.LinkTree = ref}
            select={this.treeSelect.bind(this)}
            check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys, '001') }}
            showLine
            link="/v1/dict-tree"
            nameProps="dictName"
            keyProps="dictCode"
            childrenProps="list"
          />
        </LayoutTree>
        <LayoutTable>
          <SingleTableWrap>
            <LinkQueryForm
              formItems={[
                {
                  key: 'dictCode',
                  label: '字典编号',
                  componentType: 'input',
                },
                {
                  key: 'dictName',
                  label: '字典名称',
                  componentType: 'input',
                },
                {
                  key: 'isEffective',
                  label: '是否有效',
                  componentType: 'optionSelect',
                  props: {
                    options: [{ value: '1', label: '是', }, { value: '0', label: '否' }]
                  }
                },
              ]}
              ref={query => this.query = query}
              verifySuccess={value => {
                this.tb.refresh({ ...value, pcode: selectedKeys[0] }, "", true)
              }}
            />
            <Table
              ref={(tb) => { this.tb = tb }}
              link="/get/v1/pdicts"
              fontSort
              sortLink='/v1/pdict-sort'
              rowAddLink="/post/v1/pdict"
              rowDelLink="/delete/v1/pdict"
              rowEditLink="/put/v1/pdict"
              rowsDelLink="/delete/v1/pdicts"
              showPagination={false}
              onChange={this.onChange}
              headerButton={
              [<AddRow
                modal={this.menuModal}
                beforeShow={() => {
                  if (!selected) {
                    message.warn('请选择字典!')
                    return false
                  }
                }}
              >
                新增
                    </AddRow>,
                // <Button
                //   icon='check-square'
                //   className="noMain"
                //   onClick={this.showUpdateCacheConfirm.bind(this, { type: 'many', record: this.state.selectedRowKeys })}>
                //   更新缓存
                // </Button>,
              ]
            }
              batchButton={[
              <RowsDelete
                table={this.tb}
                onCallback={() => {
                  this.LinkTree.refresh()
                }}>批量删除</RowsDelete>,
            ]}
              columns={[
              {
                dataIndex: 'dictCode',
                title: '字典编号',
                width: 180,
              },
              {
                dataIndex: 'dictName',
                title: '字典名称',
                width: 240
              },
              // {
              //   dataIndex: 'sort',
              //   title: '排序',
              //   sorter: true,
              //   width: 80
              // },
              {
                dataIndex: 'isEffective',
                title: '是否有效',
                width: 100,
                render: text => {
                  return text === '1' ? '是' : '否'
                }
              },
              {
                dataIndex: 'remark',
                title: '备注',
              },
              {
                dataIndex: 'operation',
                title: '操作',
                fixed: 'right',
                width: 80,
                render: (text, record, index) => {
                  return (
                    <div>
                      <EditRow record={record} modal={this.menuModal}>编辑</EditRow>
                      <Divider type="vertical" />
                      <RowDelete
                        table={this.tb}
                        record={record}
                        onCallback={() => {
                          this.LinkTree.refresh()
                        }}
                      >删除</RowDelete>
                    </div>
                  );
                },
              },
            ]}
            />

            <TableModal
              ref={menuModal => { self.menuModal = menuModal }}
              width={1000}
              bodyStyle={{ padding: 24 }}
              title={`字典信息`}
              table={this.tb}
              okText="保存"
              onOk={(type, record) => {
                let data = "";
                this.form.validateFields((err, values) => {
                  if (!err) {
                    if (type === "UPDATE") { //更新 将name改回成pcode
                      data = { ...record, ...values, pcode: record.pcode, dictCode: values.dictCode.replace(/(^\s*)|(\s*$)/g, '') };
                    } else {//新增 将name改回成pcode
                      const { selectedKeys } = this.state
                      data = { ...values, pcode: selectedKeys[0], dictCode: values.dictCode.replace(/(^\s*)|(\s*$)/g, '') }
                    }
                  }
                });
                return data;
              }}
              onShow={(record, type) => {
                setTimeout(() => {
                  this.form.setFieldsValue({
                    ...record,
                    pcode: nodeData.dictName || '',
                  });
                }, 300);
                this.setState({ type })
              }}
              onCallBack={() => {
                this.LinkTree.refresh()
              }}
            >
              <EquipeBusModal
                onFormLoad={(form) => {
                  this.form = form
                }}
                type={this.state.type}
              />

            </TableModal>
          </SingleTableWrap>
        </LayoutTable>
      </LayoutTreeTable >
    );
  }
}

export default MenuPage



