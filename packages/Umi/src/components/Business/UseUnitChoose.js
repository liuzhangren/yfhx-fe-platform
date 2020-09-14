// 选择资产类别组件
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  message,
  Icon,
  Tooltip,
} from 'antd';
import { LinkQueryForm, Scard, Modal } from 'view';

import SingleTable from '@/components/Alink/SingleTable'
import LayoutTreeTable, { LayoutTree, LayoutTable } from '@/components/Alink/LayoutTreeTable';
import SingleTableWrap from '@/components/Alink/SingleTable/SingleTableWrap';

@connect(({ loading, global, user }) => ({
  baseHeight: global.contentHeight,
  loading,
  currentUser: user.currentUser,
}))
class UseUnitChoose extends Component {
  static defaultProps = {
    multiple: false,
  }

  state = {
    visible: false,
    data: {},
    selectedRowKeys: [],
    selectedRows: [],
    searchValue: {},
    selectAll: '',
    Link: {},
  };


  componentDidMount () {
    const { onInit } = this.props
    onInit(this);
  }

  show (type, data) {
    const { currentUser, mode } = this.props;
    let newdata = data instanceof Array ? data : []
    newdata = newdata.map(item => ({ ...item, key: item.key || item.id, id: item.id || item.key }))
    let Link = {}
    if (mode === 'ALL') {
      Link = {
        link: '/equip/v1/es-use-units',
      }
    } else {
      Link = {
        link: '/equip/v1/useunit/queryByAccount',
      }
    }
    this.setState(
      {
        visible: true,
        Link,
        selectedRows: newdata,
        selectedRowKeys: newdata.map(item => item.key || item.id),
      }, () => {
        setTimeout(() => {
          if (this.tb) {
            if (mode === 'ALL') {
              this.tb.refresh({ isEffective: '1' })
            } else {
              this.tb.refresh({ isEffective: '1', account: currentUser.account })
            }
          }
        }, 100)
      },
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

  handleOk () {
    const self = this;
    // 校验是否勾选
    const rows = this.state.selectedRows;
    if (rows && rows.length < 1) {
      message.error('请选择使用单位');
      return;
    }
    try {
      const confirm = self.props.confirm || function () { };
      confirm(
        rows,
        self.state.type,
      );
      console.log(1)
      this.hide()
      console.log(2)
    } catch (e) { }
  }

  remove (index, type) {
    const { selectedRows } = this.state
    const record = selectedRows.splice(index, 1)
    this.setState(
      {
        selectedRows,
      },
    )
    if (type) {
      this.tb.rowClick(record[0], '', 'click')
    }
  }

  render () {
    const self = this;
    const { baseHeight, multiple } = this.props;
    const { tableData, Link } = this.state;
    const height = baseHeight - 150
    return (
      <Modal
        title="选择使用单位"
        visible={this.state.visible}
        // forceRender
        bodyStyle={{ padding: 0 }}
        onOk={this.handleOk.bind(this)}
        onCancel={this.hide.bind(this)}
        okText="确定"
        cancelText="取消"
        isFull
        destroyOnClose
      >
        <LayoutTreeTable>
          <LayoutTable>
            <SingleTableWrap>
              <LinkQueryForm
                formItems={[
                  {
                    key: 'departCode',
                    label: '使用单位编号',
                    componentType: 'input',
                  },
                  {
                    key: 'useUnitCode',
                    label: '部门编号',
                    componentType: 'input',
                  },
                  {
                    key: 'departName',
                    label: '部门名称',
                    componentType: 'input',
                  },
                  {
                    key: 'departHead',
                    label: '部门责任人',
                    componentType: 'input',
                  },
                ]}
                verifySuccess={value => {
                  self.setState({
                    searchValue: {
                      ...value,
                    },
                  }, () => {
                    this.tb.refresh({ ...value }, '', true)
                  })
                }}
              />
              <SingleTable
                ref={tb => { this.tb = tb }}
                scroll={{ y: height }}
                {...Link}
                pageSize={20}
                isAsync={multiple}
                rowSelectedMultiple={multiple}
                checkable={multiple}
                defaultRowCheckableKeys={this.state.selectedRowKeys}
                defaultRowSelectedKeys={this.state.selectedRowKeys}
                afterGetData={data => {
                  // 翻页时全选状态更新
                  const tableData = data;
                  const arr = this.state.selectedRows;
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

                rowSelected={(record, key, status) => {
                  let arr = this.state.selectedRows
                  if (status === 'cancel') {
                    for (let i = 0; i < arr.length; i++) {
                      if (arr[i].id === record.id) {
                        this.remove(i);
                        break;
                      }
                    }
                  } else if (multiple) {
                    arr.push(record)
                  } else {
                    arr = [record]
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
                    selectAll: isAll,
                  })
                }}
                rowDoubleSelected={record => {
                  if (!multiple) {
                    this.setState({
                      selectedRows: [record],
                    }, () => {
                      this.handleOk()
                    })
                  }
                }}
                columns={[
                  {
                    dataIndex: 'departCode',
                    title: '使用单位编号',
                    sorter: true,
                    width: 160,
                  },
                  {
                    dataIndex: 'useUnitCode',
                    title: '部门编号',
                    sorter: true,
                    width: 160,
                  },

                  {
                    dataIndex: 'departName',
                    title: '部门名称',
                    sorter: true,
                  },
                  {
                    dataIndex: 'departHead',
                    title: '部门责任人',
                    sorter: true,
                    width: 160,
                  },
                  {
                    dataIndex: 'contactPhone',
                    title: '联系电话',
                    sorter: true,
                    width: 160,
                  },
                ]}
              >
              </SingleTable>
            </SingleTableWrap>
          </LayoutTable>

          <LayoutTree right style={{ width: '340px' }}>
            <Scard title="已选择" style={{ padding: '0' }}>
              <div>
                {
                  this.state.selectedRows.map((item, index) => (
                    <Tooltip title={item.departName}>
                      <div className="ant-tag"
                        style={{
                          margin: '6px 0 0 6px',
                          padding: '0 10px 0 5px',
                          textAlign: 'center',
                          width: '103px',
                          height: '30px',
                          lineHeight: '30px',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          float: 'left',
                          position: 'relative',
                          cursor: 'pointer',
                        }} onClick={this.remove.bind(this, index, 1)} >
                        {item.departName}
                        <Icon type="close" style={{
                          position: 'absolute',
                          right: '0',
                          height: '100%',
                          lineHeight: '30px',
                          padding: '2px 4px 2px 2px',
                        }} />
                      </div>
                    </Tooltip>
                  ),
                  )
                }
              </div>
            </Scard>
          </LayoutTree>
        </LayoutTreeTable>

      </Modal>)
  }
}

export default UseUnitChoose;
