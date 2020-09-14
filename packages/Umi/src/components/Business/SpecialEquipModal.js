/*eslint-disable*/
import React from 'react';
import { connect } from 'dva';
import { LinkQueryForm, Scard, Modal, } from 'view';
import SingleTable from "@/components/Alink/SingleTable";
import SingleTableWrap from '@/components/Alink/SingleTable/SingleTableWrap';
import { ABCStatusColor } from '@/utils/tableRenders';
@connect(({ loading, dict, global }) => {
  return {
    baseHeight: global.contentHeight,
    loading,
    dict,
  }
})

class SpecialEquip extends React.Component {
  state = {
    visible: false,
    rowCheckableKeys: [],
    selectedRows: [],
  }
  
  componentDidMount() {
    this.props.onInit && this.props.onInit(this);
    this.props.dispatch({
      type: 'dict/getEquipRedis',
      payload: { pcodes: ['ABC'] },
    })
  }

  handleOk = async () => {
    const { confirm } = this.props;
    await confirm(this.state.selectedRows)
    await this.hide()
  }

  change = (rowCheckableKeys, selectedRows) => {
    // console.log('hello', rowCheckableKeys)
    // console.log('world', selectedRows)
    this.setState({
      rowCheckableKeys,
      selectedRows,
    })
  }

  hide = () => {
    this.setState({
      visible: false,
    })
  }

  show = async () => {
    await this.setState({
      visible: true,
    })
    await this.tb.refresh()
  }

  render() {
    const { multiple, baseHeight } = this.props;
    const height = baseHeight - 150;
    return (
      <Modal
        title="选择特种设备"
        visible={this.state.visible}
        bodyStyle={{ padding: 0 }}
        onOk={this.handleOk}
        onCancel={this.hide}
        okText="保存"
        cancelText="取消"
        isFull
        destroyOnClose
      >
        <SingleTableWrap>
          <LinkQueryForm
            formItems={[
              {
                key: 'planCode',
                label: '计划编号',
                componentType: 'input'
              },
              {
                key: 'equipName',
                label: '设备名称',
                componentType: 'input'
              },
              {
                key: 'equipCode',
                label: '设备编号',
                componentType: 'input'
              },
            ]}
            verifySuccess={value => {
              this.setState({
                searchValue: {
                  ...value,
                }
              }, () => {
                this.tb.refresh({ ...value }, "", true)
              })
            }}
          />
          <SingleTable
            ref={(tb) => { this.tb = tb }}
            scroll={{ y: height }}
            link="/plan/v1/rp-periodic-inspection-plan/queryEquipList"
            isAsync={multiple}
            rowSelectedMultiple={multiple}
            checkable={true}
            checkAll={true}
            onChange={this.change}
            showPagination={false}
            columns={[
              {
                dataIndex: 'planCode',
                title: '定期检验计划编号',
                sorter: true,
                width: 150,
              },
              {
                dataIndex: 'equipCode',
                title: '设备编号',
                sorter: true,
                // width: 150,
              },
              {
                dataIndex: 'equipName',
                title: '设备名称',
                sorter: true,
                width: 110,
              },
              {
                dataIndex: 'model',
                title: '型号',
                sorter: true,
                width: 80,
              },
              {
                dataIndex: 'specifications',
                title: '规格',
                sorter: true,
                width: 80,
              },
              {
                dataIndex: 'equipClass',
                title: 'ABC分类',
                sorter: true,
                width: 110,
                render: (text, record, index) => {
                  const str = this.props.dict.ABC.reduce((r, c) => {
                    if(c.dictCode === text) {
                      r = c.dictName
                    }
                    return r
                  }, '')
                  return ABCStatusColor(str)
                }
              },
              {
                dataIndex: 'equipTagNo',
                title: '设备位号',
                sorter: true,
                width: 80,
              },
              {
                dataIndex: 'facilityStructureName',
                title: '安装厂房',
                sorter: true,
                width: 80,
              },
              {
                dataIndex: 'roomName',
                title: '安装房间',
                sorter: true,
                width: 80,
              },
              {
                dataIndex: 'useDepartName',
                title: '使用部门',
                sorter: true,
                width: 100,
              },
              {
                dataIndex: 'equipChargePersonName',
                title: '设备负责人',
                sorter: true,
                width: 80,
              },
              {
                dataIndex: 'maintainFrequencyNumber',
                title: '检验周期',
                sorter: true,
                width: 70,
              },
              {
                dataIndex: 'lastTestDate',
                title: '上次检验日期',
                sorter: true,
                // width: 120,
              },
              {
                dataIndex: 'nextTestDate',
                title: '下次检验完成日期',
                sorter: true,
                // width: 100,
              },
            ]}
          />
        </SingleTableWrap>
      </Modal>
    )
  }
}

export default SpecialEquip;