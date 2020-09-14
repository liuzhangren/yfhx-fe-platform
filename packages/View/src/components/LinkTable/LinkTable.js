// /* eslint-disable */
import React, { Component } from 'react';
import { Table, Alert, Icon, Row, Col, Modal, Typography, ConfigProvider, message, Form, Input, Popconfirm, Divider, Pagination, Button } from 'antd';
import TableAlertInfo from './TableAlertInfo';
import axios from 'axios';
// import { restfulApi, dowloadExcel } from '@/services/restful';
import getComponentByType from '../Form/components/FormComponentUitl';
import EditableTable, { EditableContext } from './EditableTable'

import XLSX from 'xlsx';
import saveAs from 'file-saver';
import style from './LinkTable.less'

const Paragraph = Typography.Paragraph

const { confirm } = Modal;

/**
 * 获取后台表格的数据,自动连接生成表组件代码
 *
 * @author zhangj
 * @date 2019-05-07 14:47:00
 *
 *
 * @param link     请求后台的地址
 * @param pageSize 请求后台的页面大小
 * @method refresh(parames)   刷新表格,如果参数表示表格附带的请求参数,如果为空则使用之前的参数进行查询
 * 
 * 
 * @method create 创建新数据
 * @event onRowSave mode 为 rowEdit 时的行保存事件
 * @event onRowDelete mode 为 rowEdit 时的行删除事件
 * 
 * @event onRowClick 点击行触发的事件
 * @description 其他高级参数参照  http://ant.design/components/table-cn/
 *
 */
import { Resizable } from 'react-resizable';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};


export default class LinkTable extends Component {

  static defaultProps = {
    headerButton: [], //头部新增等按钮
    batchButton: [],  //按条件显示的按钮
    // readonly ---> 只读 || rowEdit ---> 行编辑 || cellEdit ---> 列编辑
    mode: 'readonly'
  };

  state = {
    data: [],
    pagination: {},
    loading: false,
    param: {},
    selectedRowKeys: [], // 批量勾选的模式下,选中的
    selectedRows: [],
    onClickSelectId: "",//选着的样式
    editingKey: '', // 行编辑模式下正在编辑的行
    modifiedRecords: {}, // 单元格编辑模式下编辑过的行(记录)及数据
    changedData: [], //cellEdit 模式下更改后的所有记录,
    loading: false,
    tableColumns: []
  };

  constructor(props) {
    super(props);
    this.initital = false // 是否初始化过一次   true 表示已经初始化过了， false 表示还未初始化
    this.refresh = this.refresh
  }


  componentDidMount() {
    const { pageSize = 10 } = this.props;
    this.setState({
      pagination: {
        pageSize: parseInt(pageSize, 0),
        current: 1,
      },
    }, () => {
      this.getColumns()
    });
  }
  toParame = (data) => {
    let param = '?';
    Object.keys(data).forEach(key => {
      if (data[key] != null && data[key] !== '' && data[key] !== undefined) {
        param += `${key}=${data[key]}&`;
      }
    })
    return param;
  }

  // 检测总导出的数据量
  checkTotalExport = () => {
    let { total } = this.state;
    if (total > 500000) {
      Modal.confirm({
        content: '导出的数据大于50万 条，估计耗时30S以上，请确认是否继续操作',
        onOk() {
          this.onExportBackEnd()
        },
        onCancel() {
          // console.log('Cancel');
        },
      })
    } else {
      this.onExportBackEnd()
    }
  }

  // 调用后台接口导出当前表
  onExportBackEnd = () => {
    const { dowloadExcel } = this.props;
    dowloadExcel().then(resp => {
      saveAs(resp, 'demo.xlsx')
    })
  }

