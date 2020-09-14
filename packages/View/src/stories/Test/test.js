// import React from 'react';
// import style from '../../components/Test/index.css'
// import Test from '../../components/Test';
// import { v4 as uuidv4 } from 'uuid';
// export default class TestPage extends React.Component {
//   state = {
//     dataSource: [
//       {
//         resourceId: "sid-6BD76B47-76C4-444F-A368-C1ADE8B97C14",
//         properties: {
//           overrideid: "",
//           name: "",
//           documentation: "",
//           executionlisteners: "",
//           initiator: "",
//           formkeydefinition: "",
//           formproperties: "",
//           nextResourceId: "sid-3C3F06A1-91BC-47E5-A635-FC34E78074E9"
//         },
//         children: {
//           0: [{resourceId: '0'}, {resourceId: '01'}, {
//             resourceId: '1',
//             children: {
//               11: [{resourceId: '111'}],
//               22: [{resourceId: '111222'}]
//             }
//           }],
//           1: [
//             {
//               resourceId: 'asdadsas'
//             },
//             {
//               resourceId: 'adasdasadxzxca'
//             }
//           ]
//         },
//         stencil: {
//           id: "StartNoneEvent"
//         },
//         outgoing: [
//           {resourceId: "sid-854AA8DA-F779-49AD-BEB3-EFC9871C9B5F"}
//         ]
//       }
//     ]
//   }
//   addCondition(id) {
//     const { dataSource } = this.state
//     // 
//     const uuid = uuidv4()
//     dataSource.forEach((c) => {
//       if(c.resourceId === id) {
//         c.children[uuid] = [{resourceId: uuid, children: {}}]
//       }
//     })
//     debugger
//     this.setState({
//       dataSource
//     })
//   }
//   addNode(obj, key) {
//     const { dataSource } = this.state
//     if(key === 3) {
//       debugger
//     }else { 
//       debugger
//       // if() {

//       // }
//     }
//   }
//   render() {
//     return (
//       <div className={style.dingFlowDesign}>
//         <Test 
//           dataSource={this.state.dataSource} 
//           addCondition={this.addCondition.bind(this)}
//           addNode={this.addNode.bind(this)}
//         />
//       </div>
//     )
//   }
// }


// const data = {
//   id: 1,
//   childNode: {
//     id: 11,
//     childNode: {
//       id: 22,
//       childNode: null
//     }
//   }
// }

// const findItemAndChange = (data, id) => {
//   if(data.id != id) {
//     const res = findItemAndChange(data.childNode, id)
//     data.childNode = res
//   }else {
//     const { childNode } = data
//     data.childNode = {
//       id: 33,
//       childNode
//     }
//   }
//   return data
// }

// const tt = findItemAndChange(data, 22)
// console.log(tt)

const func = () => {
  console.log('hello world')
}

eval('func')()