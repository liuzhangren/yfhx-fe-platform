/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Tag,
  message,
  Icon,
  Tooltip,
  Tabs
} from 'antd';
const { TabPane } = Tabs;
import moment from 'moment';
import {
  LinkQueryForm,
  Scard,
  Modal
} from 'view';

import SingleTable from "@/components/Alink/SingleTable"
import LinkTree from "@/components/Alink/Tree"
import LayoutTreeTable, { LayoutTree, LayoutTable } from '../Alink/LayoutTreeTable';
import SingleTableWrap from '../Alink/SingleTable/SingleTableWrap';
import style from './index.less';
import { EquipStatusColor, ABCStatusColor } from '@/utils/tableRenders'

@connect(({ puser, loading, global }) => {
  return {
    baseHeight: global.contentHeight,
    loading
  }
})
class PersonModal extends Component {
  static defaultProps = {
    multiple: false
  }
  state = {
    type: 'ADD',
    visible: false,
    data: {},
    porgNo: undefined,
    orgNo: '',
    selectedRowKeys: [],
    selectedRows: [],
    searchValue: {},
  };
  show (type, data) {
    let newdata = data instanceof Array ? data : []
    newdata = newdata.map(item => { return { ...item, key: item.key || item.id, id: item.id || item.key } })
    this.setState(
      {
        visible: true,
        type: type,
        selectedRows: newdata,
        selectedRowKeys: newdata.map(item => { return item.key || item.id })
      }, () => {
        const { param = {} } = this.props;
        setTimeout(() => {
          this.tb && this.tb.refresh({ equipLockState: 0, ...param });
        }, 100)
      }
    );
  }

