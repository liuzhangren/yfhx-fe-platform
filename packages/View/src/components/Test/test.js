import React from 'react';
import style from './index.css';
import NodeStart from './NodeStart'
import NodeEnd from './NodeEnd'
import Node1 from './Node1'
import Node2 from './Node2'
import Node3 from './Node3'
import { v4 as uuidv4 } from 'uuid';

export default class TotalFlow extends React.Component {
  state = {
    dataSource: {
      id: 'start',
      type: 'start',
      props: {},
      conditionNodes: [],
      childNode: { //审核人
        id: '001',
        type: '1',
        props: {},
        childNode: { //抄送人
          id: '002',
          type: '2',
          props: {},
          childNode: {
            id: 'end',
            type: 'end',
            props: {},
            conditionNodes: [],
            childNode: null
          },
          conditionNodes: []
        },
        conditionNodes: []
      }
    }
  }
  addConditionNode(params) {
    
    const { dataSource } = this.state
    const newDataSource = this.findItemAndChangeData(dataSource, params.id, '3')
    
    this.setState({
      dataSource: newDataSource
    })
  }
  addNode(data, type) {
    const { id } = data
    const { dataSource } = this.state
    
    if(data == 'start') {
      if(type != 3) {
        const { childNode } = dataSource
        dataSource.childNode = {
          id: uuidv4(),
          props: {},
          type,
          childNode,
          conditionNodes: []
        }
        // const newDataSource = {
        //   id: uuidv4(),
        //   props: {},
        //   type,
        //   childNode,
        //   conditionNodes: []
        // }
        this.setState({
          dataSource
        })
      }else {
        dataSource.conditionNodes = [
          {
            id: uuidv4(),
            type,
            childNode: null,
            conditionNodes: [],
            props: {}
          },
          {
            id: uuidv4(),
            type,
            childNode: null,
            conditionNodes: [],
            props: {}
          }
        ]
        this.setState({
          dataSource
        })
      }
    }else if(data == 'end') {

    }else {
      const newDataSource = this.findItemAndChangeData(dataSource, data.id, type)
      
      this.setState({
        dataSource: newDataSource
      })
    }
  } 
  findItemAndChangeData(data, id, type) {
    console.log({data})
    if(data.id != id) {
      if(data.childNode) {
        const rest = this.findItemAndChangeData(data.childNode, id, type)
        // console.log('呵呵呵', rest)
      }else {
        // if(data.conditionNodes.length > 0) {
        //   data.conditionNodes.forEach((c) => {
        //     if(c.childNode) {
        //       this.findItemAndChangeData(c, id, type)
        //     }
        //   })
        // }
        //重新找 condition
        // console.log('没有找到')
        debugger
        const res = this.findItemInConditionNodes(this.state.dataSource, id, type)
        data = res
      }
      
    }else {
      console.log('找到了！！！', data)
      const { childNode } = data
      
      if(type!=3) {
        data.childNode = {
          id: uuidv4(),
          props: {},
          type,
          conditionNodes: [],
          childNode
        }
      }else {
        const { conditionNodes } = data
        if(conditionNodes.length > 0) {
          data.conditionNodes = [...conditionNodes, {
            id: uuidv4(),
            props: {},
            type,
            conditionNodes: [],
            childNode: null
          }]
        }else {
          data.conditionNodes = [
            {
              id: uuidv4(),
              props: {},
              type,
              conditionNodes: [],
              childNode: null
            },
            {
              id: uuidv4(),
              props: {},
              type,
              conditionNodes: [],
              childNode: null
            }
          ]
        }
      }
    }
    return data
  }
  findItemInConditionNodes(data, id, type) {
    if(data.conditionNodes.length > 0) {
      debugger
      if(data.conditionNodes.length == 0) {
        const { childNode } = data
        if(type!=3) {
          data.childNode = {
            id: uuidv4(),
            conditionNodes: [],
            type,
            props: {},
            childNode
          }
        }else {
          data.conditionNodes = [
            {
              id: uuidv4(),
              props: {},
              type,
              conditionNodes: [],
              childNode: null
            },
            {
              id: uuidv4(),
              props: {},
              type,
              conditionNodes: [],
              childNode: null
            }
          ]
        }
      }else {
        if(data.id == id) {
          const { conditionNodes } = data
          data.conditionNodes = [
            ...conditionNodes,
            {
              id: uuidv4(),
              conditionNodes: [],
              type,
              props: {},
              childNode: null
            }
          ]
        }else {
          data.conditionNodes.forEach((c, i) => {
            if(c.id == id) {
              console.log('找到了!!!', c)
              const { childNode } = c
              if(type!=3) {
                c.childNode = {
                  id: uuidv4(),
                  conditionNodes: [],
                  type,
                  props: {},
                  childNode
                }
              }else {
                data.conditionNodes = [
                  {
                    id: uuidv4(),
                    props: {},
                    type,
                    conditionNodes: [],
                    childNode: null
                  },
                  {
                    id: uuidv4(),
                    props: {},
                    type,
                    conditionNodes: [],
                    childNode: null
                  }
                ]
              }
              
            }else {
              this.findItemInConditionNodes(c, id, type)
            }
          })
        }
      }
      return data
    }else {
      debugger
      if(data.id == id) {
        const { conditionNodes, childNode } = data
        if(type != 3) {
          data.childNode = {
            id: uuidv4(),
            type,
            childNode,
            conditionNodes: [],
            props: {}
          }
        }else {
          if(conditionNodes.length >0) {
            data.conditionNodes = [
              ...conditionNodes,
              {
                id: uuidv4(),
                props: {},
                type: '3',
                childNode:null,
                conditionNodes: []
              }
            ]
          }else {
            data.conditionNodes = [
              {
                id: uuidv4(),
                props: {},
                type: '3',
                childNode:null,
                conditionNodes: []
              },
              {
                id: uuidv4(),
                props: {},
                type: '3',
                childNode:null,
                conditionNodes: []
              }
            ]
          }
        }
      }else {
        if(data.childNode) {
          this.findItemInConditionNodes(data.childNode, id, type)
        }
      }
    }
    return data
  }

