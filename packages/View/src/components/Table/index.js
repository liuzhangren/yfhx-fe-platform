import React from 'react';
import {
  Table,
  Divider,
  Popconfirm,
  ConfigProvider,
  Spin,
  Button,
  Pagination
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import style from './index.less';

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


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      rowSelectedKeys: []
    }
  }
  componentWillReceiveProps(nextProps) {
    const { defaultChecked } = nextProps;
    if (defaultChecked) {
      this.setState({ selectedRowKeys: defaultChecked })
    }
  }

  componentDidMount() {
    const { dataSource, columns, sortNo, defaultChecked } = this.props;
    if (defaultChecked) {
      this.setState({ selectedRowKeys: defaultChecked })
    }
    let obj = {};
    let column = columns
    column = column.reduce((item, next) => {
      obj[next.dataIndex] ? '' : obj[next.dataIndex] = true && item.push(next);
      return item;
    }, []);

    sortNo ? null : column.unshift({
      title: '序号',
      dataIndex: 'no',
      width: 51,
      align: 'left'
    })

    this.setState({
      columns: column.map((col, index) => ({
        ...col,
        ellipsis: true,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      }))
    })
    const rowSelectedKeys = dataSource && dataSource.length>0 ? dataSource.reduce((r, c) => {
      return [
        ...r,
        false
      ]
    }, []) : []
    this.setState({
      rowSelectedKeys
    })
  }
  handleResize = (index) => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
      };
      return { columns: nextColumns };
    });
  };
  rowSelection(selectedRowKeys) {
    const { onChange } = this.props;
    return {
      columnWidth: 30,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
        onChange(selectedRowKeys, selectedRows)
      },
      selectedRowKeys,
      getCheckboxProps: record => {
        // 
        if (this.props.reShowChecked) {
          return ({
            defaultChecked: this.state.selectedRowKeys && this.state.selectedRowKeys.includes(`${record.id}`),
          })
        } else {
          return
        }
      }
    }
  }

  onShowSizeChange(page, limit) {
    const { onShowSizeChange } = this.props;
    onShowSizeChange ? onShowSizeChange(page, limit) : console.log('没有该方法！');
  }
  paginationChange(page, size) {
    const { paginationChange } = this.props;
    paginationChange ? paginationChange(page, size) : console.log('没有该方法！');
  }
  // 得到表格宽度
  getScrollWidth = () => {
    let scrollWidth = 0;
    this.props.columns.map(item => { scrollWidth += (item.width || 150) })
    return scrollWidth
  }
  clearData = () => {
    this.setState({
      selectedRowKeys: []
    })
  }
  render() {

    const { dataSource, checkable, onExpand, expandedRowRender, bordered, batchButton, isOperation, pagination, rowSelectedChecked, scroll } = this.props;
    const { selectedRowKeys } = this.state;
    const y = scroll && scroll.y

    const newDataSource = dataSource && dataSource.length > 0 ? dataSource.reduce((r, c, i) => {
      return [
        ...r,
        {
          no: i + 1,
          ...c
        }
      ]
    }, []) : []

    const paginationOptions = pagination ? pagination : {
      total: newDataSource.length,
      limit: 10,
      page: 1
    }

    return (
      <div style={{ position: "relative" }} className={style.tableWrap}>
        <ConfigProvider locale={zhCN}>
          {
            batchButton && batchButton.length > 0 ?
              <div className={style.titleWrap} style={{ display: 'flex' }}>
                {
                  batchButton.map((item, index) => {
                    return <div key={index}>{item}</div>;
                  })
                }
              </div> :
              null
          }
          <Table
            size="small"
            components={{
              header: {
                cell: ResizeableTitle,
              }
            }}
            columns={this.state.columns}
            loading={this.props.loading}
            dataSource={newDataSource}
            bordered={bordered}
            onChange={this.props.sortChange}
            rowSelection={checkable ? undefined : this.rowSelection(selectedRowKeys)}
            scroll={{
              y,
              x: this.getScrollWidth()

            }}
            expandedRowRender={expandedRowRender}
            onExpand={onExpand}
            rowClassName={(record, index) => {
              const { rowSelectedKey } = this.state;
              if (rowSelectedChecked && this.state.rowSelectedKeys[index]) {
                return style.rowColor
              } else if (!rowSelectedChecked && (rowSelectedKey === record.id)) {
                return style.rowColor
              }
              if (index % 2 === 1) {
                return style.dartRow
              }
            }}
            rowKey='id'
            pagination={false}
            onRow={
              (record, index) => {
                return {
                  onClick: async (event) => {
                    if (rowSelectedChecked) {
                      const { rowSelectedKeys } = this.state;
                      rowSelectedKeys[index] = !this.state.rowSelectedKeys[index]
                      await this.setState({
                        rowSelectedKeys
                      })
                    } else {
                      this.setState({
                        rowSelectedKey: record.id
                      })
                    }
                    await this.props.rowSelected && typeof (this.props.rowSelected) === 'function' ? this.props.rowSelected(record, this.state.rowSelectedKeys) : console.log('hello')
                  },
                  onDoubleClick: async (event) => {
                    if (rowSelectedChecked) {
                      const rowSelectedKeys = this.state.rowSelectedKeys;
                      rowSelectedKeys[record.no - 1] = !this.state.rowSelectedKeys[record.no - 1]
                      await this.setState({
                        rowSelectedKeys
                      })
                    } else {
                      this.setState({
                        rowSelectedKey: record.no
                      })
                    }
                    await this.props.rowDoubleSelected && typeof (this.props.rowDoubleSelected) === 'function' ? this.props.rowDoubleSelected(record, this.state.rowSelectedKeys) : console.log('hello')
                  }
                }
              }
            }
          // {...this.props}

          />
          {
            //border: "solid #ddd",
            !dataSource || dataSource.length === 0 ?
              null : pagination ?
                (<div style={{ overflow: "hidden", color: "#999", padding: "4px 8px 6px 10px", border: "solid #ddd", borderWidth: "0 1px 1px 1px", opacity: this.props.loading ? 0.1 : 1, display: 'pagination.total' ? '' : 'none' }}>
                  <div style={{ float: "left", }}>共<span style={{ margin: 5, color: 'black' }}>{paginationOptions.total}</span>条记录
              </div>
                  <div style={{ float: "left", marginLeft: "20px" }}>第
                <span style={{ margin: 5 }}>{paginationOptions.page}/{Math.ceil(paginationOptions.total / paginationOptions.limit)}</span>
              页</div>
                  <div style={{ float: "right", display: Math.ceil(paginationOptions.total / paginationOptions.limit) > 1 ? '' : 'none' }}>
                    <Button type="default" size='small' style={{ marginLeft: '10px' }}>确定</Button>
                  </div>
                  <div style={{ float: "right" }}>
                    <Pagination
                      showQuickJumper
                      onChange={this.paginationChange.bind(this)}
                      showSizeChanger
                      total={paginationOptions.total}
                      limit={paginationOptions.limit}
                      current={paginationOptions.page}
                      onShowSizeChange={this.onShowSizeChange.bind(this)}
                      size="small"
                    />

                  </div>
                </div>)
                : null
          }
        </ConfigProvider>
      </div>
    )
  }
}