  hide () {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: []
    });
    this.tb.clearData()
  }
  componentDidMount () {
    this.props.onInit && this.props.onInit(this);
  }


  treeSelect (type, selectedKeys, info) {
    if (type === '1') {
      if (info.node.props.dataRef.pTree === '二级') {
        this.tb.refresh({
          systemSortCode: info.node.props.dataRef.systemSortCode,
          systemTreeCode: '',
          categoryTreeCode: '',
          facilityStructureCode: '',
        }, '', true)
      } else {
        this.tb.refresh({
          systemSortCode: '',
          systemTreeCode: info.node.props.dataRef.systemCode,
          categoryTreeCode: '',
          facilityStructureCode: '',
        }, '', true)
      }
    } else if (type === '2') {
      if (selectedKeys[0] !== '405') {
        this.tb.refresh({
          systemSortCode: '',
          systemTreeCode: '',
          categoryTreeCode: selectedKeys[0],
          facilityStructureCode: '',
        }, '', true)
      } else {
        this.tb.refresh({
          systemSortCode: '',
          systemTreeCode: '',
          categoryTreeCode: '',
          facilityStructureCode: '',
        }, '', true)
      }
    } else if (type === '3') {
      if (selectedKeys[0] !== 'root') {
        this.tb.refresh({
          systemSortCode: '',
          systemTreeCode: '',
          categoryTreeCode: '',
          facilityStructureCode: selectedKeys[0],
        }, '', true)
      } else {
        this.tb.refresh({
          systemSortCode: '',
          systemTreeCode: '',
          categoryTreeCode: '',
          facilityStructureCode: '',
        }, '', true)
      }
    }
  }

  handleOk () {

    const self = this;
    //校验是否勾选
    const rows = this.state.selectedRows;
    // 
    if (rows && rows.length < 1) {
      message.error('请选择设备');
      return;
    }
    try {
      const confirm = self.props.confirm || function () { };
      confirm(
        rows,
        self.state.type
      );
      this.hide()
    } catch (e) { }
  }
  remove (index, type) {
    let selectedRows = this.state.selectedRows
    const record = selectedRows.splice(index, 1)
    this.setState(
      {
        selectedRows
      }
    )
    if (type) {
      this.tb.rowClick(record[0], "", "click")
    }
  }
  render () {
    const self = this;
    const { baseHeight, multiple } = this.props;
    return (
      <Modal
        title="选择设备"
        visible={this.state.visible}
        //forceRender
        bodyStyle={{ padding: 0 }}
        onOk={this.handleOk.bind(this)}
        onCancel={this.hide.bind(this)}
        okText="保存"
        cancelText="取消"
        isFull
        destroyOnClose
      >
        <LayoutTreeTable>
          <LayoutTree style={{ width: '250px' }}>
            <Tabs defaultActiveKey="1" onChange={this.callback} tabBarGutter={10} className={style.treeTabs}>
              <TabPane tab="系统" key="1">
                <Scard style={{
                  padding: 0,
                  height: baseHeight - 76,
                  flex: 'initial',
                }} >
                  <LinkTree
                    link="/equip/get/v1/es-system-tree"
                    keyProps="key"
                    nameProps="title"
                    showIcon
                    beforeSetData={data => {
                      const replaceKey = data => data.reduce((r, c) => {
                        if (c.pTree === '一级' || c.pTree === '二级') {
                          if (c.pTree === '二级') {
                            if (c.isEffective === '0') {
                              c.title = `${c.systemSortName}(无效)`
                            } else {
                              c.title = c.systemSortName
                            }
                            c.icon = 'unordered-list'
                          } else {
                            c.title = c.systemSortCode === 'root' ? c.systemSortName : c.systemSortCode
                          }
                          c.key = c.systemSortCode
                          c.children = c.list
                          if (c.list !== null && c.list.length > 0) {
                            replaceKey(c.list)
                          } else {
                            c.children = []
                          }
                        } else {
                          if (c.isEffective === '0') {
                            c.title = `${c.systemName}(无效)`
                          } else {
                            c.title = c.systemName
                          }
                          c.key = c.systemCode
                          c.icon = 'tool'
                          c.children = c.list
                          if (c.list !== null && c.list.length > 0) {
                            replaceKey(c.list)
                          } else {
                            c.children = []
                          }
                        }
                        return [
                          ...r,
                          c,
                        ]
                      }, [])
                      return replaceKey(data)
                    }
                    }
                    ref={proLineTree => { this.proLineTree = proLineTree }}
                    select={(selectedKeys, info) => { this.treeSelect('1', selectedKeys, info) }}
                  />
                </Scard>
              </TabPane>
              <TabPane tab="设备类别" key="2">
                <Scard style={{
                  padding: 0,
                  height: baseHeight - 76,
                  flex: 'initial',
                }} >
                  <LinkTree
                    link="/equip/get/v1/es-equipment-category-tree"
                    keyProps="key"
                    nameProps="title"
                    beforeSetData={data => {
                      const replaceKey = arr => arr.reduce((r, c) => {
                        const { categoryName, categoryCode, list, ...rest } = c;
                        c.children = list
                        if (c.isEffective === '0') {
                          c.title = `${categoryName}(无效)`
                        } else {
                          c.title = categoryName
                        }
                        c.key = categoryCode
                        if (categoryCode === '405') {
                          c.title = '设备类别'
                          c.key = categoryCode
                        } else {

                        }
                        if (c.list && c.list.length > 0) {
                          replaceKey(c.list)
                        } else {
                          c.children = []
                        }
                        return [
                          ...r,
                          c,
                        ]
                      }, [])
                      return replaceKey(data)
                    }}

                    ref={deviceTree => { this.deviceTree = deviceTree }}
                    select={(selectedKeys, info) => { this.treeSelect('2', selectedKeys, info) }}
                  />
                </Scard>
              </TabPane>
              <TabPane tab="厂房" key="3">
                <Scard style={{
                  padding: 0,
                  height: baseHeight - 76,
                  flex: 'initial',
                }} >
                  <LinkTree
                    link="/equip/get/v1/facility-tree"
                    childrenProps="list"
                    keyProps="key"
                    nameProps="title"
                    ref={roomTree => { this.roomTree = roomTree }}
                    select={(selectedKeys, info) => { this.treeSelect('3', selectedKeys, info) }}
                    beforeSetData={data => {
                      const replaceKey = arr => arr.reduce((r, c) => {
                        if (c.facilityStructureCode === 'root') {
                          c.title = '厂房'
                          c.key = c.facilityStructureCode
                          c.children = c.list
                          if (c.list !== null && c.list.length > 0) {
                            replaceKey(c.list)
                          } else {
                            c.children = []
                          }
                        } else {
                          if (c.isEffective === '0') {
                            c.title = `${c.facilityStructureName}(无效)`
                          } else {
                            c.title = c.facilityStructureName
                          }
                          c.key = c.facilityStructureCode
                          c.children = c.list
                          if (c.list !== null && c.list.length > 0) {
                            replaceKey(c.list)
                          } else {
                            c.children = []
                          }
                        }
                        return [
                          ...r,
                          c,
                        ]
                      }, [])
                      return replaceKey(data)
                    }}
                  />
                </Scard>
              </TabPane>
            </Tabs>

          </LayoutTree>
          <LayoutTable>
            <SingleTableWrap>
              <LinkQueryForm
                formItems={[
                  {
                    key: 'equipCode',
                    label: '设备编号',
                    componentType: 'input',
                    placeholder: '设备编号'
                  },
                  {
                    key: 'equipName',
                    label: '设备名称',
                    componentType: 'input',
                    placeholder: '设备名称'
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
              <SingleTable
                ref={(tb) => { this.tb = tb }}
                scroll={{ y: (baseHeight - 140) }}
                link="/equip/v1/es-equip-base-infos"
                pageSize={20}
                isAsync={multiple}
                rowSelectedMultiple={multiple}
                checkable={multiple}
                defaultRowCheckableKeys={this.state.selectedRowKeys}
                defaultRowSelectedKeys={this.state.selectedRowKeys}
                rowSelected={(record, key, status) => {
                  let arr = this.state.selectedRows

                  if (status === "cancel") {
                    for (let i = 0; i < arr.length; i++) {
                      if (arr[i].id === record.id) {
                        this.remove(i);
                        break;
                      }
                    }
                  } else {
                    if (multiple) {
                      arr.push(record)
                    } else {
                      arr = [record]
                    }
                  }

                  this.setState({
                    selectedRows: arr
                  })
                }}
                rowDoubleSelected={(record) => {
                  if (!multiple) {
                    this.setState({
                      selectedRows: [record]
                    }, () => {
                      this.handleOk()
                    })
                  }

                }}
                columns={[
                  {
                    dataIndex: 'equipCode',
                    title: '设备编号',
                    width: 180,
                    sorter: true,
                  },
                  {
                    dataIndex: 'equipName',
                    title: '设备名称',
                    width: 180,
                    sorter: true,
                  },
                  {
                    dataIndex: 'equipChargePersonName',
                    title: '设备负责人',
                    sorter: true,
                    width: 160,
                  },
                  {
                    dataIndex: 'specialEquip',
                    title: '特种设备',
                    sorter: true,
                    width: 120,
                    render: (text, record) => {
                      text -= 0;
                      if (text) {
                        return '是'
                      }
                      return '否'
                    },
                  },
                  {
                    dataIndex: 'cardCode',
                    title: '卡片编号',
                    width: 120,
                    sorter: true,
                  },
                  {
                    dataIndex: 'proLineName',
                    title: '生产线',
                    width: 120,
                    sorter: true,
                  },
                  {
                    dataIndex: 'systemName',
                    title: '所属系统',
                    sorter: true,
                  },
                  {
                    dataIndex: 'categoryName',
                    title: '设备类别名称',
                    width: 160,
                    sorter: true,
                  },
                  {
                    dataIndex: 'equipState',
                    title: '状态',
                    width: 100,
                    dict: 'EQUIP_USE_STATE',
                    dictLink: '/v1/dict-redis',
                    render: EquipStatusColor,
                  },

                  {
                    dataIndex: 'equipClass',
                    title: 'ABC分类',
                    sorter: true,
                    width: 120,
                    dict: 'ABC',
                    dictLink: '/equip/v1/bus-redis',
                    dictType: 'EQUIP',
                    render: ABCStatusColor,
                  },
                  {
                    dataIndex: 'equipTagNo',
                    title: '设备位号',
                    sorter: true,
                    width: 120,
                  },
                  {
                    dataIndex: 'facilityStructureName',
                    title: '安装厂房',
                    sorter: true,
                    width: 120,
                  },
                  {
                    dataIndex: 'roomName',
                    title: '安装房间',
                    sorter: true,
                    width: 120,
                  },
                ]}
              >

              </SingleTable>
            </SingleTableWrap>
          </LayoutTable>

          <LayoutTree right style={{ width: "340px" }}>
            <Scard title="已选择" style={{ padding: '0' }}>
              <div style={{

              }}>
                {
                  this.state.selectedRows.map((item, index) => (
                    <Tooltip title={`${item.equipName}(${item.equipCode})`}>
                      <div className="ant-tag"
                        style={{
                          margin: '6px 0 0 6px',
                          padding: '0 10px 0 5px',
                          textAlign: 'center',
                          width: '103px',
                          height: '30px',
                          lineHeight: '30px',
                          textOverflow: 'ellipsis',
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          float: 'left',
                          position: "relative",
                          cursor: "pointer"
                        }} onClick={this.remove.bind(this, index, 1)} >
                        {item.equipName}
                        <Icon type="close" style={{
                          position: "absolute", right: "0", height: "100%",
                          lineHeight: '30px', padding: "2px 4px 2px 2px"
                        }} />
                      </div>
                    </Tooltip>

                  )

                  )
                }
              </div>
            </Scard>
          </LayoutTree>
        </LayoutTreeTable>

      </Modal>)
  }
}

export default PersonModal;