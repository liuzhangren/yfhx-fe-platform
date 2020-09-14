import React from 'react';
import LinkTable from '../../components/LinkTable/LinkTable';

const dataSource = [
  {
    key: '1',
    projectName: '项目1',
    appScheme: '001'
  },
  {
    key: '2',
    projectName: '项目2',
    appScheme: '002'
  },
  {
    key: '3',
    projectName: '项目3',
    appScheme: '003'
  }
]

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.myRef.current.refresh()
  }
  render() {
    return (
        <LinkTable
          ref={this.myRef}
          columns={[
            {
              dataIndex: 'projectName',
              title: '项目名称',
              width: 150,
            },
            {
              dataIndex: 'appScheme',
              title: '项目编号',
              align: 'center',
              width: 100,
            },
          ]}
          scroll={{ y: (500 - 210) }}
          // link="/api/platform/get/v1/porgs"
          pageSize="10"
          isBatch={true}
          dataSource={dataSource}
        />
    )
  }
}