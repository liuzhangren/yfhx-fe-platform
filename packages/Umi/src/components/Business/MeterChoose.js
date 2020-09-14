/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Tag,
  message, Icon, Tooltip, Popover
} from 'antd';
import moment from 'moment';
import { LinkQueryForm, Scard, Modal, Confirm } from 'view';

import SingleTable from "@/components/Alink/SingleTable"
import LinkTree from "@/components/Alink/Tree"

// import request from "@/utils/request"
import LayoutTreeTable, { LayoutTree, LayoutTable } from '../Alink/LayoutTreeTable';
import SingleTableWrap from '../Alink/SingleTable/SingleTableWrap';
import { InstStatusColor, ABCStatusColor } from '@/utils/tableRenders.js'

@connect(({ puser, loading, global, dict }) => {
  return {
    baseHeight: global.contentHeight,
    loading, dict
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
    tableLink: {},
    isNull: false
  };
  show(type, data) {
    const { dispatch } = this.props;
    let tableLink = {}
    if (data === '设备建账') {
      tableLink = {
        link: "/equip/v1/inst-by-link-equip-type",
      }
    }
    if (data === '设备信息维护') {
      tableLink = {
        link: "/equip/v1/meter-not-link-equip",
      }
    }
    this.setState(
      {
        visible: true,
        type: type,
        data,
        tableLink
      }, () => {
        setTimeout(() => {
          dispatch({
            type: 'dict/getPlatformRedis',
            payload: {
              pcodes: ['INSTRUMENT_TYPE']
            }
          })
          this.tb && this.tb.refresh();
        }, 100)
      }
    );
  }

  hide() {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: []
    });
    this.tb.clearData()
  }
  componentDidMount() {
    this.props.onInit && this.props.onInit(this);
  }


  treeSelect(selectedKeys, info) {
    const { dispatch } = this.props;
    if (selectedKeys[0] === 'root') {
      this.setState({
        porgNo: 'root',
        orgNo: 'root',
        selectedKeys: selectedKeys[0],
        selected: !this.state.selected,
        nodeData: info.node.props
      }, () => {
        this.tb.refresh({ orgNo: 'root' }, "", true);
      })
    } else if (info.selected && info.node.props.dataRef) {
      const { orgNo, type: roleId, resourceName: name, porgNo: porgNo } = info.node.props.dataRef
      this.setState({
        porgNo: selectedKeys[0],
        orgNo: orgNo,
        selected: true,
        selectedKeys: selectedKeys[0],
        nodeData: info.node.props.dataRef,

      }, () => {

        this.tb.refresh({ orgNo: selectedKeys[0] }, "", true);
      })
    } else {
      this.setState({
        selected: false,
        selectedKeys: '',
        porgNo: '',
        orgNo: ''
      }, () => {

        this.tb.refresh({ orgNo: "" }, "", true);
      })
    }
  }

  handleOk() {
    const self = this;
    //校验是否勾选
    const rows = this.state.selectedRows;


    const { isNull } = this.state
    if (isNull) {

      this.hide()
      return;
    }
    if (rows && rows.length < 1) {
      message.error('请选择仪表');
      return;
    }

    if (rows.some((item) => !!item.linkEquipId)) {
      Confirm({
        title: "当前选择的仪表中已存在关联的设备信息，是否确认替换",
        content: "",
        onOk: () => {
          try {
            const confirm = self.props.confirm || function () { };
            confirm(
              rows,
              self.state.type
            );
            this.hide()
          } catch (e) { }
        }
      })
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
  remove(index, type) {
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
  render() {
    const self = this;
    const { baseHeight, multiple } = this.props;
    const { tableLink } = this.state;
    return (
      <Modal
        title="选择仪表信息"
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
          {/* <LayoutTree>
            <LinkTree
              select={this.treeSelect.bind(this)}
              link="/get/v1/org-tree"
              childrenProps="list"
              nameProps="orgName"
              keyProps="orgNo"
            />
          </LayoutTree> */}
          <LayoutTable>
            <SingleTableWrap>
              <LinkQueryForm
                formItems={[
                  {
                    key: 'instrumentCode',
                    label: '仪表编号',
                    componentType: 'input',
                  },
                  {
                    key: 'instrumentName',
                    label: '仪表名称',
                    componentType: 'input',
                  },
                  {
                    key: 'instrumentType',
                    label: '仪表类型',
                    componentType: 'optionSelect',
                    props: {
                      options: this.props.dict['INSTRUMENT_TYPE'],
                      keys: "dictCode",
                      label: "dictName",
                    }
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
                // link="/equip/v1/meter-not-link-equip"
                {...tableLink}
                pageSize={20}
                afterGetData={(data, param, page) => {
                  if (page.current === 1 && !data.length) {
                    this.setState({ isNull: true })
                    message.warning('没有可供选择的数据');
                    // setTimeout(() => {
                    //   this.hide()
                    // }, 3000)
                  }
                }}
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
                    dataIndex: 'instrumentCode',
                    title: '仪表编号',
                    sorter: true,
                    width: 150
                  },
                  {
                    dataIndex: 'instrumentName',
                    title: '仪表名称',
                    sorter: true,
                    width: 140
                  },
                  {
                    dataIndex: 'specificationType',
                    title: '规格型号',
                    sorter: true,
                    width: 120
                  },
                  {
                    dataIndex: 'instrumentState',
                    title: '仪表状态',
                    sorter: true,
                    dictLink: "/v1/dict-redis",
                    dict: 'INSTRUMENT_STATE',
                    width: 100,
                    render: InstStatusColor
                  },
                  {
                    dataIndex: 'abcClass',
                    title: 'ABC分类',
                    sorter: true,
                    dictLink: "/equip/v1/bus-redis",
                    dictType: 'EQUIP',
                    dict: 'ABC',
                    width: 120,
                    render: ABCStatusColor
                  },
                  {
                    dataIndex: 'appliancesType',
                    title: '器具类型',
                    width: 100,
                    sorter: true,
                  },
                  {
                    dataIndex: 'instrumentType',
                    title: '仪表类型',
                    dictLink: "/v1/dict-redis",
                    dict: 'INSTRUMENT_TYPE',
                    sorter: true,
                    width: 120
                  },
                  {
                    dataIndex: 'measuringRange',
                    title: '测量范围',
                    sorter: true,
                    width: 120
                  },




                  {
                    dataIndex: 'measuringRange',
                    title: '测量范围',
                    sorter: true,
                    // width: 120
                  },
                  {
                    dataIndex: 'manuName',
                    title: '制造商',
                    sorter: true,
                    width: 120,
                  },
                  {
                    dataIndex: 'team',
                    title: '班组',
                    sorter: true,
                    width: 120
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
                  this.state.selectedRows.map((item, index) => {
                    if (item.linkEquipId) {
                      return (<Popover title="提示" content={`该仪表已被关联到设备【${item.equipName}】上`} trigger="hover">
                        <Tooltip title={`${item.instrumentName}(${item.instrumentCode})`} trigger="click" >
                          <div className={`ant-tag ${item.linkEquipId ? 'ant-tag-red' : ''}`}
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
                            {item.instrumentName}
                            <Icon type="close" style={{
                              position: "absolute", right: "0", height: "100%",
                              lineHeight: '30px', padding: "2px 4px 2px 2px"
                            }} />
                          </div>
                        </Tooltip>
                      </Popover>)

                    } else {
                      return (<Tooltip title={`${item.instrumentName}(${item.instrumentCode})`}>
                        <div className={`ant-tag ${item.linkEquipId ? 'ant-tag-red' : ''}`}
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
                          {item.instrumentName}
                          <Icon type="close" style={{
                            position: "absolute", right: "0", height: "100%",
                            lineHeight: '30px', padding: "2px 4px 2px 2px"
                          }} />
                        </div>
                      </Tooltip>)

                    }
                  }

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