  renderFlowNodes(dataSource, nodeArr) {
    if(dataSource.type==1) {
      nodeArr.push(<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><Node1 key={dataSource.id} data={dataSource} addNode={this.addNode.bind(this, dataSource)} /></div>)
      if(dataSource.conditionNodes.length > 0) {
        nodeArr.push(<Node3 key={dataSource.id} data={dataSource} click={this.addConditionNode.bind(this)} addNode={this.addNode.bind(this)} branches={dataSource} />)
      }
    }else if(dataSource.type == 2) {
      nodeArr.push(<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><Node2 key={dataSource.id} data={dataSource} addNode={this.addNode.bind(this)} /></div>) 
      if(dataSource.conditionNodes.length > 0) {
        nodeArr.push(<Node3 key={dataSource.id} data={dataSource} click={this.addConditionNode.bind(this)} addNode={this.addNode.bind(this)} branches={dataSource} />)
      }
    }else if(dataSource.type == 'start') {
      nodeArr.push(<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><NodeStart key={dataSource.id} data={dataSource} addNode={this.addNode.bind(this, 'start')} /></div>) 
      if(dataSource.conditionNodes.length > 0) {
        nodeArr.push(<Node3 key={dataSource.id} data={dataSource} click={this.addConditionNode.bind(this)} addNode={this.addNode.bind(this)} branches={dataSource} />)
      }
    }else {
      nodeArr.push(<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><NodeEnd key={dataSource.id} data={dataSource} addNode={this.addNode.bind(this, 'end')} /></div>) 
      if(dataSource.conditionNodes.length > 0) {
        nodeArr.push(<Node3 key={dataSource.id} data={dataSource} click={this.addConditionNode.bind(this)} addNode={this.addNode.bind(this)} branches={dataSource} />)
      }
    }
    if(dataSource.childNode) {
      this.renderFlowNodes(dataSource.childNode, nodeArr)
    }
    return nodeArr
  }
  render() {
    // console.log(this.state.dataSource)
    return (
      <div style={{overflow: 'none', float: 'left', padding: '10px'}}>
        {/* <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><NodeStart addNode={this.addNode.bind(this, 'start')} /></div> */}
        {
          this.renderFlowNodes(this.state.dataSource, [])
        }
        {/* <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><NodeEnd addNode={this.addNode.bind(this, 'end')} /></div> */}
      </div>
    )
  }
}