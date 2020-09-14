// 选择组织机构组件
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  message,
  Icon,
  Tooltip,
} from 'antd';
import { LinkQueryForm, Scard, Modal } from 'view';

import SingleTable from '@/components/Alink/SingleTable'
import LinkTree from '@/components/Alink/Tree'
import LayoutTreeTable, { LayoutTree, LayoutTable } from '../Alink/LayoutTreeTable';
import SingleTableWrap from '../Alink/SingleTable/SingleTableWrap';

@connect(({ loading, global }) => ({
  baseHeight: global.contentHeight,
  loading,
}))
class OrgChoose extends Component {
  static defaultProps = {
    multiple: false,
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
    selectAll: '',
  };


  componentDidMount () {
    const { onInit } = this.props;
    onInit(this);
  }

  show = (type, data) => {
    let newdata = data instanceof Array ? data : []
    newdata = newdata.map(item => ({ ...item, key: item.key || item.id, id: item.id || item.key }))
    this.setState(
      {
        visible: true,
        type,
        selectedRows: newdata,
        selectedRowKeys: newdata.map(item => item.key || item.id),
      }, () => {
        setTimeout(() => {
          this.tb.refresh({});
        }, 100)
      },
    );
  }

  hide = () => {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
    });
    this.tb.clearData()
  }

  treeSelect = (selectedKeys, info) => {
    console.log(selectedKeys, info)
    if (selectedKeys[0] === 'root') {
      this.tb.refresh({ path: info.node.props.dataRef.path }, true)
    } else if (info.selected && info.node.props.dataRef) {
      this.tb.refresh({ path: info.node.props.dataRef.path }, true)
    } else {
      this.tb.refresh({}, true)
    }
  }

  handleOk = () => {
    const self = this;
    // 校验是否勾选
    const rows = this.state.selectedRows;
    if (rows && rows.length < 1) {
      message.error('请选择组织机构');
      return;
    }
    try {
      const confirm = self.props.confirm || function () { };
      confirm(
        rows,
        self.state.type,
      );
      this.hide()
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
    const { selectAll, tableData } = this.state;
    const height = baseHeight - 150
    return (
      <Modal
        title="选择组织机构"
        visible={this.state.visible}
        // forceRender
        bodyStyle={{ padding: 0 }}
        onOk={this.handleOk}
        onCancel={this.hide}
        okText="确定"
        cancelText="取消"
        isFull
        destroyOnClose
      >
        <LayoutTreeTable>
          <LayoutTree>
            <LinkTree
              select={this.treeSelect}
              link="/get/v1/org-tree"
              childrenProps="list"
              nameProps="orgName"
              keyProps="orgNo"
            />
          </LayoutTree>
          <LayoutTable>
            <SingleTableWrap>
              <LinkQueryForm
                formItems={[
                  {
                    key: 'orgName',
                    label: '组织名称',
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
                link="/get/v1/porgs"
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
                    dataIndex: 'orgNo',
                    title: '组织编号',
                    sorter: true,
                  },
                  {
                    dataIndex: 'orgName',
                    title: '组织名称',
                    sorter: true,
                  },
                  {
                    dataIndex: 'path',
                    title: '所属组织机构',
                    width: 300,
                  },
                  {
                    dataIndex: 'sortNo',
                    title: '排序',
                    sorter: true,
                  },

                ]}
              >

              </SingleTable>
            </SingleTableWrap>
          </LayoutTable>

          <LayoutTree right style={{ width: '340px' }}>
            <Scard title="已选择" style={{ padding: '0' }}>
              <div style={{

              }}>
                {
                  this.state.selectedRows.map((item, index) => (
                    <Tooltip title={item.orgName}>
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
                        {item.orgName}
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

export default OrgChoose;
