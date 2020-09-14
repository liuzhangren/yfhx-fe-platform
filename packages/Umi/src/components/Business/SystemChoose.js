/*eslint-disable*/
//选择系统
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Tag,
  message,
  Icon,
  Tooltip,
  Button
} from 'antd';
import moment from 'moment';
import { LinkQueryForm, Scard, Modal, } from 'view';

import SingleTable from "@/components/Alink/SingleTable"
import LinkTree from "@/components/Alink/Tree"

// import request from "@/utils/request"
import LayoutTreeTable, { LayoutTree, LayoutTable } from '@/components/Alink/LayoutTreeTable';
import SingleTableWrap from '@/components/Alink/SingleTable/SingleTableWrap';

@connect(({ puser, loading, global }) => {
  return {
    baseHeight: global.contentHeight,
    loading
  }
})
class SystemChoose extends Component {
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
    selectAll: ""
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
        setTimeout(() => {
          this.tb && this.tb.refresh({ isEffective: '1' });
        }, 100)
      }
    );
  }

  hide () {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
    this.tb.clearData()
  }
  componentDidMount () {
    this.props.onInit && this.props.onInit(this);
  }


  treeSelect (selectedKeys, info) {
    if (selectedKeys.length > 0) {
      if (selectedKeys[0] === 'root') {
        this.tb.refresh({ pcode: '', systemSortCode: '' }, '', true)
      } else {
        if (info.node.props.dataRef.pTree == '二级') {
          this.tb.refresh({ systemSortCode: info.node.props.dataRef.systemSortCode, pcode: '' }, '', true)
        } else {
          this.tb.refresh({ pcode: info.node.props.dataRef.systemCode }, '', true)
        }
      }

    }
  }

  handleOk () {
    const self = this;
    //校验是否勾选
    const rows = this.state.selectedRows;
    // 
    if (rows && rows.length < 1) {
      message.error('请选择系统');
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
  viewSelect = () => {
    const { selectAll, tableData } = this.state;
    let arr = this.state.selectedRows;
    tableData.map(item => {
      let has = arr.some(itm => itm.key === item.key)
      // 全部取消
      if (selectAll) {
        if (has) {
          this.tb.rowClick(item, !selectAll)
        }
      } else {
        // 全部选中
        // 已选中，不处理,未选中的选中
        if (!has) {
          this.tb.rowClick(item, !selectAll)
        }

      }
    })
    console.log(tableData)
    if (tableData.length) {

      this.setState({ selectAll: !selectAll })
    }
  }

  replaceTreeKey = data => data.reduce((r, c) => {
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
        this.replaceTreeKey(c.list)
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
        this.replaceTreeKey(c.list)
      } else {
        c.children = []
      }
    }
    return [
      ...r,
      c,
    ]
  }, [])

  render () {
    const self = this;
    const { baseHeight, multiple } = this.props;
    const { selectAll, tableData } = this.state;
    const height = baseHeight - 150
    return (
      <Modal
        title="选择系统"
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
          <LayoutTree style={{ width: '300px' }}>
            <LinkTree
              select={this.treeSelect.bind(this)}
              link="/equip/get/v1/es-system-tree"
              showLine
              beforeSetData={this.replaceTreeKey}
              childrenProps="children"
              keyProps="key"
              nameProps="title"
              showIcon
            />
          </LayoutTree>
          <LayoutTable>
            <SingleTableWrap>
              <LinkQueryForm
                formItems={[
                  {
                    key: 'systemCode',
                    label: '系统编号',
                    componentType: 'input',
                    placeholder: '系统编号'
                  },
                  {
                    key: 'systemName',
                    label: '系统名称',
                    componentType: 'input',
                    placeholder: '系统名称'
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
                scroll={{ y: height }}
                link="/equip/v1/es-systems"
                pageSize={20}
                isAsync={multiple}
                rowSelectedMultiple={multiple}
                checkable={multiple}
                defaultRowCheckableKeys={this.state.selectedRowKeys}
                defaultRowSelectedKeys={this.state.selectedRowKeys}
                afterGetData={(data) => {
                  // 翻页时全选状态更新
                  const tableData = data;
                  let arr = this.state.selectedRows;
                  let isAll = true;
                  if (tableData.length) {
                    for (let i = 0; i < tableData.length; i++) {
                      const item = tableData[i];
                      if (!arr.some(itm => itm.key === item.key)) {
                        isAll = false;
                        break;
                      }
                    }
                  } else {
                    isAll = false;
                  }
                  this.setState({ tableData: data, selectAll: isAll })

                }}
                // headerButton={
                //   multiple ? [<Button className="noMain" onClick={this.viewSelect}>{selectAll ? "取消全部" : "选择全部"}</Button>] : []
                // }
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
                  let isAll = true;
                  // if (selectAll && status === "cancel") {
                  //   isAll = false
                  // }
                  for (let i = 0; i < tableData.length; i++) {
                    const item = tableData[i];
                    if (!arr.some(itm => itm.key === item.key)) {
                      isAll = false;
                      break;
                    }
                  }

                  this.setState({
                    selectedRows: arr,
                    selectAll: isAll
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
                    dataIndex: 'systemCode',
                    title: '系统编号',
                    sorter: true,
                    width: 140
                  },
                  {
                    dataIndex: 'systemName',
                    title: '系统名称',
                    sorter: true,
                    width: 140
                  },
                  {
                    dataIndex: 'proLineCode',
                    title: '生产线编号',
                    sorter: true,
                    width: 140,
                  },
                  {
                    dataIndex: 'proLineName',
                    title: '生产线名称',
                    sorter: true,
                    width: 160,
                  },
                  {
                    dataIndex: 'remark',
                    title: '备注',
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
                    <Tooltip title={item.systemName}>
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
                        {item.systemName}
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

export default SystemChoose;