  // 导出当前表为Excel
  onExportSinglePage = () => {
    let { selectedRows } = this.state;
    var filename = "file.xlsx"; //文件名称
    var ws_name = "Sheet1"; //Excel第一个sheet的名称
    var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet([...selectedRows]);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);  //将数据添加到工作薄
    XLSX.writeFile(wb, filename);
  }

  /**
   *
   * @param pageSize 显示页面大小
   * @param pageNo 显示的页码
   * @param param 调用接口参数
   */
  async requestData({ pageSize, pageNo, param }) {
    // console.log('hello world!!!', this.props)
    // const self = this;
    const { defaultParams, link } = this.props;
    this.setState({ loading: true })
    const params = {
      limit: pageSize,
      page: pageNo,
      ...param,
      ...defaultParams
    };
    console.log('这是请求地址:' , link)
    const res = await axios.get(link)
    console.log('hehehehe', res)
    // return new Promise((resolve, reject) => {
    //   const params = {
    //     limit: pageSize,
    //     page: pageNo,
    //     ...param,
    //     ...defaultParams
    //   };
    //   restfulApi(self.props.link + self.toParame(params), 'GET', {}).then(response => {
    //     self.setState({ loading: false })
    //     if (response && response.code === 0) {
    //       resolve(response.data);
    //     } else {
    //       reject(response)
    //     }
    //   });
    // });
  }

  /**
   * isBatch 为true, 则为批处理模式,使用默认配置
   *         为false, 时则使用外部传入的props 
   */
  getRowSelection({ isBatch, self, selectedRowKeys }) {
    const { onSelectChange } = this.props;
    if (isBatch) {
      return {
        type: 'checkbox',
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          self.setState({
            selectedRowKeys,
            selectedRows,
          });
          onSelectChange && onSelectChange(selectedRowKeys, selectedRows)
        },
      }
    }
    const { rowSelection } = this.props;
    return rowSelection
  }


  // 页面最大展示条数改变时的回调
  handleSizeChange(current, pageSize) {
    this.refresh({}, { current: 1, pageSize });
  }
  /**
   * 刷新表格信息
   * @param  param 刷新表格的参数
   */
  refresh(param, pagination) {
    const pager = { ...this.state.pagination };
    // console.log(pager)
    const { beforeSetData } = this.props;
    const self = this;
    pager.showSizeChanger = true;
    pager.onShowSizeChange = this.handleSizeChange.bind(self);
    pager.showQuickJumper = true;

    // 区分是手动触发的刷新,还是由用户点击的下一页,如果是由用户点击的,则获取用户改变额信息
    if (pagination) {
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize;
    } else {
      const { pageSize = 10 } = this.props;
      pager.current = 1;
      pager.pageSize = pageSize;
    }

    self.setState({
      pagination: pager,
      loading: true,
      param,
    });

    self
      .requestData({
        pageSize: pager.pageSize,
        pageNo: pager.current,
        param,
      })
      .then(data => {
        const pagination = { ...self.state.pagination };
        // 此处修改获取数据对应的总数
        data = data || {};
        //TODO 自动生成key 不使用数组序号
        let records = data.data.map((item, index) => {
          let newItem = { ...item, key: index + 1, index: index + 1 }
          return newItem;
        });

        // 对数据库拉到的数据, 进行预处理
        if (beforeSetData) {
          records = beforeSetData(records);
        }

        this.setState({ total: data.total });

        pagination.total = data.total;
        // // 跳页的时候取消编辑状态
        // pagination.onChange = this.cancel;
        self.setState({
          loading: false,
          // 此处修改对应的获取数据的结果集,
          initialData: records,
          data: records,
          modifiedRecords: [],
          pagination,
          selectedRowKeys: [],
        });
      }).catch((error) => {
        self.setState({
          loading: false
        })
      });
  }
  paginationChange = (page, pageSize) => {
    const pagination = { current: page, pageSize }
    this.handleTableChange(pagination)
  }
  /**
   * 当表格改变后出发的事件,也就是点击下一页或者上一页出发的事件
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   */
  handleTableChange = (pagination) => {
    const { param } = this.state;
    // 跳页的时候取消所有的编辑状态
    this.cancel();
    this.refresh(param, pagination);
  }

  // 检测这个行数据是否被修改过
  getIsModified = (record) => {
    const { modifiedRecords } = this.state;
    const modifiedData = modifiedRecords[record.key];
    if (modifiedData && Object.keys(modifiedData).length > 0) {
      return true;
    }
    return false;
  }

  // 得到列的信息
  getColumns() {
    const { mode, ellipsis } = this.props;
    const columns = [...this.props.columns];
    const { current, pageSize } = this.state.pagination
    // 每一行加上序号
    columns.unshift({
      dataIndex: 'index',
      title: '序号',
      width: 60,
      fixed: 'left',
      render: (data, record) => {
        if (this.getIsModified(record)) {
          return <a><Icon type="edit" />{data}</a>
        }
        console.log(data)
        return parseInt(data + (current - 1) * pageSize);
      },
    });
    // 添加溢出隐藏
    if (ellipsis !== false) {
      columns.map(item => {
        item.ellipsis = true
      })
    }

    let newColumns = [...columns];
    // 编辑状态给可编辑的单元提供相关的编辑属性
    if (mode !== 'readonly') {
      newColumns = columns.map(item => {
        item.ellipsis = true
        // 不是可操作列的都不会给单元格属性
        if (!item.editable) {
          return item;
        }
        const { editable, inputType, props, initialValue, rules, dataIndex, title, component } = item;

        return {
          ...item,
          onCell: record => ({
            record,
            mode,
            component,
            editable,
            inputType,
            inputProps: props,
            initialValue,
            rules,
            dataIndex,
            title,
            editing: this.isEditing(record)
          })
        }
      });
    }

    // 行编辑提供的操作模式是单行同时打开编辑模式, 每行的 onRowSave 当成是属性暴露
    if (mode === 'rowEdit') {
      const { onRowSave, onRowDelete } = this.props;
      newColumns.push({
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => onRowSave(form, record, (flag, msg) => {
                      if (flag === true) {
                        this.setState({ editingKey: '' })
                        this.refresh();
                        message.success(msg || '修改成功')
                      } else {
                        message.error(msg || '修改失败')
                      }
                    })}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
              <span>
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                  编辑
                </a>
                {" "}
                <Popconfirm title="Sure to delete?" onConfirm={() => onRowDelete(record.id, (flag, msg) => {
                  if (flag === true) {
                    message.success('删除成功')
                    this.refresh();
                  } else {
                    message.error(msg || '删除失败')
                  }

                })}>
                  <a>删除</a>
                </Popconfirm>
              </span>

            );
        }
      }
      )
    }
    // 单元格编辑提供的操作模式为点击单元格，然后变为编辑状态，失去焦点时保存数据到本地,标记单元格所在行为已编辑，提供删除按钮，删除行
    if (mode === 'cellEdit') {
      newColumns.push({
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        render: (text, record) =>
          this.state.data.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      })
    }
    // 三种模式

    this.setState({
      tableColumns: newColumns.map((col, index) => ({
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      }))
    })
    return newColumns;
  }


  // 单元格内数据发生变化时，得到变化的项, 并且表格
  handleSave = (modifiedRecords) => {
    // this.generateChangedData();
    this.setState({ modifiedRecords })
  }

  // 得到变化后的表格数据
  generateChangedData = () => {
    const data = [...this.state.initialData];
    // const { modifiedRecords } = this.state;
    // const mkeys = Object.keys(modifiedRecords);
    // for(let i = 0; i< mkeys; i+=1){
    //   const key = mkeys[i];
    //   for(let j = 0; j< data.length; j+=1){
    //     if(key === data[j].key){
    //       data[j] = {...data[j],...modifiedRecords[key]}
    //       return;
    //     }
    //   }
    // }
    // this.setState({ data })
    return data
  }

  // mode 为 rowEdit 行编辑模式下判断当前是否为编辑状态
  isEditing = record => record.key === this.state.editingKey;

  // 编辑
  edit(key) {
    this.setState({ editingKey: key });
  }

  // 取消编辑
  cancel = (key) => {

    // 正在创建的数据点击取消
    if (key === 'creating') {
      let newData = [...this.state.data];
      newData.shift();
      this.setState({
        data: newData,
        editingKey: ''
      })
    } else {
      this.setState({ editingKey: '' });
    }


  };

  //创建新数据
  create = (data) => {
    let newData = [...this.state.data];
    newData.unshift({ key: 'creating', ...data });
    this.setState({ data: newData, editingKey: 'creating' })
  }

  // 得到表格宽度
  getScrollWidth = () => {
    let scrollWidth = 0;
    this.props.columns.map(item => { scrollWidth += (item.width || 150) })
    return scrollWidth
  }


  // 得到修改的数据
  getData() {
    const { data, modifiedRecords } = this.state;

    const mkeys = Object.keys(modifiedRecords);
    let newData = data.filter(item => {
      let flag = false;
      for (let i = 0; i < mkeys.length; i += 1) {
        if (item.id === mkeys[i]) {
          flag = true;
          return flag
        }
      }
      return flag;
    })

    newData = newData.map(item => {
      return {
        ...item,
        ...modifiedRecords[item.id]
      }
    })

    return newData;
  }

  getRowProps = (record) => {
    const self = this;
    if (this.initital === false) {
      this.initital = true
      const { onRowClick = () => { } } = this.props;
      return {
        onClick: (e) => {
          onRowClick(record, e);
        },
      };
    } else {
      return {
        onClick: (e) => {
          this.setState({
            onClickSelectId: record.id
          })
        },
      };
    }
  }

  handleResize = (index) => (e, { size }) => {
    this.setState(({ tableColumns }) => {
      const nextColumns = [...tableColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { tableColumns: nextColumns };
    });
  };

  render() {
    const self = this;
    const locale = 'zhCN';
    const { headerButton, batchButton, isBatch, scroll, isShowExport, queryShowExport } = this.props;
    const { selectedRowKeys, initailData, data, pagination, loading } = this.state;
    const y = scroll ? (selectedRowKeys.length > 0 && headerButton.length === 0 ? scroll.y - 50 : scroll.y) : false



    const { tableColumns } = this.state;

    return (
      <div style={{ position: "relative" }} className={style.tableWrap}>
        <div style={{
          display: 'flex', marginTop: 5, padding: "6px 0 0 6px", backgroundColor: "#f2f2f2", borderStyle: "solid", borderColor: "#e8e8e8", borderWidth: "1px 1px 0 1px"
        }}>
          {
            headerButton.map(button => {
              // button = React.cloneElement(button, { size: "small" })
              return <div style={{ marginRight: 10, marginBottom: 10 }}>{button}</div>;
            })
          }
          {batchButton.map(item => {
            // 给button 添加onClick事件 并添加参数
            let { node, onClick } = item;
            if (node !== undefined) {
              node = React.cloneElement(node, {
                disabled: !(selectedRowKeys.length > 0),
                // size: "small",
                onClick: () => {
                  confirm({
                    title: `你确定要${node.props.children}这${selectedRowKeys.length}项吗？`,
                    // content: `${node.props.children}之后将无法回复`,
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                      onClick(self.state.selectedRowKeys, self.state.selectedRows);
                    },
                  });
                },
              });
            }
            return <div style={{ marginRight: 10, marginBottom: 10 }}>{node}</div>;
          })
          }
        </div>

        {/* {isBatch ? (
          <TableAlertInfo
            onCancel={() => {
              this.setState({ selectedRowKeys: [] });
            }}
            onExportBackEnd={this.checkTotalExport}
            onExport={this.onExportSinglePage}
            isShowExport={isShowExport && selectedRowKeys.length > 0}
            queryShowExport={queryShowExport}
            selectedLength={selectedRowKeys.length}
            sumLength={data.length}
            showIcon
          />
        ) : null} */}

        <ConfigProvider locale={locale}>
          <EditableTable
            handleSave={this.handleSave}
            rowSelection={this.getRowSelection({
              isBatch,
              self: this,
              selectedRowKeys
            })}
            dataSource={data}
            pagination={false}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={record => record.id}
            size='small'
            bordered
            onRow={this.getRowProps}
            components={{
              header: {
                cell: ResizeableTitle,
              }
            }}
            {...this.props}
            scroll={{
              y,
              x: this.getScrollWidth()

            }}
            columns={tableColumns}
            rowClassName={(record, index) => {
              if (record.id === this.state.onClickSelectId) {
                return `${style.clickRowStyle}`
              } else if (index % 2) {
                return `${style.rowDouble}`
              }
            }}
          />
          <div style={{ overflow: "hidden", color: "#999", padding: "6px", border: "solid #eee", borderWidth: "0 1px 1px 1px", opacity: loading ? 0.1 : 1, display: pagination.total ? '' : 'none' }}>

            <div style={{ float: "left", }}>共<span style={{ margin: 5, color: 'black' }}>{pagination.total}</span>条记录
            </div>
            {/* <Col span={3}>已选中<span style={{ margin: 5, color: '#1890ff' }}>{selectedRowKeys.length}</span>
条
</Col> */}
            <div style={{ float: "left", marginLeft: "20px" }}>第
              <span style={{ margin: 5 }}>{pagination.current}/{Math.ceil(pagination.total / pagination.pageSize)}</span>
页</div>
            <div style={{ float: "right", display: Math.ceil(pagination.total / pagination.pageSize) > 1 ? '' : 'none' }}>
              <Button type="default" size='small' style={{ backgroundColor: '#f2f2f2', marginLeft: '5px' }}>确定</Button>
            </div>
            <div style={{ float: "right" }}>
              <Pagination onChange={this.paginationChange} onShowSizeChange={this.handleSizeChange.bind(this)} {...pagination} size="small" />
            </div>
          </div>
        </ConfigProvider>
      </div >
    );
  }
}
// class LinkTable extends React.Component {

// }
// export default LinkTable