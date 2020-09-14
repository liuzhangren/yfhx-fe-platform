import React from 'react';
import Table from '../../components/Table';
import {
  Button,
  Icon
} from 'antd';

const colums = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: text => <a>{text}</a>,
    width: 200
  },
  {
    title: 'Age',
    dataIndex: 'age', width: 200
  },
  {
    title: 'Address',
    dataIndex: 'address'
  },
];
const data = [
  {
    key: '1',
    id: '1',
    name: 'John Brown',
    age: 32,
    checked: true,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    id: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    id: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    id: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '5',
    id: '5',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '6',
    id: '6',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '7',
    id: '7',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '8',
    id: '8',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '9',
    id: '9',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '10',
    id: '10',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '11',
    id: '11',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '12',
    id: '12',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '13',
    id: '13',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '14',
    id: '14',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];

export default class App extends React.Component {
  state = {
    disabled: true,
    selectedRowKeys: []
  }
  componentDidMount() {
    this.setState({
      selectedRowKeys: ['1', '2']
    })
  }
  expandedRowRender = () => {
    const columns = [
      {title: 'name', dataIndex: 'name', key: 'name'},
      {title: 'age', dataIndex: 'age', key: 'age'},
    ]
    const data = [
      {
        key: '1',
        id: '1',
        name: 'tom',
        age: 10
      },
      {
        key: '2',
        id: '2',
        name: 'jerry',
        age: 12
      }
    ]
    return <Table defaultChecked={this.state.selectedRowKeys} onChange={this.subChange.bind(this)} columns={columns} dataSource={data} pagination={false} />;
  }
  subChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRowKeys
    })
  }
  renderHeader = () => {
    return (
      <div>
        <Button style={{ marginRight: 10, marginBottom: 10 }} type='primary'>新增</Button>
        <Button style={{ marginRight: 10, marginBottom: 10 }} >批量删除</Button>
      </div>
    )
  }
  onChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows)

    if (selectedRows.length > 0) {
      this.setState({
        disabled: false,
        selectedRowKeys
      })
    } else {
      this.setState({
        disabled: true
      })
    }
  }
  rowSelected = (record) => {
    console.log('rowSelected', record)
  }


  click() {
    // console.log('hahhaha', this.child.clearData)
    this.child.clearData()
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
  }
  render() {
    return (
      <div style={{ width: 800, margin: '0 auto' }}>
        <Table
          columns={colums}
          dataSource={data}
          //checkable
          bordered
          isSpin
          // defaultChecked={['1']}
          isOperation
          sortChange={this.handleTableChange}
          ref={(child) => { this.child = child; }}
          scroll={{ y: 300 }}
          pagination={{
            total: 20,
            pageSize: 10,
            current: 1
          }}
          expandedRowRender={this.expandedRowRender.bind(this)}
          // rowSelected={'hello'}
          rowSelectedChecked
          onChange={this.onChange}
          batchButton={[
            <Button type='primary'>新增</Button>,
            <Button type='primary'>同步</Button>,
            <Button disabled={this.state.disabled} onClick={() => { }}>批量删除</Button>
          ]}
        />
      </div>
    )
  }
}