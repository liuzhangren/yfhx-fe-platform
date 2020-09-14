import React from 'react';
import {
  LinkQueryForm,
} from 'view';
import {
  message,
  Divider,
} from 'antd';
import { connect } from 'dva';
import EquipeBusModal from '@/components/EquipeBus/EquipeBusModalDev';
import Table from '@/components/Alink/SingleTable'
import LinkTree from '@/components/Alink/Tree'
import SingleTableWrap from '@/components/Alink/SingleTable/SingleTableWrap'
import { RowDelete, RowsDelete, AddRow, TableModal, EditRow } from '@/components/Alink/Table/Table'
import LayoutTreeTable, { LayoutTree, LayoutTable } from '@/components/Alink/LayoutTreeTable'

@connect(({ device, loading, global }) => ({
  device,
  loading,
  baseHeight: global.contentHeight,
}))

class EquipeBus extends React.Component {
  state = {
    nodeData: { dictName: '' },
    selectedKeys: [],
    selected: false,
    dictName: '',
    type: 'ADD',
  }


  onChange(selectedRowKeys, selectedRows) {
    // console.log(selectedRowKeys, selectedRows)
    if (selectedRowKeys.length > 0) {
      this.setState({
        disabled: false,
        selectedRowKeys,
        selectedRow: selectedRows[0],
      })
    } else {
      this.setState({
        disabled: true,
        selectedRowKeys: [],
      })
    }
  }

  async treeSelect(selectedKeys, info) {
    if (selectedKeys[0] === 'EQUIP' || selectedKeys[0] === 'RUN' || selectedKeys[0] === 'PLAN') {
      if (selectedKeys.length > 0) {
        const { dictName } = info.node.props.dataRef
        this.setState({
          selected: true,
          selectedKeys,
          dictName,
        }, () => {
          this.tb.refresh({ pcode: selectedKeys[0], limit: 9999, page: 1 }, '', true)
        })
      } else {
        this.setState({
          selected: false,
          selectedKeys,
        }, () => {
          this.tb.refresh({ pcode: selectedKeys[0] }, '', true)
        })
      }
    } else {
      this.setState({
        selected: false,
        selectedKeys: [],
      })
      message.warn('请选择一级节点!')
    }
  }

  render() {
    const { selected, selectedKeys, nodeData } = this.state
    const { dispatch } = this.props;
    return (
      <LayoutTreeTable>
        <LayoutTree>
          <LinkTree
            ref={ref => this.LinkTree = ref}
            select={this.treeSelect.bind(this)}
            check={(checkedKeys, allKeys) => { console.log(checkedKeys, allKeys, '001') }}
            showLine
            link="/equip/get/v1/bus-user-tree?busType=EQUIP&userType=admin"
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
                    options: [{ value: '1', label: '是' }, { value: '0', label: '否' }],
                  },
                },
              ]}
              verifySuccess={value => {
                this.tb.refresh({ ...value, pcode: selectedKeys[0] }, '', true)
              }}
            />
            <Table
              ref={tb => { this.tb = tb }}
              link="/equip/v1/bus-dicts"
              rowAddLink="/equip/v1/bus-dict"
              rowDelLink="/equip/v1/bus-dict"
              rowEditLink="/equip/v1/bus-dict"
              rowsDelLink="/equip/v1/bus-dicts"
              sortLink="/equip/v1/bus-dicts"
              fontSort
              showPagination={false}
              onChange={this.onChange.bind(this)}
              headerButton={[
                <AddRow
                  modal={this.menuModal}
                  beforeShow={() => {
                    const { selected, dictName } = this.state
                    if (!selected) {
                      message.warn('请选择设备业务字典树节点!')
                      return false
                    }
                  }}>新增</AddRow>,
              ]}
              batchButton={[
                <RowsDelete
                  table={this.tb}
                  onCallback={() => {
                    this.LinkTree.refresh()
                    this.tb.refresh({
                      pcode: this.state.selectedKeys[0],
                      busType: this.state.selectedKeys[0],
                      userType: 'admin',
                    }, '', true)
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
                  width: 240,
                },
                {
                  dataIndex: 'pcode',
                  title: '父级字典编号',
                  width: 180,
                },
                {
                  dataIndex: 'busType',
                  title: '业务类型',
                  width: 100,
                },
                // {
                //   dataIndex: 'sort',
                //   title: '排序',
                //   width: 70,
                //   sorter: true,
                // },
                {
                  dataIndex: 'isEffective',
                  title: '是否有效',
                  width: 100,
                  render: text => (text === '1' ? '是' : '否'),
                },
                {
                  dataIndex: 'remark',
                  title: '备注',
                },
                {
                  dataIndex: 'operation',
                  title: '操作',
                  fixed: 'right',
                  width: 100,
                  render: (text, record, index) => (
                    <div>
                      <EditRow record={record} modal={this.menuModal}>编辑</EditRow>
                      <Divider type="vertical" />
                      <RowDelete
                        table={this.tb}
                        record={record}
                        onCallback={() => {
                          this.LinkTree.refresh()
                          this.tb.refresh({ pcode: this.state.selectedKeys[0], busType: this.state.selectedKeys[0], userType: 'admin' }, '', true)
                        }}
                      >删除</RowDelete>
                    </div>
                  ),
                },
              ]}
            />
            <TableModal
              ref={menuModal => { this.menuModal = menuModal; }}
              width={700}
              title="设备业务字典信息"
              table={this.tb}
              okText="保存"
              bodyStyle={{ padding: 24 }}
              onOk={(type, record) => {
                let data = '';
                this.form.validateFields((err, values) => {
                  if (!err) {
                    const params = { busType: this.state.selectedKeys[0], userType: 'admin' }
                    if (type === 'UPDATE') {
                      data = { ...params, ...record, ...values, pcode: record.pcode, dictCode: values.dictCode.replace(/(^\s*)|(\s*$)/g, '') }
                    } else {
                      data = { ...params, ...values, pcode: this.state.selectedKeys[0], dictCode: values.dictCode.replace(/(^\s*)|(\s*$)/g, '') }
                    }
                  }
                });
                return data;
              }}
              onShow={(record, type) => {
                setTimeout(() => {
                  this.form.setFieldsValue({
                    ...record,
                    pcode: this.state.dictName || '',
                  });
                }, 300);
                this.setState({ type })
              }}

              onCallBack={() => {
                this.LinkTree.refresh()
              }}

            >
              <EquipeBusModal
                onFormLoad={form => {
                  this.form = form
                }}
                type={this.state.type}
              />
            </TableModal>
          </SingleTableWrap>
        </LayoutTable>
      </LayoutTreeTable>
    )
  }
}

export default EquipeBus
