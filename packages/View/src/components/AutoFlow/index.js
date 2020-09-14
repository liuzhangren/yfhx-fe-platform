import React from 'react';
import G6 from '@antv/g6';
import dataSource from './dataSource';
import SForm from '../Form/SForm'
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  Button,
  Menu
} from 'antd'

const width = 1200;
const height = 800;

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowPanel: false,
      rightClickMenu: {
        position: 'absolute',
        padding: '10px 5px',
        left: '-150px'
      }
    }
    this.g6 = G6.registerNode(
      'sql',
      {
        drawShape(cfg, group) {
          
          const rect = group.addShape('rect', {
            attrs: {
              x: -100,
              y: -40,
              width: 200,
              height: 80,
              radius: 10,
              stroke: '#5B8FF9',
              fill: '#C6E5FF',
              lineWidth: 3,
            },
            name: 'rect-shape',
          });
          // if (cfg.label) {
          //   group.addShape('text', {
          //     attrs: {
          //       text: cfg.label,
          //       x: 0,
          //       y: 0,
          //       fill: '#00287E',
          //       fontSize: 28,
          //       textAlign: 'center',
          //       textBaseline: 'middle',
          //       fontWeight: 'bold',
          //     },
          //     name: 'text-shape',
          //   });
          // }
          return rect;
        },
      },
      'single-node',
    );
  }

  componentWillMount() {
    const temp = []
    const newData = dataSource.reduce((r, c) => {
      return {
        ...r,
        [c.resourceId]: c
      }
    }, {})
    dataSource.forEach((item) => {
      if(item.outgoing.length > 0 && item.stencil.id === 'UserTask') {
        temp.push(item)
      }
    })
    const startNode = dataSource.filter((c) => c.stencil.id === 'StartNoneEvent')[0]
    const endNode = dataSource.filter((c) => c.stencil.id === 'EndNoneEvent')[0]
    const afterPartData = [startNode, ...temp, endNode]
    this.setState({
      initData: afterPartData
    })
    this.getData(afterPartData)
  }

  componentDidMount() {
    const self = this
    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      layout: {
        type: 'dagre',
        nodesepFunc: d => {
          if (d.id === '3') {
            return 500;
          }
          return 100;
        },
        ranksep: 70,
        controlPoints: true
      },
      defaultNode: {
        type: 'sql',
        labelCfg: {
          style: {
            fill: '#00287E',
            fontSize: 28,
            textAlign: 'center',
            textBaseline: 'middle',
            fontWeight: 'bold',
          },
        },
      },
      defaultEdge: {
        type: 'polyline',
        style: {
          radius: 20,
          offset: 45,
          endArrow: true,
          lineWidth: 2,
          stroke: '#C2C8D5',
        },
      },
      nodeStateStyles: {
        selected: {
          stroke: '#d9d9d9',
          fill: '#5394ef',
        }
      },
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'click-select'
        ],
      },
      fitView: true,
    });
    graph.on('click', ev => {
      if(ev.item) {
        this.setState({
          isShowPanel: true
        })
      }else {
        this.setState({
          isShowPanel: false
        })
      }
    });
    
    graph.on('node:contextmenu', function(e) {
      e.preventDefault();
      const { rightClickMenu } = self.state;
      // 
      self.setState({
        rightClickMenu: {
          ...rightClickMenu,
          left: `${e.canvasX}px`,
          top: `${e.canvasY}px`
        },
        currentRightClickItemId: e.item._cfg.id
      })
    });
    graph.on('node:mouseleave', function(evt) {
      const { rightClickMenu } = self.state;
      self.setState({
        rightClickMenu: {
          ...rightClickMenu,
          left: -150,
        }
      })
    });
    this.graph = graph
    graph.data(this.state.data)
    graph.render();
  }
  getData(afterPartData) {
    const modelId = uuidv4()
    const data = afterPartData.reduce((r, c) => {
      const nodesItem = {
        id: c.resourceId,
        label: c.properties.name?c.properties.name:
        (c.stencil.id === 'StartNoneEvent'? '开始':'结束')
      }
      if(c.stencil.id !== 'EndNoneEvent') {
        r.nodes.push(nodesItem)
      }else {
        r.nodes.push(nodesItem)
      }
      
      if(c.properties.nextResourceId && !Array.isArray(c.properties.nextResourceId)) {
        const edgesItem = {
          id: `${c.resourceId}-${c.properties.nextResourceId}`,
          source: c.resourceId,
          // shape: "customEdge",
          target: c.properties.nextResourceId
        }
        r.edges.push(edgesItem)
      }else if(c.properties.nextResourceId && Array.isArray(c.properties.nextResourceId)) {
        const edgesItem = c.properties.nextResourceId.reduce((_r, _c) => {
          return [
            ..._r,
            {
              id: `${c.resourceId}-${_c}`,
              source: c.resourceId,
              target: _c
            }
          ]
        }, [])
        r.edges.push(...edgesItem)
      }
      return r
    }, {nodes: [], edges: []})
    this.setState({
      data
    })
    return data
  }
  cancel() {
    this.setState({
      isShowPanel: false
    })
  }
  handleClick(e) {
    const initialModel = {
      "resourceId": "",
      "properties": {
        "overrideid": "",
        "name": "",
        "documentation": "",
        "executionlisteners": "",
        "initiator": "",
        "formkeydefinition": "",
        "formproperties": "",
        "nextResourceId": ""
      },
      "stencil": {
        "id": "UserTask"
      },
      "childShapes": [],
      "outgoing": [{
        "resourceId": ""
      }],
      "bounds": {
        "lowerRight": {
          "x": 60,
          "y": 190
        },
        "upperLeft": {
          "x": 30,
          "y": 160
        }
      },
      "dockers": []
    }
    const { data, currentRightClickItemId, initData } = this.state
    // 
    if(e.key === 'add') {
      const res = initData.reduce((r, c) => {
        if(c.resourceId === currentRightClickItemId) {
          const modelId = uuidv4()
          initialModel.resourceId = modelId
          initialModel.outgoing = c.outgoing
          initialModel.properties.nextResourceId = c.properties.nextResourceId
          initialModel.properties.name = '节点'
          c.properties.nextResourceId = modelId
          c.outgoing = [{resourceId: modelId}]
          r = [...r, c, initialModel]
        }else {
          r = [...r, c]
        }
        return r
      }, [])
      this.setState({
        initData: res
      })
      const data = this.getData(res)
      // debugger
      this.graph.data(data)
      this.graph.render();
    }else {

    }
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
    return (
      <div id="container" style={{width: '100vw', height: 800, position: 'relative'}}>
        <Card
          title='节点属性'
          // bordered={false} 
          actions={[
            // <Button type={"primary"}>保存</Button>,
            // <Button>取消</Button>
            <a>保存</a>,
            <a onClick={this.cancel.bind(this)}>取消</a>,
          ]}
          style={{ position: 'fixed', right: 0, top: 0, display: this.state.isShowPanel?'block':'none' }}
        >
          <SForm 
            formItems={formItems}
          />
        </Card>
        <div style={this.state.rightClickMenu}>
          <Menu
            // theme='dark'
            onClick={this.handleClick.bind(this)}
          >
            
            <Menu.SubMenu key="sub1" title={<div style={{width: '80px'}}>新增节点</div>}>
              <Menu.Item key='add'>
                条件
              </Menu.Item>
              <Menu.Item key='add'>
                审批
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key='del'>删除节点</Menu.Item>
          </Menu>
        </div>
      </div>
    )
  }
}