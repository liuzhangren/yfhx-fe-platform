import React from 'react';
import Node from './Node';
import StartNode from './StartNode'
import EndNode from './EndNode'
import SForm from '../Form/SForm'
import dataSource from './dataSource'
import {
  Card,
  Button
} from 'antd'
const newData = dataSource.reduce((r, c) => {
  return {
    ...r,
    [c.resourceId]: c
  }
}, {})
const findNextNode = (ids) => {
  const res = ids.reduce((r, c) => {
    const nextNode = newData[c.resourceId]
    r.push(nextNode)
    if(nextNode.outgoing.length > 0) {
      const caches = findNextNode(nextNode.outgoing)
      r.push(...caches)
    }  
    if(nextNode.outgoing.length > 1){
      r = [...r , nextNode.outgoing.reduce((_r, _c) => {
        return [
          ..._r,
          ...newData[_c.resourceId].outgoing.reduce((__r, __c) => {
            return [
              ...__r,
              newData[__c.resourceId]
            ]
          }, [])
        ]
      }, [])]
    }
    return r
  }, [])
  const newRes = res.reduce((r, c, i) => {
    if(!Array.isArray(c)) {
      r[c.resourceId] = c
    }else {
      r[`temp${i}`] = c
    }
    return r
  }, {})
  const rr = Object.values(newRes).filter((c) => {
    if(Array.isArray(c)?true:c.stencil.id === "UserTask" ) {
      return c
    }
  })
  console.log({rr})
  return rr
}
const getNodesObj = (data) => {
  const startNode = data.filter((c) => c.stencil.id === 'StartNoneEvent')[0]
  const obj = {}
  for(let i = 0; i < startNode.outgoing.length ; i++) {
    const nextNodes = findNextNode(startNode.outgoing)
    obj[`branch${i+1}`] = nextNodes
  }
  debugger
  return obj
}

