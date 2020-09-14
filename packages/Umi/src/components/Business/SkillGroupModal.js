/*eslint-disable*/
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
import { RowDelete, RowsDelete, TableModal } from '@/components/Alink/Table/Table'
import SingleTable from "@/components/Alink/SingleTable"
import LinkTree from "@/components/Alink/Tree"

// import request from "@/utils/request"
import LayoutTreeTable, { LayoutTree, LayoutTable } from '../Alink/LayoutTreeTable';
import SingleTableWrap from '../Alink/SingleTable/SingleTableWrap';

@connect(({ loading, global }) => {
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
    selectAll: ""
  };
  show (type, data) {
    debugger
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
          this.tb && this.tb.refresh({ equipCategory: data.equipCategory });
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
    const { dispatch } = this.props;
    const { orgNo, type: roleId, resourceName: name, porgNo: porgNo, path } = info.node.props.dataRef
    if (selectedKeys[0] === 'root') {
      this.setState({
        porgNo: 'root',
        orgNo: 'root',
        selectedKeys: selectedKeys[0],
        selected: !this.state.selected,
        nodeData: info.node.props
      }, () => {
        this.tb.refresh({
          // orgNo: ''
          path
        }, "", true);
      })
    } else if (info.selected && info.node.props.dataRef) {
      this.setState({
        porgNo: selectedKeys[0],
        // orgNo: orgNo,
        selected: true,
        selectedKeys: selectedKeys[0],
        nodeData: info.node.props.dataRef,
      }, () => {

        this.tb.refresh({
          // orgNo: selectedKeys[0]
          systemUser: 1,
          path
        }, "", true);
      })
    } else {
      this.setState({
        selected: false,
        selectedKeys: '',
        porgNo: '',
        orgNo: '',
      }, () => {

        this.tb.refresh({
          // orgNo: ""
          systemUser: 1,
          path
        }, "", true);
      })
    }
  }

  handleOk () {
    const self = this;
    //校验是否勾选
    const rows = this.state.selectedRows;
    // 
    if (rows && rows.length < 1) {
      message.error('请选择人员');
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

  render () {
    const self = this;
    const { baseHeight, multiple } = this.props;
    const { selectAll, tableData } = this.state;
    const height = baseHeight - 150
    return (
      <Modal
        title="选择用户"
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
          <LayoutTable>
            <SingleTableWrap>
              <LinkQueryForm
                formItems={[
                  {
                    key: 'teamMemberId',
                    label: '组员账号',
                    componentType: 'input'
                  },
                  {
                    key: 'teamMemberName',
                    label: '组员姓名',
                    componentType: 'input'
                  }
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
                link="/equip/v1/query-team-members"
                pageSize={20}
                isAsync={multiple}
                rowSelectedMultiple={multiple}
                checkable={multiple}
                defaultRowCheckableKeys={this.state.selectedRowKeys}
                defaultRowSelectedKeys={this.state.selectedRowKeys}
                beforeSetData={data => {
                  return data
                }}
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
                    dataIndex: 'teamMemberId',
                    title: '组员账号',
                  },
                  {
                    dataIndex: 'teamMemberName',
                    title: '组员姓名',
                  },
                  {
                    dataIndex: 'sex',
                    title: '性别',
                    render: type => (type === 0 ? '女' : '男'),
                  },
                  {
                    dataIndex: 'phone',
                    title: '手机号',
                    width: 130,
                  },
                  {
                    dataIndex: 'orgName',
                    title: '所属组织机构',
                    width: 300,
                  },
                  {
                    dataIndex: 'operation',
                    title: '操作',
                    fixed: 'right',
                    width: 50,
                    render: (text, record) => (
                      <RowDelete table={this.tb} record={record} />
                    ),
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
                    <Tooltip title={item.teamMemberName}>
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
                        {item.teamMemberName}
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