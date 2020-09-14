import React from 'react';
import treeData from './data';
import Tree from '../../components/Tree';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  check(checkedKeys) {
    console.log('onChecked', checkedKeys)
  }
  select(selectedKeys, info) {
    console.log('onSelect', info);
  }
  render() {
    return (
      <Tree
        treeData={treeData}
        // showIcon
        // checkable
        // selectedKeys={['0-0']}
        // checkStrictly
        // isSearch={true}
        width='200px'
        height='400px'
        check={this.check.bind(this)}
        select={this.select.bind(this)}
      />
    )
  }
}
