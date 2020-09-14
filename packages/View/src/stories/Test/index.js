import React from 'react';
import style from '../../components/Test/index.css'
import Test from '../../components/Test';
import { v4 as uuidv4 } from 'uuid';
export default class TestPage extends React.Component {
  state = {
    dataSource: { //审核人
      id: '001',
      type: '1',
      props: {},
      childNode: { //路由
        id: '002',
        type: '4',
        props: {},
        childNode: { //抄送人
          id: '003',
          type: '2',
          props: {},
          childNode: null
        },
        conditionNodes: [
          {
            id: '003-1',
            type: '3',
            props: {},
            childNode: null,
            conditionNodes: []
          },
          {
            id: '003-2',
            type: '3',
            props: {},
            childNode: null,
            conditionNodes: []
          }
        ]
      },
      conditionNodes: []
    }
  }
  changeDataRecursive(id) {
    const { dataSource } = this.state
    // dataSource.
  }
  addCondition(id) {
    debugger
    const { dataSource } = this.state
    const uuid = uuidv4()
    dataSource.forEach((c) => {
      if(c.resourceId === id) {
        c.children[uuid] = [{resourceId: uuid, children: {}}]
      }
    })
    debugger
    this.setState({
      dataSource
    })
  }
  addNode(obj, key) {
    const { dataSource } = this.state
    if(key === 3) {
      debugger
    }else { 
      debugger
      // if() {

      // }
    }
  }
  render() {
    return (
      <div className={style.dingFlowDesign}>
        <Test 
          dataSource={this.state.dataSource} 
          addCondition={this.addCondition.bind(this)}
          addNode={this.addNode.bind(this)}
        />
      </div>
    )
  }
}