class App extends React.Component {
  state = {
    startClickCount: 0,
    optionPaneVisible: false,
    nodes: {
      branch1: [
        {
          type: 0
        },
        {
          type: 1,
          children: [
            {
              type: 0
            },
            {
              type: 1
            }
          ]
        },
      ],
      branch2: [
        {
          type: 0
        },
        {
          type: 1
        }
      ]
    }
  }
  componentDidMount() {
    // this.setState({
    //   nodes: getNodesObj(dataSource)
    // })
  }
  async startClick(e) {
    await this.setState({
      startClickCount: this.state.startClickCount + 1
    })
    const { nodes } = this.state;
    if(e.key == 0) {
      nodes[`branch${this.state.startClickCount}`] = [
        {
          type: 0
        }
      ]
      nodes[`branch${this.state.startClickCount+1}`] = [
        {
          type: 0
        }
      ]
    }else {
      nodes[`branch${this.state.startClickCount}`] = [
        {
          type: 1
        }
      ]
    }
    this.setState({
      nodes
    })
  }
  onClick() {
    // this.setState({
    //   optionPaneVisible: true
    // })
  }
  click({branchKey, branchIndex}, e) {
    const { nodes } = this.state;
    if(e.key == 0) {
      if(nodes[branchKey][branchIndex].type === 0) {
        // debugger
      }else {
        nodes[branchKey].splice(branchIndex+1, 0, {type: 0})
      }
    }else {
      nodes[branchKey].splice(branchIndex+1, 0, {type: 1})
    }
    this.setState({
      nodes
    })
  }
  cancel() {
    this.setState({
      optionPaneVisible: false
    })
  }
  close({branchKey, branchIndex}) {
    const { nodes } = this.state;
    if(nodes[branchKey].length === 1) {
      delete nodes[branchKey]
    }else {
      nodes[branchKey].splice(branchIndex-1, 1)
    }
    this.setState({
      nodes
    })
  }
  render() {
    const formItems = [
      {
        key: 'nodeType',
        label: '节点类型',
        componentType: 'input'
      },
      {
        key: 'nodeState',
        label: '节点状态',
        componentType: 'input'
      },
      {
        key: 'others',
        label: '其他',
        componentType: 'input'
      },
      {
        key: 'others',
        label: '其他',
        componentType: 'input'
      },
      {
        key: 'others',
        label: '其他',
        componentType: 'input'
      },
      {
        key: 'others',
        label: '其他',
        componentType: 'input'
      },
      {
        key: 'others',
        label: '其他',
        componentType: 'input'
      },
    ]
    const { nodes } = this.state;
    const  getMinNodes = (nodes) => {
      const sortAscArr = Object.keys(nodes).reduce((r, c) => {
        return [
          ...r,
          nodes[c].length
        ]
      }, []).sort((a, b) => a - b)
      const min = sortAscArr[0]
      const max = sortAscArr[sortAscArr.length - 1]
      const maxNodes = Object.keys(nodes).reduce((r, c) => {
        if(nodes[c].length === max) {
          r = nodes[c].length
        }
        return r
      }, '')
      const minNodes = Object.keys(nodes).reduce((r, c) => {
        if(nodes[c].length === min) {
          r = nodes[c].length
        }
        return r
      }, '')
      const leftNodesArr = Object.keys(nodes).reduce((r, c) => {
        return {
          ...r,
          [c]: maxNodes - nodes[c].length
        }
      }, {})
      return {
        minKey: Object.keys(nodes).reduce((r, c) => {
          if(nodes[c].length === min) {
            r.push(c)
          }
          return r
        } , []),
        leftNodes: leftNodesArr
      }
    }
    const { minKey, leftNodes } = getMinNodes(nodes)
    return (
      <>
        <div style={{marginLeft: '300px'}}>
          <StartNode 
            click={this.startClick.bind(this)}
            branches = {Object.keys(nodes).length}
          />
          <div style={{display: 'flex'}}>
            {
              Object.keys(nodes).reduce((r, c, i) => {
                return [
                  ...r,
                  <div key={`box_${i}`} style={{marginRight: '20px'}}>
                    {
                      nodes[c].reduce((_r, _c, _i) => {
                        const flag = _i + 1 === nodes[c].length && minKey.length !== Object.keys(nodes).length && minKey.includes(c) && Object.keys(nodes).length !== 1 ?true:false
                        return [
                          ..._r,
                          Array.isArray(_c)? 
                          _c.map((item) => {
                            return (
                              <Node
                                onClick={this.onClick.bind(this)} 
                                leftNodes={leftNodes[c]} 
                                flag={flag}  
                                type={this.state.type} 
                                close={this.close.bind(this, {branchKey: c, branchIndex: _i})} 
                                click={this.click.bind(this, {branchKey: c, branchIndex: _i})} 
                                key={`${c}_node_${i}_${_i}`} 
                                title={item.type == 0?'条件':'审批'} 
                                content={item.type == 0?'条件':'审批'} 
                              />
                            )
                          }):
                          <Node 
                            onClick={this.onClick.bind(this)} 
                            leftNodes={leftNodes[c]} 
                            flag={flag}  
                            type={this.state.type} 
                            close={this.close.bind(this, {branchKey: c, branchIndex: _i})} 
                            click={this.click.bind(this, {branchKey: c, branchIndex: _i})} 
                            key={`${c}_node_${i}_${_i}`} title={_c.type == 0?'条件':'审批'} 
                            content={_c.type == 0?'条件':'审批'} 
                          />
                        ]
                      }, [])
                    }
                  </div>
                ]
              }, [])
            }
          </div>
          <EndNode 
            // click={this.startClick.bind(this)}
            branches = {Object.keys(this.state.nodes).length}
          />
        </div>
        <Card
          title='节点属性'
          // bordered={false} 
          actions={[
            // <Button type={"primary"}>保存</Button>,
            // <Button>取消</Button>
            <a>保存</a>,
            <a onClick={this.cancel.bind(this)}>取消</a>,
          ]}
          style={{ position: 'fixed', right: 0, top: 0, display: this.state.optionPaneVisible?'block':'none' }}
        >
          <SForm 
            formItems={formItems}
          />
        </Card>
      </>
    )
  }
}

export default App;